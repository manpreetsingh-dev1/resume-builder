import { Check, Layout } from "lucide-react";
import React, { useState } from "react";

const TemplateSelector = ({ selectedTemplate, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates = [
    { id: "classic", name: "Classic", preview: "Balanced sections with timeless spacing and a clean professional rhythm." },
    { id: "modern", name: "Modern", preview: "Strong header treatment and polished structure with calm modern contrast." },
    { id: "minimal-image", name: "Minimal Image", preview: "Photo-led layout with restrained typography and elegant vertical flow." },
    { id: "minimal", name: "Minimal", preview: "Quiet, content-first presentation with lots of breathing room." },
    { id: "editorial", name: "Editorial", preview: "Magazine-inspired layout with serif hierarchy and a soft premium look." },
    { id: "heritage", name: "Heritage", preview: "Warm split-column design using muted vintage tones and classic structure." },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="vintage-btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
      >
        <Layout size={14} />
        <span className="max-sm:hidden">Templates</span>
      </button>

      {isOpen && (
        <div className="vintage-card absolute top-full z-20 mt-3 w-80 space-y-3 rounded-[24px] p-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                if (typeof onChange === "function") onChange(template.id);
                setIsOpen(false);
              }}
              className={`relative cursor-pointer rounded-2xl border p-4 transition ${
                selectedTemplate === template.id
                  ? "border-[var(--vintage-gold)] bg-[var(--vintage-highlight)]"
                  : "border-[var(--vintage-border)] hover:border-[var(--vintage-olive)] hover:bg-[rgba(75,138,126,0.08)]"
              }`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-[var(--vintage-olive)] text-white">
                  <Check className="h-3.5 w-3.5" />
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-display text-2xl leading-none text-[var(--vintage-walnut)]">
                  {template.name}
                </h4>
                <div className="rounded-xl bg-[var(--vintage-paper)] px-3 py-2 text-xs leading-5 text-[var(--vintage-muted)]">
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
