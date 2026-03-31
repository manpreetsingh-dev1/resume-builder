import React from "react";

const Banner = () => {
  return (
    <div className="home-body">
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100/50 px-4 py-3 text-center text-sm uppercase tracking-[0.18em] text-[var(--premium-charcoal)]">
        <p className="vintage-fade-up">
          <span className="mr-3 rounded-full border border-[var(--premium-gold)] bg-[var(--premium-gold)] px-3 py-1 text-[11px] font-bold text-white">
            New
          </span>
          AI Resume Builder with premium, professional-quality layouts
        </p>
      </div>
    </div>
  );
};

export default Banner;
