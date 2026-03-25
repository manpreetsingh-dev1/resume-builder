import React from "react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="home-body mx-auto mt-14 w-full max-w-6xl px-4 md:px-8">
      <div className="relative overflow-hidden rounded-[34px] border border-[#BDE7C1] bg-[#FFE3B3] px-6 py-10 shadow-[0_22px_70px_rgba(2,129,116,0.12)] sm:px-10 sm:py-14">
        <div className="vintage-drift absolute -right-16 top-0 h-40 w-40 rounded-full bg-[#0AB68B]/20 blur-3xl" />
        <div className="vintage-float absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-[#92DE8B]/45 blur-2xl" />

        <div className="relative flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[#028174]">
              Start Strong
            </p>
            <h2 className="home-display text-4xl leading-tight text-[#025c52] sm:text-5xl">
              Build a resume that feels polished, warm, and ready to send.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[#3e7b70] sm:text-base">
              Move from rough notes to a presentable resume with calmer colors,
              cleaner structure, and faster editing.
            </p>
          </div>

          <Link
            to="/app"
            className="inline-flex items-center gap-2 rounded-full border border-[#028174] bg-[#028174] px-8 py-3 text-sm font-medium text-[#FFFBF1] transition hover:bg-[#0AB68B]"
          >
            <span>Get Started</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
