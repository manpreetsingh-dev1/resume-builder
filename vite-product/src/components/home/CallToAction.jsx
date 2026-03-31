import React from "react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="home-body mx-auto mt-14 w-full max-w-6xl px-4 md:px-8">
      <div className="premium-card relative overflow-hidden rounded-[34px] px-6 py-10 sm:px-10 sm:py-14 bg-gradient-to-br from-white to-blue-50">
        <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-36 w-36 rounded-full bg-yellow-100/30 blur-2xl" />

        <div className="relative flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.32em] text-[var(--premium-gold)] font-bold">
              Start Strong
            </p>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl text-[var(--premium-charcoal)] font-bold">
              Build a resume that feels polished and professional.
            </h2>
            <p className="text-[var(--premium-slate)] mt-4 max-w-xl text-sm leading-7 sm:text-base">
              Move from rough notes to a presentable resume with professional colors,
              cleaner structure, and faster editing.
            </p>
          </div>

          <a
            href="/app"
            className="premium-btn-primary inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium hover:bg-yellow-600 transition-all"
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
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
