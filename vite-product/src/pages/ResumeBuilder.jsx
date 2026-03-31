import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ColorPicker from "../components/ColorPicker";
import EducationForm from "../components/EducationForm";
import ExperienceForm from "../components/ExperienceForm";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ProjectForm from "../components/ProjectForm";
import ResumePreview from "../components/ResumePreview";
import SkillsForm from "../components/SkillsForm";
import TemplateSelector from "../components/TemplateSelector";
import api from "../configs/api";

const ResumeBuilder = () => {
  const { resumeId: routeResumeId } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: { image: "" },
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#028174",
    public: false,
  });
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  const resolveResumeId = () => {
    const stateId =
      typeof resumeData?._id === "string" ? resumeData._id.trim() : "";
    const urlId =
      typeof routeResumeId === "string" ? routeResumeId.trim() : "";

    return stateId || urlId;
  };

  useEffect(() => {
    const trimmedRouteResumeId =
      typeof routeResumeId === "string" ? routeResumeId.trim() : "";

    const loadExistingResume = async () => {
      if (!trimmedRouteResumeId || trimmedRouteResumeId === "undefined") {
        console.error("Invalid resumeId from route:", routeResumeId);
        toast.error("Invalid resume link. Redirecting to your dashboard.");
        navigate("/app", { replace: true });
        return;
      }

      try {
        const { data } = await api.get(`/resumes/${trimmedRouteResumeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data?.resume) {
          setResumeData(data.resume);
          document.title = data.resume.title || "Resume Builder";
        }
      } catch (error) {
        console.error("Failed to load resume:", error);
        toast.error(error?.response?.data?.message || error.message);
      }
    };

    if (token && trimmedRouteResumeId && trimmedRouteResumeId !== "undefined") {
      loadExistingResume();
    }
  }, [navigate, routeResumeId, token]);

  const changeResumeVisibility = async () => {
    try {
      const resolvedResumeId = resolveResumeId();

      if (!resolvedResumeId || resolvedResumeId === "undefined") {
        toast.error("Resume ID is missing. Please reload the page.");
        return;
      }

      const formData = new FormData();
      formData.append("resumeId", resolvedResumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public })
      );

      const { data } = await api.put("/resumes/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResumeData((prev) => ({ ...prev, public: !prev.public }));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleShare = () => {
    const resolvedResumeId = resolveResumeId();

    if (!resolvedResumeId) {
      toast.error("Resume ID is missing. Please save the resume first.");
      return;
    }

    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = `${frontendUrl}/view/${resolvedResumeId}`;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" });
    } else {
      toast.error("Sharing is not supported on this browser.");
    }
  };

  const downloadResume = () => {
    window.print();
  };

  const saveResume = async () => {
    try {
      const resolvedResumeId = resolveResumeId();

      if (!resolvedResumeId || resolvedResumeId === "undefined") {
        console.error("Attempted to save with invalid resumeId:", {
          stateId: resumeData?._id,
          routeResumeId,
        });
        toast.error("Resume ID is missing. Please reload the page.");
        return;
      }

      const idToSend = resolvedResumeId.trim();
      console.log("Saving resume with resumeId:", idToSend);

      const updateResumeData = structuredClone(resumeData);
      updateResumeData._id = idToSend;

      if (resumeData.personal_info?.image instanceof File) {
        delete updateResumeData.personal_info.image;
      }

      const formData = new FormData();
      formData.append("resumeId", idToSend);
      formData.append("resumeData", JSON.stringify(updateResumeData));
      formData.append("removeBackground", removeBackground ? "yes" : "no");

      if (resumeData.personal_info?.image instanceof File) {
        formData.append("image", resumeData.personal_info.image);
      }

      for (const [key, value] of formData.entries()) {
        if (key === "image") {
          console.log(`${key}: File(${value.name})`);
        } else if (key === "resumeData") {
          console.log(`${key}: [resume JSON payload]`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const { data } = await api.put("/resumes/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResumeData(data.resume);
      toast.success(data.message || "Resume saved successfully");
    } catch (error) {
      console.error("saveResume error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save resume"
      );
    }
  };

  return (
    <div className="text-[#4c3f31]">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 text-[#7b6854] transitions-all hover:text-[#4c3f31]"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="relative col-span-12 overflow-hidden rounded-[28px] lg:col-span-5">
            <div className="rounded-[28px] border border-[#BDE7C1] bg-[#FFFBF1] p-6 pt-1 shadow-[0_20px_50px_rgba(2,129,116,0.08)]"></div>

            <hr className="absolute left-0 right-0 top-0 border-2 border-[#D8F0C8]" />
            <hr
              className="absolute left-0 top-0 h-1 border-none bg-gradient-to-r from-[#028174] via-[#0AB68B] to-[#92DE8B] transition-all duration-2000"
              style={{
                width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
              }}
            />

            <div className="mb-6 flex items-center justify-between border-b border-[#e4d7c6] py-2">
              <div className="flex items-center gap-2">
                <TemplateSelector
                  selectedTemplate={resumeData.template}
                  onChange={(template) =>
                    setResumeData((prev) => ({ ...prev, template }))
                  }
                />
                <ColorPicker
                  selectedColor={resumeData.accent_color}
                  onChange={(color) =>
                    setResumeData((prev) => ({ ...prev, accent_color: color }))
                  }
                />
              </div>

              <div className="flex items-center">
                {activeSectionIndex !== 0 && (
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prevIndex) =>
                        Math.max(prevIndex - 1, 0)
                      )
                    }
                    className="flex items-center gap-1 rounded-full p-3 text-sm font-medium text-[#75614c] transition-all hover:bg-[#f3e8d8]"
                    disabled={activeSectionIndex === 0}
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>
                )}

                <button
                  onClick={() =>
                    setActiveSectionIndex((prevIndex) =>
                      Math.min(prevIndex + 1, sections.length - 1)
                    )
                  }
                  className={`flex items-center gap-1 rounded-full p-3 text-sm font-medium text-[#75614c] transition-all hover:bg-[#f3e8d8] ${
                    activeSectionIndex === sections.length - 1 && "opacity-50"
                  }`}
                  disabled={activeSectionIndex === sections.length - 1}
                >
                  Next
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {activeSection.id === "personal" && (
                <PersonalInfoForm
                  data={resumeData.personal_info}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personal_info: data,
                    }))
                  }
                  removeBackground={removeBackground}
                  setRemoveBackground={setRemoveBackground}
                />
              )}
              {activeSection.id === "summary" && (
                <ProfessionalSummaryForm
                  data={resumeData.professional_summary}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      professional_summary: data,
                    }))
                  }
                  setResumeData={setResumeData}
                />
              )}
              {activeSection.id === "experience" && (
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      experience: data,
                    }))
                  }
                />
              )}
              {activeSection.id === "education" && (
                <EducationForm
                  data={resumeData.education}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      education: data,
                    }))
                  }
                />
              )}
              {activeSection.id === "projects" && (
                <ProjectForm
                  data={resumeData.project}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      project: data,
                    }))
                  }
                />
              )}
              {activeSection.id === "skills" && (
                <SkillsForm
                  data={resumeData.skills}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      skills: data,
                    }))
                  }
                />
              )}
            </div>

            <button
              onClick={() => {
                toast.promise(saveResume(), { loading: "saving...." });
              }}
              className="mt-6 mb-2 ml-6 rounded-full border border-[#028174] bg-[#028174] px-5 py-2 text-sm text-[#FFFBF1] transition-all hover:bg-[#0AB68B]"
            >
              Save Changes
            </button>
          </div>

          <div className="max-lg:mt-6 lg:col-span-7">
            <div className="relative w-full">
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 rounded-full bg-[#FFE3B3] px-4 py-2 text-xs text-[#028174] transition-colors hover:bg-[#FAD99E]"
                  >
                    <Share2Icon className="size-4" /> share
                  </button>
                )}
                <button
                  onClick={changeResumeVisibility}
                  className="flex items-center gap-2 rounded-full bg-[#E9F9E8] px-4 py-2 text-xs text-[#0AB68B] transition-colors hover:bg-[#D8F4D6]"
                >
                  {resumeData.public ? (
                    <EyeIcon className="size-4" />
                  ) : (
                    <EyeOffIcon className="size-4" />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>
                <button
                  onClick={downloadResume}
                  className="flex items-center gap-2 rounded-full bg-[#92DE8B] px-6 py-2 text-xs text-[#025c52] transition-colors hover:bg-[#7FD67E]"
                >
                  <DownloadIcon className="size-4" /> Download
                </button>
              </div>
            </div>
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
