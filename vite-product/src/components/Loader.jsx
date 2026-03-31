import React from "react";

const Loader = () => {
  return (
    <div className="vintage-app-shell flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-14 animate-spin rounded-full border-[3px] border-[var(--vintage-border)] border-t-[var(--vintage-olive)]"></div>
        <p className="text-sm tracking-[0.22em] text-[var(--vintage-olive)] uppercase">
          Loading workspace
        </p>
      </div>
    </div>
  );
};

export default Loader;
