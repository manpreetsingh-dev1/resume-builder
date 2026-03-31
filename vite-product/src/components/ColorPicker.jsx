import { Check, Palette } from "lucide-react";
import React, { useState } from "react";

const ColorPicker = ({ selectedColor, onChange }) => {
  const colors = [
    { name: "olive", value: "#4B8A7E" },
    { name: "gold", value: "#EEBB22" },
    { name: "walnut", value: "#532B2B" },
    { name: "cream", value: "#FFFDFE" },
    { name: "slate", value: "#475569" },
    { name: "emerald", value: "#10B981" },
    { name: "sapphire", value: "#0EA5E9" },
    { name: "amber", value: "#F59E0B" },
    { name: "rose", value: "#F43F5E" },
    { name: "purple", value: "#A855F7" },
    { name: "teal", value: "#14B8A6" },
    { name: "indigo", value: "#4F46E5" },
    { name: "burgundy", value: "#7C2D12" },
    { name: "navy", value: "#000E56" },
    { name: "sage", value: "#6B7280" },
    { name: "bronze", value: "#92400E" },
    { name: "forest", value: "#15803D" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="vintage-btn-secondary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
      >
        <Palette size={15} />
        <span className="max-sm:hidden">Accent</span>
      </button>

      {isOpen && (
        <div className="vintage-card absolute left-0 right-0 top-full z-20 mt-3 grid w-80 grid-cols-6 gap-3 rounded-[24px] p-4">
          {colors.map((color) => (
            <div
              key={color.value}
              className="group relative flex cursor-pointer flex-col items-center"
              onClick={() => {
                onChange(color.value);
                setIsOpen(false);
              }}
            >
              <div
                className="h-12 w-12 rounded-full border-2 border-transparent transition group-hover:border-black/15"
                style={{ backgroundColor: color.value }}
              ></div>
              {selectedColor === color.value && (
                <div className="absolute inset-x-0 top-0 flex items-center justify-center">
                  <Check className="mt-3 size-4 text-white" />
                </div>
              )}
              <p className="mt-1 text-center text-[11px] capitalize text-[var(--vintage-walnut)]">
                {color.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
