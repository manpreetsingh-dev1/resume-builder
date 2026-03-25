import { Check, Palette } from "lucide-react";
import React, { useState } from "react";

const ColorPicker = ({ selectedColor, onChange }) => {
  const colors = [
    { name: "deep teal", value: "#028174" },
    { name: "aqua teal", value: "#0AB68B" },
    { name: "mint", value: "#92DE8B" },
    { name: "sand", value: "#FFE3B3" },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-[#92DE8B] bg-[#FFFBF1] px-4 py-2 text-sm text-[#028174] transition hover:border-[#028174] hover:bg-[#FFE3B3]"
      >
        <Palette size={15} />
        <span className="max-sm:hidden">Accent</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-20 mt-3 grid w-72 grid-cols-4 gap-3 rounded-[24px] border border-[#BDE7C1] bg-[#FFFBF1] p-4 shadow-[0_20px_50px_rgba(2,129,116,0.12)]">
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
              <p className="mt-1 text-center text-[11px] capitalize text-[#028174]">
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
