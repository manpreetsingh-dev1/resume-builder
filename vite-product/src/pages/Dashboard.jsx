import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Clock3,
  FilePenLineIcon,
  FileText,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  Sparkles,
  TrashIcon,
  UploadCloud,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getDocument, GlobalWorkerOptions, ImageKind, OPS } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import api from "../configs/api";

GlobalWorkerOptions.workerSrc = pdfWorker;

const Dashboard = () => {
  const { token, user } = useSelector((state) => state.auth);

  const colorClasses = [
    "from-[#028174] via-[#0AB68B] to-[#92DE8B]",
    "from-[#0AB68B] via-[#92DE8B] to-[#FFE3B3]",
    "from-[#028174] via-[#0AB68B] to-[#FFE3B3]",
    "from-[#0E8E7A] via-[#4DCB95] to-[#B9EFA8]",
    "from-[#06796D] via-[#38BC8D] to-[#FFE3B3]",
  ];

  const [allResumes, setAllResumes] = useState([]);
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [removeUploadBackground, setRemoveUploadBackground] = useState(false);
  const [editResumeId, setEditResumeId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const safeResumes = Array.isArray(allResumes)
    ? allResumes.filter(
        (resume) =>
          resume &&
          typeof resume === "object" &&
          "_id" in resume &&
          resume?._id,
      )
    : [];

  const recentResume = safeResumes[0];
  const openResumeBuilder = (resumeId) => {
    const normalizedResumeId =
      typeof resumeId === "string" ? resumeId.trim() : "";

    if (!normalizedResumeId || normalizedResumeId === "undefined") {
      console.error("Refusing to navigate with invalid resumeId:", resumeId);
      toast.error("That resume is missing a valid ID. Please refresh and try again.");
      return;
    }

    navigate(`/app/builder/${normalizedResumeId}`);
  };

  const getPdfImageObject = (page, imageName) =>
    new Promise((resolve) => {
      let settled = false;

      const complete = (value) => {
        if (!settled) {
          settled = true;
          resolve(value);
        }
      };

      for (const source of [page.objs, page.commonObjs]) {
        try {
          source?.get(imageName, complete);
        } catch {
          // ignore and fall through to timeout resolution
        }
      }

      setTimeout(() => complete(null), 300);
    });

  const createRgbaData = (image) => {
    if (!image?.data || !image.width || !image.height) {
      return null;
    }

    const { data, width, height } = image;

    if (
      image.kind === ImageKind.RGBA_32BPP ||
      data.length === width * height * 4
    ) {
      return new Uint8ClampedArray(data);
    }

    if (
      image.kind === ImageKind.RGB_24BPP ||
      data.length === width * height * 3
    ) {
      const rgba = new Uint8ClampedArray(width * height * 4);

      for (
        let srcIndex = 0, destIndex = 0;
        srcIndex < data.length;
        srcIndex += 3, destIndex += 4
      ) {
        rgba[destIndex] = data[srcIndex];
        rgba[destIndex + 1] = data[srcIndex + 1];
        rgba[destIndex + 2] = data[srcIndex + 2];
        rgba[destIndex + 3] = 255;
      }

      return rgba;
    }

    return null;
  };

  const imageCandidateToFile = async (image, fileName) => {
    if (!image?.width || !image?.height) {
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    if (image.bitmap) {
      context.drawImage(image.bitmap, 0, 0);
    } else {
      const rgbaData = createRgbaData(image);

      if (!rgbaData) {
        return null;
      }

      context.putImageData(
        new ImageData(rgbaData, image.width, image.height),
        0,
        0,
      );
    }

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );

    if (!blob) {
      return null;
    }

    return new File([blob], fileName, { type: "image/png" });
  };

  const scoreImageCandidate = (image) => {
    const width = image?.width || 0;
    const height = image?.height || 0;

    if (width < 64 || height < 64) {
      return 0;
    }

    const area = width * height;
    const aspectRatio = width / height;
    const aspectScore = aspectRatio >= 0.6 && aspectRatio <= 1.8 ? 1.5 : 0.75;

    return area * aspectScore;
  };

  const extractPdfProfileImage = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let bestCandidate = null;
    let bestScore = 0;

    for (
      let pageNumber = 1;
      pageNumber <= Math.min(pdf.numPages, 2);
      pageNumber += 1
    ) {
      const page = await pdf.getPage(pageNumber);
      const operatorList = await page.getOperatorList();

      for (let index = 0; index < operatorList.fnArray.length; index += 1) {
        const fn = operatorList.fnArray[index];
        const args = operatorList.argsArray[index];
        let image = null;

        if (fn === OPS.paintImageXObject) {
          image = await getPdfImageObject(page, args[0]);
        } else if (fn === OPS.paintInlineImageXObject) {
          image = args[0];
        }

        if (!image) {
          continue;
        }

        const candidateScore = scoreImageCandidate(image);

        if (candidateScore > bestScore) {
          bestScore = candidateScore;
          bestCandidate = image;
        }
      }
    }

    if (!bestCandidate) {
      return null;
    }

    const safeBaseName = file.name.replace(/\.pdf$/i, "");
    return imageCandidateToFile(bestCandidate, `${safeBaseName}-profile.png`);
  };

  const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let extractedText = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ");

      extractedText += `${pageText}\n`;
    }

    return extractedText.trim();
  };

  const createResume = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.post(
        "/resumes/create",
        { title },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAllResumes([...allResumes, data.resume]);
      setTitle("");
      setShowCreateResume(false);
      openResumeBuilder(data.resume?._id);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!(resume instanceof File)) {
        throw new Error("Please select a PDF file before uploading.");
      }

      const resumeText = await extractPdfText(resume);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("resumeText", resumeText);

      if (profileImage instanceof File) {
        formData.append("image", profileImage);
      }

      if (removeUploadBackground) {
        formData.append("removeBackground", "yes");
      }

      const { data } = await api.post("/ai/upload-resume", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTitle("");
      setResume(null);
      setProfileImage(null);
      setRemoveUploadBackground(false);
      setShowUploadResume(false);
      openResumeBuilder(data.resumeId);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeFileChange = async (file) => {
    setResume(file);

    if (!(file instanceof File)) {
      setProfileImage(null);
      setRemoveUploadBackground(false);
      return;
    }

    if (profileImage instanceof File) {
      return;
    }

    try {
      const extractedImage = await extractPdfProfileImage(file);

      if (extractedImage) {
        setProfileImage(extractedImage);
        toast.success("Existing profile image detected from the PDF.");
      }
    } catch {
      // Keep upload flow working even if image extraction fails.
    }
  };

  const editTitle = async (event) => {
    try {
      event.preventDefault();
      const { data } = await api.put(
        "/resumes/update/",
        { resumeId: editResumeId, resumeData: { title } },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAllResumes(
        allResumes.map((resume) =>
          resume && resume?._id === editResumeId
            ? { ...resume, title }
            : resume,
        ),
      );
      setTitle("");
      setEditResumeId("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this resume?",
      );
      if (confirm) {
        const { data } = await api.delete(`/resumes/delete/${resumeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllResumes(
          allResumes.filter((resume) => resume && resume?._id !== resumeId),
        );
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const loadAllResumes = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/users/resumes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllResumes(Array.isArray(data.resumes) ? data.resumes : []);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllResumes();
  }, [token]);

  return (
    <div className="px-4 py-8 text-[#4c3f31] md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[32px] border border-[#BDE7C1] bg-[radial-gradient(circle_at_top_left,_rgba(10,182,139,0.22),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(146,222,139,0.28),_transparent_30%),linear-gradient(135deg,_#028174_0%,_#0AB68B_55%,_#FFE3B3_158%)] p-8 text-[#FFFBF1] shadow-[0_24px_80px_rgba(2,129,116,0.18)]">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-[#FFFBF1]">
              Dashboard
            </p>
            <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
              Welcome back{user?.name ? `, ${user.name}` : ""}. Build sharper
              resumes with a cleaner workflow.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#f7efe3]/90 md:text-base">
              Start a new resume, upload an existing one, or jump right back
              into your latest draft.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-[#f4e6d2]/80">
                  Total Resumes
                </p>
                <p className="mt-3 text-3xl font-semibold">
                  {safeResumes.length}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-[#f4e6d2]/80">
                  Public Profiles
                </p>
                <p className="mt-3 text-3xl font-semibold">
                  {safeResumes.filter((resume) => resume?.public).length}{" "}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.22em] text-[#f4e6d2]/80">
                  Last Update
                </p>
                <p className="mt-3 text-lg font-semibold">
                  {recentResume
                    ? new Date(recentResume.updatedAt).toLocaleDateString()
                    : "No drafts yet"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#028174]">
                Quick Actions
              </p>
              <p className="mt-1 text-sm text-[#3e7b70]">
                These cards start a new task right away.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <button
                onClick={() => setShowCreateResume(true)}
                className="group rounded-[28px] border border-[#BDE7C1] bg-[#FFFBF1] p-6 text-left shadow-[0_20px_60px_rgba(2,129,116,0.07)] transition hover:-translate-y-1 hover:border-[#028174] hover:shadow-[0_24px_70px_rgba(10,182,139,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-[#E9F9E8] p-3 text-[#028174]">
                    <PlusIcon className="size-6" />
                  </div>
                  <ArrowRight className="size-5 text-[#7FCF95] transition group-hover:translate-x-1 group-hover:text-[#028174]" />
                </div>
                <h2 className="mt-8 font-display text-3xl text-[#43372c]">
                  Create Resume
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#75614c]">
                  Start from a blank canvas and craft a polished resume section
                  by section.
                </p>
              </button>

              <button
                onClick={() => setShowUploadResume(true)}
                className="group rounded-[28px] border border-[#BDE7C1] bg-[#FFFBF1] p-6 text-left shadow-[0_20px_60px_rgba(2,129,116,0.07)] transition hover:-translate-y-1 hover:border-[#0AB68B] hover:shadow-[0_24px_70px_rgba(10,182,139,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-[#E9F9E8] p-3 text-[#0AB68B]">
                    <UploadCloudIcon className="size-6" />
                  </div>
                  <ArrowRight className="size-5 text-[#7FCF95] transition group-hover:translate-x-1 group-hover:text-[#0AB68B]" />
                </div>
                <h2 className="mt-8 font-display text-3xl text-[#43372c]">
                  Upload Existing
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#75614c]">
                  Parse an existing PDF resume, keep the essentials, and
                  continue editing in the builder.
                </p>
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#028174]">
              Workspace Summary
            </p>
            <p className="mt-1 text-sm text-[#3e7b70]">
              These blocks are only informational and do not open anything.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-[#D8F0C8] bg-[#FFFDF6] p-4 shadow-[0_8px_24px_rgba(2,129,116,0.04)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#F4FFE7] p-2.5 text-[#028174]">
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#025c52]">
                    Resume Library
                  </p>
                  <p className="text-xs text-[#3e7b70]">
                    Manage every draft from one place
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[22px] border border-[#D8F0C8] bg-[#FFFDF6] p-4 shadow-[0_8px_24px_rgba(2,129,116,0.04)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#FFF3D4] p-2.5 text-[#028174]">
                  <Clock3 className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#025c52]">
                    Fast Edits
                  </p>
                  <p className="text-xs text-[#3e7b70]">
                    Open, rename, and continue in a single click
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[22px] border border-[#D8F0C8] bg-[#FFFDF6] p-4 shadow-[0_8px_24px_rgba(2,129,116,0.04)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#F4FFE7] p-2.5 text-[#0AB68B]">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#025c52]">
                    AI Assistance
                  </p>
                  <p className="text-xs text-[#3e7b70]">
                    Enhance imported and manually built resumes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-[#BDE7C1] bg-[#FFFBF1] p-6 shadow-[0_24px_70px_rgba(2,129,116,0.06)]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#9a876f]">
                Your Resumes
              </p>
              <h2 className="font-display mt-2 text-4xl text-[#43372c]">
                Recent drafts and published profiles
              </h2>
            </div>
            <p className="text-sm text-[#75614c]">
              Click any card to open the builder and keep editing.
            </p>
          </div>

          {allResumes.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-[#d7c8b3] bg-[#f6eee3] px-6 py-16 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#e5d7c5] text-[#7b6854]">
                <FilePenLineIcon className="size-7" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#4c3f31]">
                No resumes yet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#75614c]">
                Create a fresh resume or upload an existing PDF to see your
                drafts appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {safeResumes.map((resume, index) => {
                if (!resume?._id) return null;
                const colorClass = colorClasses[index % colorClasses.length];
                return (
                  <div
                    key={resume?._id}
                    onClick={() => {
                      if (!resume?._id) {
                        console.error("Invalid resume:", resume);
                        return;
                      }
                      openResumeBuilder(resume._id);
                    }}
                    className="group relative cursor-pointer overflow-hidden rounded-[28px] border border-[#ddcfbc] bg-[#fffaf3] text-left transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(93,74,55,0.12)]"
                  >
                    <div
                      className={`h-34 bg-gradient-to-br ${colorClass} p-5 text-white`}
                    >
                      {/* ACTION BUTTONS */}
                      <div className="absolute right-4 top-4 z-10 flex gap-2 opacity-0 transition group-hover:opacity-100">
                        {/* DELETE */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!resume?._id) return;
                            deleteResume(resume._id);
                          }}
                          className="rounded-full bg-white/15 p-2 text-white backdrop-blur transition hover:bg-white/25"
                        >
                          <TrashIcon className="size-4" />
                        </button>

                        {/* EDIT */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!resume?._id) return;
                            setEditResumeId(resume?._id);
                            setTitle(resume?.title || "");
                          }}
                          className="rounded-full bg-white/15 p-2 text-white backdrop-blur transition hover:bg-white/25"
                        >
                          <PencilIcon className="size-4" />
                        </button>
                      </div>

                      <div className="inline-flex rounded-full bg-white/15 p-3 backdrop-blur">
                        <FilePenLineIcon className="size-5" />
                      </div>

                      <div className="mt-10 flex items-start justify-between gap-4">
                        <div>
                          <p className="max-w-[14rem] text-lg font-semibold leading-6">
                            {resume.title}
                          </p>
                          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/75">
                            {resume?.public ? "Public" : "Private"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#7b6854]">Updated</span>
                        <span className="font-medium text-[#4c3f31]">
                          {resume?.updatedAt
                            ? new Date(resume.updatedAt).toLocaleDateString()
                            : "N/A"}{" "}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#7b6854]">Template</span>
                        <span className="font-medium capitalize text-[#4c3f31]">
                          {(resume.template || "classic").replace("-", " ")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-2xl bg-[#f1e7d9] px-4 py-3 text-sm text-[#6e5a46]">
                        <span>Open builder</span>
                        <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 z-10 flex items-center justify-center bg-[#2d241d]/65 backdrop-blur"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-[28px] border border-[#ddcfbc] bg-[#fbf6ef] p-7 shadow-[0_24px_80px_rgba(93,74,55,0.22)]"
            >
              <h2 className="font-display mb-2 text-4xl text-[#43372c]">
                Create a Resume
              </h2>
              <p className="mb-5 text-sm text-[#75614c]">
                Give your draft a clear title so you can find it quickly later.
              </p>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="mb-4 w-full"
                required
              />
              <button className="w-full rounded-2xl bg-[#9a7a52] py-3 text-[#fbf6ef] transition-colors hover:bg-[#846746]">
                Create Resume
              </button>
              <XIcon
                className="absolute right-5 top-5 cursor-pointer text-[#a6957e] transition-colors hover:text-[#6e5a46]"
                onClick={() => {
                  setShowCreateResume(false);
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 z-10 flex items-center justify-center bg-[#2d241d]/65 backdrop-blur"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-[28px] border border-[#ddcfbc] bg-[#fbf6ef] p-7 shadow-[0_24px_80px_rgba(93,74,55,0.22)]"
            >
              <h2 className="font-display mb-2 text-4xl text-[#43372c]">
                Upload a Resume
              </h2>
              <p className="mb-5 text-sm text-[#75614c]">
                Import a PDF resume and optionally attach a profile image for
                templates that use it.
              </p>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="mb-4 w-full"
                required
              />

              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-[#5c4c3d]"
                >
                  Select Resume file
                  <div className="my-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[24px] border border-dashed border-[#d5c6b1] p-4 py-10 text-[#9d8a72] transition-colors hover:border-[#7b8b74] hover:text-[#7b8b74]">
                    {resume ? (
                      <p className="text-[#7b8b74]">{resume.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-14 stroke-1" />
                        <p>Upload resume</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  hidden
                  onChange={(e) =>
                    handleResumeFileChange(e.target.files?.[0] || null)
                  }
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="profile-image-input"
                  className="block text-sm text-[#5c4c3d]"
                >
                  Optional profile image
                  <div className="my-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[24px] border border-dashed border-[#d5c6b1] p-4 py-8 text-[#9d8a72] transition-colors hover:border-[#b56e58] hover:text-[#b56e58]">
                    {profileImage ? (
                      <p className="text-[#b56e58]">{profileImage.name}</p>
                    ) : (
                      <>
                        <UploadCloud className="size-12 stroke-1" />
                        <p>Upload profile image</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="profile-image-input"
                  accept="image/jpeg,image/png"
                  hidden
                  onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                />
              </div>
              {profileImage && (
                <label className="mb-4 flex items-center gap-3 text-sm text-[#5c4c3d]">
                  <input
                    type="checkbox"
                    checked={removeUploadBackground}
                    onChange={() => setRemoveUploadBackground((prev) => !prev)}
                  />
                  Remove image background
                </label>
              )}
              <button
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#9a7a52] py-3 text-[#fbf6ef] transition-colors hover:bg-[#846746] disabled:opacity-70"
              >
                {isLoading && (
                  <LoaderCircleIcon className="animate-spin size-4 text-white" />
                )}

                {isLoading ? "uploading..." : "Upload Resume"}
              </button>
              <XIcon
                className="absolute right-5 top-5 cursor-pointer text-[#a6957e] transition-colors hover:text-[#6e5a46]"
                onClick={() => {
                  setShowUploadResume(false);
                  setTitle("");
                  setResume(null);
                  setProfileImage(null);
                  setRemoveUploadBackground(false);
                }}
              />
            </div>
          </form>
        )}

        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeId("")}
            className="fixed inset-0 z-10 flex items-center justify-center bg-[#2d241d]/65 backdrop-blur"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-[28px] border border-[#ddcfbc] bg-[#fbf6ef] p-7 shadow-[0_24px_80px_rgba(93,74,55,0.22)]"
            >
              <h2 className="font-display mb-2 text-4xl text-[#43372c]">
                Edit Resume Title
              </h2>
              <p className="mb-5 text-sm text-[#75614c]">
                Rename this draft without changing any of the saved content
                inside it.
              </p>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter Resume Title"
                className="mb-4 w-full"
                required
              />
              <button className="w-full rounded-2xl bg-[#9a7a52] py-3 text-[#fbf6ef] transition-colors hover:bg-[#846746]">
                Update
              </button>
              <XIcon
                className="absolute right-5 top-5 cursor-pointer text-[#a6957e] transition-colors hover:text-[#6e5a46]"
                onClick={() => {
                  setEditResumeId("");
                  setTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
