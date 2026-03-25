import React from "react";

const Loader = () => {
  return (
    <div className="vintage-app-shell flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-14 animate-spin rounded-full border-[3px] border-[#BDE7C1] border-t-[#028174]"></div>
        <p className="text-sm tracking-[0.22em] text-[#028174] uppercase">
          Loading workspace
        </p>
      </div>
    </div>
  );
};

export default Loader;
