const HeritageTemplate = ({ data, accentColor }) => {
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
    <div className="mx-auto grid max-w-4xl grid-cols-[0.82fr_1.18fr] bg-[var(--vintage-paper)] text-[var(--vintage-walnut)]">
      <aside className="min-h-full p-8" style={{ backgroundColor: `${themeAccent}12` }}>
        <p className="mb-3 text-xs uppercase tracking-[0.32em]" style={{ color: themeAccent }}>
          Heritage
        </p>
        <h1 className="font-display text-5xl leading-[0.92] text-[var(--vintage-walnut)]">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        {data.personal_info?.profession && (
          <p className="mt-4 text-sm uppercase tracking-[0.26em]" style={{ color: themeAccent }}>
            {data.personal_info.profession}
          </p>
        )}

        <div className="mt-8 space-y-2 text-sm leading-6 text-[var(--vintage-muted)]">
          {data.personal_info?.email && <p>{data.personal_info.email}</p>}
          {data.personal_info?.phone && <p>{data.personal_info.phone}</p>}
          {data.personal_info?.location && <p>{data.personal_info.location}</p>}
          {data.personal_info?.linkedin && <p className="break-all">{data.personal_info.linkedin}</p>}
          {data.personal_info?.website && <p className="break-all">{data.personal_info.website}</p>}
        </div>

        {data.skills && data.skills.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xs uppercase tracking-[0.34em]" style={{ color: themeAccent }}>
              Skills
            </h2>
            <div className="space-y-2">
              {data.skills.map((skill, index) => (
                <div key={index} className="rounded-full px-3 py-1.5 text-sm text-white" style={{ backgroundColor: themeAccent }}>
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education && data.education.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xs uppercase tracking-[0.34em]" style={{ color: themeAccent }}>
              Education
            </h2>
            <div className="space-y-4 text-sm">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="font-semibold">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <p>{edu.institution}</p>
                  <p className="text-[var(--vintage-muted)]">
                    {formatDate(edu.graduation_date)}
                    {edu.gpa ? ` • GPA: ${edu.gpa}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      <main className="p-8">
        {data.professional_summary && (
          <section className="mb-8 border-b border-[var(--vintage-border)] pb-6">
            <h2 className="mb-4 text-xs uppercase tracking-[0.34em]" style={{ color: themeAccent }}>
              Profile
            </h2>
            <p className="leading-8 text-[var(--vintage-muted)]">{data.professional_summary}</p>
          </section>
        )}

        {data.experience && data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="mb-5 text-xs uppercase tracking-[0.34em]" style={{ color: themeAccent }}>
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-l-[3px] pl-4" style={{ borderColor: `${themeAccent}88` }}>
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--vintage-walnut)]">{exp.position}</h3>
                      <p style={{ color: themeAccent }}>{exp.company}</p>
                    </div>
                    <span className="text-sm text-[var(--vintage-muted)]">
                      {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </span>
                  </div>
                  {exp.description && <p className="whitespace-pre-line leading-7 text-[var(--vintage-muted)]">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {data.project && data.project.length > 0 && (
          <section>
            <h2 className="mb-5 text-xs uppercase tracking-[0.34em]" style={{ color: themeAccent }}>
              Projects
            </h2>
            <div className="space-y-5">
              {data.project.map((project, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-[var(--vintage-walnut)]">{project.name}</h3>
                    {project.type && <p className="text-sm" style={{ color: themeAccent }}>{project.type}</p>}
                  {project.description && <p className="mt-2 leading-7 text-[var(--vintage-muted)]">{project.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default HeritageTemplate;
