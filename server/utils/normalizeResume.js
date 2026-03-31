const normalizeResume = (resume) => {
  if (!resume) {
    return resume;
  }

  const normalizedResume =
    typeof resume.toObject === "function" ? resume.toObject() : { ...resume };

  normalizedResume._id = normalizedResume._id?.toString?.() || normalizedResume._id;
  normalizedResume.title =
    typeof normalizedResume.title === "string"
      ? normalizedResume.title
      : "Untitled Resume";
  normalizedResume.public = Boolean(normalizedResume.public);
  normalizedResume.template =
    typeof normalizedResume.template === "string"
      ? normalizedResume.template
      : "classic";
  normalizedResume.accent_color =
    typeof normalizedResume.accent_color === "string"
      ? normalizedResume.accent_color
      : "#028174";
  normalizedResume.professional_summary =
    typeof normalizedResume.professional_summary === "string"
      ? normalizedResume.professional_summary
      : "";
  normalizedResume.skills = Array.isArray(normalizedResume.skills)
    ? normalizedResume.skills
    : [];
  normalizedResume.experience = Array.isArray(normalizedResume.experience)
    ? normalizedResume.experience
    : [];
  normalizedResume.education = Array.isArray(normalizedResume.education)
    ? normalizedResume.education
    : [];
  normalizedResume.project = Array.isArray(normalizedResume.project)
    ? normalizedResume.project
    : [];

  normalizedResume.personal_info =
    normalizedResume.personal_info &&
    typeof normalizedResume.personal_info === "object"
      ? normalizedResume.personal_info
      : {};

  normalizedResume.personal_info = {
    image:
      typeof normalizedResume.personal_info.image === "string"
        ? normalizedResume.personal_info.image
        : "",
    full_name:
      typeof normalizedResume.personal_info.full_name === "string"
        ? normalizedResume.personal_info.full_name
        : "",
    profession:
      typeof normalizedResume.personal_info.profession === "string"
        ? normalizedResume.personal_info.profession
        : "",
    email:
      typeof normalizedResume.personal_info.email === "string"
        ? normalizedResume.personal_info.email
        : "",
    phone:
      typeof normalizedResume.personal_info.phone === "string"
        ? normalizedResume.personal_info.phone
        : "",
    location:
      typeof normalizedResume.personal_info.location === "string"
        ? normalizedResume.personal_info.location
        : "",
    linkedin:
      typeof normalizedResume.personal_info.linkedin === "string"
        ? normalizedResume.personal_info.linkedin
        : "",
    website:
      typeof normalizedResume.personal_info.website === "string"
        ? normalizedResume.personal_info.website
        : "",
  };

  return normalizedResume;
};

export default normalizeResume;
