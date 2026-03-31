import { Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const ClassicTemplate = ({ data, accentColor }) => {
  const themeAccent = accentColor || "var(--vintage-olive)";

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="mx-auto max-w-4xl bg-[var(--vintage-paper)] p-8 leading-relaxed text-[var(--vintage-walnut)]">
      <header className="mb-8 border-b-2 pb-6 text-center" style={{ borderColor: themeAccent }}>
        <h1 className="font-display mb-2 text-4xl" style={{ color: themeAccent }}>
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        {data.personal_info?.profession && (
          <p className="mb-3 text-sm uppercase tracking-[0.3em]" style={{ color: themeAccent }}>
            {data.personal_info.profession}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-4 text-sm text-[var(--vintage-muted)]">
          {data.personal_info?.email && <div className="flex items-center gap-1"><Mail className="size-4" style={{ color: themeAccent }} /><span>{data.personal_info.email}</span></div>}
          {data.personal_info?.phone && <div className="flex items-center gap-1"><Phone className="size-4" style={{ color: themeAccent }} /><span>{data.personal_info.phone}</span></div>}
          {data.personal_info?.location && <div className="flex items-center gap-1"><MapPin className="size-4" style={{ color: themeAccent }} /><span>{data.personal_info.location}</span></div>}
          {data.personal_info?.linkedin && <div className="flex items-center gap-1"><Linkedin className="size-4" style={{ color: themeAccent }} /><span className="break-all">{data.personal_info.linkedin}</span></div>}
          {data.personal_info?.website && <div className="flex items-center gap-1"><Globe className="size-4" style={{ color: themeAccent }} /><span className="break-all">{data.personal_info.website}</span></div>}
        </div>
      </header>

      {data.professional_summary && (
        <section className="mb-6">
          <h2 className="mb-3 text-xl font-semibold" style={{ color: themeAccent }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p className="leading-relaxed text-[var(--vintage-muted)]">{data.professional_summary}</p>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold" style={{ color: themeAccent }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-l-[3px] pl-4" style={{ borderColor: themeAccent }}>
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[var(--vintage-walnut)]">{exp.position}</h3>
                    <p className="font-medium" style={{ color: themeAccent }}>{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-[var(--vintage-muted)]">
                    <p>{formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}</p>
                  </div>
                </div>
                {exp.description && <div className="whitespace-pre-line leading-relaxed text-[var(--vintage-muted)]">{exp.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.project && data.project.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold" style={{ color: themeAccent }}>
            PROJECTS
          </h2>
          <div className="space-y-3">
            {data.project.map((proj, index) => (
              <div key={index} className="border-l-[3px] pl-5" style={{ borderColor: `${themeAccent}66` }}>
                <h3 className="font-semibold text-[var(--vintage-walnut)]">{proj.name}</h3>
                <p style={{ color: themeAccent }}>{proj.type}</p>
                <p className="text-[var(--vintage-muted)]">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-4 text-xl font-semibold" style={{ color: themeAccent }}>
            EDUCATION
          </h2>
          <div className="space-y-3">
            {data.education.map((edu, index) => (
              <div key={index} className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--vintage-walnut)]">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <p style={{ color: themeAccent }}>{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-[var(--vintage-muted)]">GPA: {edu.gpa}</p>}
                </div>
                <div className="text-sm text-[var(--vintage-muted)]">
                  <p>{formatDate(edu.graduation_date)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section className="mb-2">
          <h2 className="mb-4 text-xl font-semibold" style={{ color: themeAccent }}>
            CORE SKILLS
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <div key={index} className="rounded-full px-3 py-1.5 text-sm text-white" style={{ backgroundColor: themeAccent }}>
                {skill}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
