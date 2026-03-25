import { Check, Layout } from "lucide-react";
import React, { useState } from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview: "Balanced sections with timeless spacing and a clean professional rhythm.",
    },
    {
      id: "modern",
      name: "Modern",
      preview: "Strong header treatment and polished structure with calm modern contrast.",
    },
    {
      id: "minimal-image",
      name: "Minimal Image",
      preview: "Photo-led layout with restrained typography and elegant vertical flow.",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "Quiet, content-first presentation with lots of breathing room.",
    },
    {
      id: "editorial",
      name: "Editorial",
      preview: "Magazine-inspired layout with serif hierarchy and a soft premium look.",
    },
    {
      id: "heritage",
      name: "Heritage",
      preview: "Warm split-column design using muted vintage tones and classic structure.",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-[#92DE8B] bg-[#FFFBF1] px-4 py-2 text-sm text-[#028174] transition hover:border-[#028174] hover:bg-[#FFE3B3]"
      >
        <Layout size={14} />
        <span className="max-sm:hidden">Templates</span>
      </button>

      {isOpen && (
        <div className="absolute top-full z-20 mt-3 w-80 space-y-3 rounded-[24px] border border-[#BDE7C1] bg-[#FFFBF1] p-4 shadow-[0_20px_50px_rgba(2,129,116,0.12)]">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                if (typeof onChange === "function") {
                  onChange(template.id);
                }
                setIsOpen(false);
              }}
              className={`relative cursor-pointer rounded-2xl border p-4 transition ${
                selectedTemplate === template.id
                  ? "border-[#028174] bg-[#FFE3B3]"
                  : "border-[#BDE7C1] hover:border-[#0AB68B] hover:bg-[#F4FFE7]"
              }`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-[#028174] text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-display text-2xl leading-none text-[#025c52]">
                  {template.name}
                </h4>
                <div className="rounded-xl bg-[#F4FFE7] px-3 py-2 text-xs leading-5 text-[#3e7b70]">
                  {template.preview}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
