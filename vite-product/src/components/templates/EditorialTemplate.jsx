import { Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const EditorialTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="mx-auto max-w-4xl bg-[#fffaf3] p-10 text-[#473b30]">
      <header className="grid gap-8 border-b border-[#dfd2c2] pb-8 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.34em]" style={{ color: accentColor }}>
            Editorial Resume
          </p>
          <h1 className="font-display text-6xl leading-[0.9] text-[#403328]">
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          {data.personal_info?.profession && (
            <p className="mt-4 text-lg text-[#75614c]">{data.personal_info.profession}</p>
          )}
        </div>

        <div className="space-y-2 text-sm text-[#6d5b46]">
          {data.personal_info?.email && (
            <div className="flex items-center gap-2">
              <Mail className="size-4" style={{ color: accentColor }} />
              {data.personal_info.email}
            </div>
          )}
          {data.personal_info?.phone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4" style={{ color: accentColor }} />
              {data.personal_info.phone}
            </div>
          )}
          {data.personal_info?.location && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4" style={{ color: accentColor }} />
              {data.personal_info.location}
            </div>
          )}
          {data.personal_info?.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin className="size-4" style={{ color: accentColor }} />
              <span className="break-all">{data.personal_info.linkedin}</span>
            </div>
          )}
          {data.personal_info?.website && (
            <div className="flex items-center gap-2">
              <Globe className="size-4" style={{ color: accentColor }} />
              <span className="break-all">{data.personal_info.website}</span>
            </div>
          )}
        </div>
      </header>

      {data.professional_summary && (
        <section className="border-b border-[#ece0d1] py-8">
          <p className="max-w-3xl text-lg leading-9 text-[#58493a]">{data.professional_summary}</p>
        </section>
      )}

      <div className="grid gap-10 py-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="mb-5 text-xs uppercase tracking-[0.34em]" style={{ color: accentColor }}>
                Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="mb-2 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-[#3f3327]">{exp.position}</h3>
                        <p className="text-[#6d5b46]">{exp.company}</p>
                      </div>
                      <span className="text-sm text-[#8a745c]">
                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="whitespace-pre-line leading-7 text-[#58493a]">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.project && data.project.length > 0 && (
            <section>
              <h2 className="mb-5 text-xs uppercase tracking-[0.34em]" style={{ color: accentColor }}>
                Projects
              </h2>
              <div className="space-y-5">
                {data.project.map((project, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-[#3f3327]">{project.name}</h3>
                    {project.type && <p className="text-sm text-[#8a745c]">{project.type}</p>}
                    {project.description && (
                      <p className="mt-2 leading-7 text-[#58493a]">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-8 rounded-[28px] bg-[#f3e8d8] p-6">
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="mb-5 text-xs uppercase tracking-[0.34em]" style={{ color: accentColor }}>
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-[#3f3327]">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-[#6d5b46]">{edu.institution}</p>
                    <p className="text-sm text-[#8a745c]">
                      {formatDate(edu.graduation_date)}
                      {edu.gpa ? ` • GPA: ${edu.gpa}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="mb-5 text-xs uppercase tracking-[0.34em]" style={{ color: accentColor }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-white/60 bg-white/60 px-3 py-1.5 text-sm text-[#57483a]"
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

export default EditorialTemplate;
