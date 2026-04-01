import React from "react";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import EditorialTemplate from "./templates/EditorialTemplate";
import HeritageTemplate from "./templates/HeritageTemplate";

const ResumePreview = ({
  data = {},
  template,
  accentColor,
  classes = "",
  className = "",
}) => {
  const normalizedData = {
    ...data,
    template: typeof data?.template === "string" ? data.template : "classic",
    accent_color:
      typeof data?.accent_color === "string" && data.accent_color
        ? data.accent_color
        : "#9A7A52",
    personal_info: {
      ...(data?.personal_info || {}),
      image: data?.personal_info?.image || "",
      full_name:
        typeof data?.personal_info?.full_name === "string"
          ? data.personal_info.full_name
          : "",
      profession:
        typeof data?.personal_info?.profession === "string"
          ? data.personal_info.profession
          : "",
      email:
        typeof data?.personal_info?.email === "string"
          ? data.personal_info.email
          : "",
      phone:
        typeof data?.personal_info?.phone === "string"
          ? data.personal_info.phone
          : "",
      location:
        typeof data?.personal_info?.location === "string"
          ? data.personal_info.location
          : "",
      linkedin:
        typeof data?.personal_info?.linkedin === "string"
          ? data.personal_info.linkedin
          : "",
      website:
        typeof data?.personal_info?.website === "string"
          ? data.personal_info.website
          : "",
    },
    professional_summary:
      typeof data?.professional_summary === "string"
        ? data.professional_summary
        : "",
    experience: Array.isArray(data?.experience) ? data.experience : [],
    education: Array.isArray(data?.education) ? data.education : [],
    project: Array.isArray(data?.project) ? data.project : [],
    skills: Array.isArray(data?.skills) ? data.skills : [],
    declaration:
      typeof data?.declaration === "string"
        ? data.declaration
        : "",
  };

  const resolvedTemplate =
    typeof template === "string" ? template : normalizedData.template;
  const resolvedAccentColor =
    typeof accentColor === "string" && accentColor
      ? accentColor
      : normalizedData.accent_color;

  const renderTemplate = () => {
    switch (resolvedTemplate) {
      case "modern":
        return <ModernTemplate data={normalizedData} accentColor={resolvedAccentColor} />;
      case "minimal":
        return <MinimalTemplate data={normalizedData} accentColor={resolvedAccentColor} />;
      case "minimal-image":
        return <MinimalImageTemplate data={normalizedData} accentColor={resolvedAccentColor} />;
      case "editorial":
        return <EditorialTemplate data={normalizedData} accentColor={resolvedAccentColor} />;
      case "heritage":
        return <HeritageTemplate data={normalizedData} accentColor={resolvedAccentColor} />;
      default:
        return <ClassicTemplate data={normalizedData} accentColor={resolvedAccentColor} />;
    }
  };

  return (
    <div className="w-full rounded-[28px] bg-[var(--vintage-highlight)] p-3 shadow-[0_20px_50px_rgba(83,43,43,0.08)]">
      <div
        id="resume-preview"
        className={`overflow-hidden rounded-[22px] border border-[var(--vintage-border)] bg-[var(--vintage-paper)] print:shadow-none print:border-none ${classes} ${className}`.trim()}
      >
        {renderTemplate()}
      </div>
      <style>{`
        @page {
          size: letter;
          margin: 0;
        }

        @media print {
          html, body {
            width: 8.5in;
            height: 11in;
            overflow: hidden;
          }
          body * {
            visibility: hidden;
          }
          #resume-preview, #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResumePreview;
