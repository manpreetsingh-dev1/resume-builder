import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const ResumeBuilder = () => {
  const { resumeId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: { image: "" },
    professional_summary: "",
    experience: "",
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

  useEffect(() => {
  const loadExistingResume = async () => {

    // ✅ MAIN FIX — block invalid id
    if (!resumeId || resumeId === "undefined") {
      console.error("Invalid resumeId:", resumeId);
      return;
    }

    try {
      const { data } = await api.get(`/resumes/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.resume) {
        setResumeData(data.resume);
        document.title = data.resume.title;
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // ✅ SAFE CALL CONDITION
  if (token && resumeId && resumeId !== "undefined") {
    loadExistingResume();
  }
}, [resumeId, token]);


  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append(
        "resumeData",
        JSON.stringify({ public: !resumeData.public }),
      );

      const { data } = await api.put("/api/resumes/update", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResumeData({ ...resumeData, public: !resumeData.public });
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleShare = () => {
    const frontendUrl = window.location.href.split("/app/")[0];
    const resumeUrl = `${frontendUrl}/view/${resumeId}`;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" });
    } else {
      toast.error("Sharing is not supported on this browser.");
    }
  };

  const downloadResume = () => {
    window.print();
  };

  // const saveResume = async () => {
  //   try {
  //     const updateResumeData = structuredClone(resumeData);

  //     if (typeof resumeData.personal_info.image === "object") {
  //       delete updateResumeData.personal_info.image;
  //     }

  //     const formData = new FormData();
  //     formData.append("resumeId", resumeId);
  //     formData.append("resumeData", JSON.stringify(updateResumeData));
  //     if (removeBackground) {
  //       formData.append("removeBackground", "yes");
  //     }
  //     if (typeof resumeData.personal_info.image === "object") {
  //       formData.append("image", resumeData.personal_info.image);
  //     }

  //     const { data } = await api.put("/resumes/update", formData, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     setResumeData(data.resume);
  //     toast.success(data.message);
  //   } catch (error) {
  //     toast.error(error?.response?.data?.message || error.message);
  //   }
  // };

  // ResumeBuilder.jsx

  const saveResume = async () => {
    try {
      // ✅ Use loaded resumeData._id first, fallback to URL resumeId
      const selectedId = resumeData._id || resumeId;

      // ✅ Validate resumeId exists and is not "undefined"
      if (!selectedId || selectedId === "undefined") {
        toast.error("Resume ID is missing. Please reload the page.");
        console.error("Invalid resumeId:", selectedId);
        return;
      }

      // ✅ Trim whitespace
      const idToSend = selectedId.trim();
      console.log("📝 Saving resume with ID:", idToSend);

      // ✅ Create a copy of resume data for submission
      const updateResumeData = structuredClone(resumeData);

      // Remove local image File object if it exists (keep URLs)
      if (typeof resumeData.personal_info?.image === "object") {
        delete updateResumeData.personal_info.image;
      }

      // ✅ Build FormData without manually setting Content-Type
      // The browser will automatically set Content-Type: multipart/form-data with boundary
      const formData = new FormData();
      formData.append("resumeId", idToSend);
      formData.append("resumeData", JSON.stringify(updateResumeData));

      // ✅ Append optional fields
      if (removeBackground) {
        formData.append("removeBackground", "yes");
      }

      // ✅ Append image file if selected (only if it's a File object)
      if (resumeData.personal_info?.image instanceof File) {
        formData.append("image", resumeData.personal_info.image);
        console.log("📸 Image file appended for upload");
      }

      // ✅ Log FormData contents for debugging (FormData doesn't have direct iteration, use entries())
      console.log("📦 FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (key === "image") {
          console.log(`  ${key}: File(${value.name})`);
        } else if (key === "resumeData") {
          console.log(`  ${key}: [resume JSON data]`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }

      // ✅ Send to backend
      const { data } = await api.put("/resumes/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT set Content-Type header - let browser handle it with boundary
        },
      });

      // ✅ Update local state with response
      setResumeData(data.resume);
      toast.success(data.message || "Resume saved successfully");
      console.log("✅ Resume saved successfully");
    } catch (error) {
      console.error("❌ saveResume error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to save resume";
      toast.error(errorMessage);
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
                        Math.max(prevIndex - 1, 0),
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
                      Math.min(prevIndex + 1, sections.length - 1),
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
                toast.promise(saveResume, { loading: "saving...." });
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
