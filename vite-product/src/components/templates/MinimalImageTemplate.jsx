import { Mail, MapPin, Phone } from "lucide-react";

const MinimalImageTemplate = ({ data, accentColor }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const profileImageSrc =
    typeof data.personal_info?.image === "string"
      ? data.personal_info.image
      : data.personal_info?.image
        ? URL.createObjectURL(data.personal_info.image)
        : "";

  return (
    <div className="mx-auto max-w-5xl bg-[#fffaf3] text-[#4a3c31]">
      <div className="grid grid-cols-3">
        <div className="col-span-1 bg-[#efe4d4] py-10">
          {profileImageSrc ? (
            <div className="mb-6">
              <img
                src={profileImageSrc}
                alt="Profile"
                className="mx-auto h-32 w-32 rounded-full object-cover"
                style={{ background: `${accentColor}55` }}
              />
            </div>
          ) : null}
        </div>

        <div className="col-span-2 flex flex-col justify-center px-8 py-10">
          <h1 className="font-display text-5xl leading-none text-[#45392d]">
            {data.personal_info?.full_name || "Your Name"}
          </h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.3em] text-[#7b8b74]">
            {data?.personal_info?.profession || "Profession"}
          </p>
        </div>

        <aside className="col-span-1 border-r border-[#dacdbb] bg-[#f5ecdf] p-6 pt-0">
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold tracking-[0.28em] text-[#7a654f]">
              CONTACT
            </h2>
            <div className="space-y-2 text-sm">
              {data.personal_info?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} style={{ color: accentColor }} />
                  <span>{data.personal_info.phone}</span>
                </div>
              )}
              {data.personal_info?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} style={{ color: accentColor }} />
                  <span>{data.personal_info.email}</span>
                </div>
              )}
              {data.personal_info?.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: accentColor }} />
                  <span>{data.personal_info.location}</span>
                </div>
              )}
            </div>
          </section>

          {data.education && data.education.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold tracking-[0.28em] text-[#7a654f]">
                EDUCATION
              </h2>
              <div className="space-y-4 text-sm">
                {data.education.map((edu, index) => (
                  <div key={index}>
                    <p className="font-semibold uppercase">{edu.degree}</p>
                    <p className="text-[#75614c]">{edu.institution}</p>
                    <p className="text-xs text-[#8d775e]">{formatDate(edu.graduation_date)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold tracking-[0.28em] text-[#7a654f]">
                SKILLS
              </h2>
              <ul className="space-y-1 text-sm">
                {data.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        <main className="col-span-2 p-8 pt-0">
          {data.professional_summary && (
            <section className="mb-8">
              <h2 className="mb-3 text-sm font-semibold tracking-[0.28em]" style={{ color: accentColor }}>
                SUMMARY
              </h2>
              <p className="leading-7 text-[#5c4c3d]">{data.professional_summary}</p>
            </section>
          )}

          {data.experience && data.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-4 text-sm font-semibold tracking-[0.28em]" style={{ color: accentColor }}>
                EXPERIENCE
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-[#3f3327]">{exp.position}</h3>
                      <span className="text-xs text-[#8d775e]">
                        {formatDate(exp.start_date)} -{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </span>
                    </div>
                    <p className="mb-2 text-sm" style={{ color: accentColor }}>
                      {exp.company}
                    </p>
                    {exp.description && (
                      <ul className="list-inside list-disc space-y-1 text-sm leading-relaxed text-[#5c4c3d]">
                        {exp.description.split("\n").map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.project && data.project.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-[0.28em]" style={{ color: accentColor }}>
                PROJECTS
              </h2>
              <div className="space-y-4">
                {data.project.map((project, index) => (
                  <div key={index}>
                    <h3 className="mt-3 text-md font-medium text-[#43372c]">{project.name}</h3>
                    <p className="mb-1 text-sm" style={{ color: accentColor }}>
                      {project.type}
                    </p>
                    {project.description && (
                      <ul className="list-inside list-disc space-y-1 text-sm text-[#5c4c3d]">
                        {project.description.split("\n").map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MinimalImageTemplate;
