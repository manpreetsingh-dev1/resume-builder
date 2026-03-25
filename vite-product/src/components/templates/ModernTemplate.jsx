import { Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const ModernTemplate = ({ data, accentColor }) => {
  const normalizeExternalUrl = (value = "") => {
    if (!value) return "";
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  };

  const formatLinkLabel = (value = "") =>
    value.replace(/^https?:\/\/(www\.)?/i, "");

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="mx-auto max-w-4xl bg-[#fbf6ef] text-[#4c3f31]">
      <header className="p-8 text-white" style={{ backgroundColor: accentColor }}>
        <h1 className="font-display mb-3 text-5xl leading-none">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        {data.personal_info?.profession && (
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-white/85">
            {data.personal_info.profession}
          </p>
        )}

        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4" />
              <span>{data.personal_info.email}</span>
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4" />
              <span>{data.personal_info.phone}</span>
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>{data.personal_info.location}</span>
            </div>
          )}
          {data.personal_info?.linkedin && (
            <a
              target="_blank"
              rel="noreferrer"
              href={normalizeExternalUrl(data.personal_info.linkedin)}
              className="flex items-center gap-2"
            >
              <Linkedin className="size-4" />
              <span className="break-all text-xs">
                {formatLinkLabel(data.personal_info.linkedin)}
              </span>
            </a>
          )}
          {data.personal_info?.website && (
            <a
              target="_blank"
              rel="noreferrer"
              href={normalizeExternalUrl(data.personal_info.website)}
              className="flex items-center gap-2"
            >
              <Globe className="size-4" />
              <span className="break-all text-xs">
                {formatLinkLabel(data.personal_info.website)}
              </span>
            </a>
          )}
        </div>
      </header>

      <div className="p-8">
        {data.professional_summary && (
          <section className="mb-8">
            <h2 className="mb-4 border-b border-[#e3d7c8] pb-2 text-2xl font-light">
              Professional Summary
            </h2>
            <p className="leading-8 text-[#5a4a3c]">{data.professional_summary}</p>
          </section>
        )}

        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-6 border-b border-[#e3d7c8] pb-2 text-2xl font-light">
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div
                  key={index}
                  className="relative border-l pl-6"
                  style={{ borderLeftColor: `${accentColor}70` }}
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-medium text-[#3f3327]">{exp.position}</h3>
                      <p className="font-medium" style={{ color: accentColor }}>
                        {exp.company}
                      </p>
                    </div>
                    <div className="rounded-full bg-[#efe4d4] px-3 py-1 text-sm text-[#75614c]">
                      {formatDate(exp.start_date)} -{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="mt-3 whitespace-pre-line leading-7 text-[#5a4a3c]">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.project && data.project.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-4 border-b border-[#e3d7c8] pb-2 text-2xl font-light">
              Projects
            </h2>
            <div className="space-y-6">
              {data.project.map((project, index) => (
                <div
                  key={index}
                  className="relative border-l pl-6"
                  style={{ borderLeftColor: `${accentColor}70` }}
                >
                  <h3 className="text-lg font-medium text-[#3f3327]">{project.name}</h3>
                  {project.type && <p className="mt-1 text-sm text-[#75614c]">{project.type}</p>}
                  {project.description && (
                    <div className="mt-3 text-sm leading-7 text-[#5a4a3c]">
                      {project.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-8 sm:grid-cols-2">
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="mb-4 border-b border-[#e3d7c8] pb-2 text-2xl font-light">
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-[#3f3327]">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p style={{ color: accentColor }}>{edu.institution}</p>
                    <div className="flex items-center justify-between text-sm text-[#75614c]">
                      <span>{formatDate(edu.graduation_date)}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="mb-4 border-b border-[#e3d7c8] pb-2 text-2xl font-light">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full px-3 py-1 text-sm text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
