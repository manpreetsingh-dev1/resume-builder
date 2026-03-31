const MinimalTemplate = ({ data, accentColor }) => {
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
    <div className="mx-auto max-w-4xl bg-[var(--vintage-paper)] p-8 text-[var(--vintage-walnut)]">
      <header className="mb-10 border-b border-[var(--vintage-border)] pb-8">
        <h1 className="font-display mb-3 text-5xl leading-none">
          {data.personal_info?.full_name || "Your Name"}
        </h1>
        {data.personal_info?.profession && (
          <p className="mb-4 text-sm uppercase tracking-[0.28em]" style={{ color: themeAccent }}>
            {data.personal_info.profession}
          </p>
        )}

        <div className="flex flex-wrap gap-6 text-sm text-[var(--vintage-muted)]">
          {data.personal_info?.email && <span>{data.personal_info.email}</span>}
          {data.personal_info?.phone && <span>{data.personal_info.phone}</span>}
          {data.personal_info?.location && <span>{data.personal_info.location}</span>}
          {data.personal_info?.linkedin && <span className="break-all">{data.personal_info.linkedin}</span>}
          {data.personal_info?.website && <span className="break-all">{data.personal_info.website}</span>}
        </div>
      </header>

      {data.professional_summary && (
        <section className="mb-10">
          <p className="leading-8 text-[var(--vintage-muted)]">{data.professional_summary}</p>
        </section>
      )}

      {data.experience && data.experience.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.32em]" style={{ color: themeAccent }}>
            Experience
          </h2>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="mb-1 flex justify-between gap-4">
                  <h3 className="text-lg font-semibold">{exp.position}</h3>
                  <span className="text-sm text-[var(--vintage-muted)]">
                    {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </span>
                </div>
                <p className="mb-2" style={{ color: themeAccent }}>{exp.company}</p>
                {exp.description && <div className="whitespace-pre-line leading-7 text-[var(--vintage-muted)]">{exp.description}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.project && data.project.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.32em]" style={{ color: themeAccent }}>
            Projects
          </h2>
          <div className="space-y-4">
            {data.project.map((proj, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold">{proj.name}</h3>
                <p className="mb-1" style={{ color: themeAccent }}>{proj.type}</p>
                <p className="text-[var(--vintage-muted)]">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education && data.education.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.32em]" style={{ color: themeAccent }}>
            Education
          </h2>
          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index} className="flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-semibold">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <p style={{ color: themeAccent }}>{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-[var(--vintage-muted)]">GPA: {edu.gpa}</p>}
                </div>
                <span className="text-sm text-[var(--vintage-muted)]">{formatDate(edu.graduation_date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills && data.skills.length > 0 && (
        <section>
          <h2 className="mb-6 text-sm font-medium uppercase tracking-[0.32em]" style={{ color: themeAccent }}>
            Skills
          </h2>
          <div className="text-[var(--vintage-muted)]">{data.skills.join(" • ")}</div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
