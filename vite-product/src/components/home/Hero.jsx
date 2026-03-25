import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const companies = ["Atelier", "Northwind", "Autumn & Co.", "Ledger", "Aster"];

  return (
    <section className="home-body relative overflow-hidden px-4 pb-24 md:px-10 xl:px-20">
      <div className="vintage-drift absolute left-[8%] top-24 h-52 w-52 rounded-full bg-[#0AB68B]/25 blur-3xl" />
      <div className="vintage-float absolute right-[6%] top-44 h-64 w-64 rounded-full bg-[#92DE8B]/30 blur-3xl" />

      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between py-6 text-sm text-[#025c52]">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className="transition hover:text-[#8a6f4d]">
            Home
          </Link>
          <Link to="/contact" className="transition hover:text-[#8a6f4d]">
            Contact
          </Link>
        </div>

        <div className="hidden gap-3 md:flex">
          {!user ? (
            <>
              <Link
                to="app?state=register"
                className="rounded-full border border-[#028174] bg-[#028174] px-6 py-2.5 text-[#FFFBF1] transition hover:bg-[#0AB68B]"
              >
                Get started
              </Link>
              <Link
                to="app?state=login"
                className="rounded-full border border-[#92DE8B] bg-[#FFFBF1] px-6 py-2.5 text-[#025c52] transition hover:border-[#028174] hover:bg-[#FFE3B3]"
              >
                Login
              </Link>
            </>
          ) : (
            <Link
              to="/app"
              className="rounded-full border border-[#028174] bg-[#028174] px-7 py-2.5 text-[#FFFBF1] transition hover:bg-[#0AB68B]"
            >
              Dashboard
            </Link>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          className="rounded-full border border-[#92DE8B] bg-[#FFFBF1] p-2 text-[#025c52] transition hover:border-[#028174] md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-[#028174]/80 text-lg text-[#FFFBF1] backdrop-blur md:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}
      >
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>
          Contact
        </Link>
        {!user ? (
          <>
            <Link to="app?state=register" onClick={() => setMenuOpen(false)}>
              Get started
            </Link>
            <Link to="app?state=login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
          </>
        ) : (
          <Link to="/app" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
        )}
        <button
          onClick={() => setMenuOpen(false)}
          className="rounded-full border border-[#92DE8B] bg-[#028174] px-5 py-2 text-sm text-[#FFFBF1]"
        >
          Close
        </button>
      </div>

      <div className="mx-auto grid max-w-7xl gap-14 pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="vintage-fade-up">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-[#d8ccb8] bg-[#f8f1e8] px-4 py-2 text-sm text-[#6d5b46] shadow-sm">
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
                alt="user one"
                className="size-8 rounded-full border-2 border-[#f8f1e8] object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                alt="user two"
                className="size-8 rounded-full border-2 border-[#f8f1e8] object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                alt="user three"
                className="size-8 rounded-full border-2 border-[#f8f1e8] object-cover"
              />
            </div>
            <span>Trusted by 10,000+ job seekers</span>
          </div>

          <h1 className="home-display max-w-4xl text-6xl leading-[0.95] text-[#4c3f31] md:text-7xl xl:text-8xl">
            Build resumes with a softer, smarter touch.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-[#6d5b46] md:text-lg">
            Create, refine, and download professional resumes with AI assistance,
            thoughtful layouts, and a warm editorial style that feels crafted instead
            of generic.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/app"
              className="rounded-full border border-[#8a6f4d] bg-[#8a6f4d] px-8 py-3 text-[#f6efe3] transition hover:bg-[#735b3d]"
            >
              Get Started
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-[#cab79c] bg-[#f8f1e8] px-8 py-3 text-[#5f513e] transition hover:border-[#8a6f4d] hover:bg-[#efe4d4]"
            >
              Contact Us
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-[#7a6750]">
            <div className="flex items-center gap-2">
              <span className="text-[#8a6f4d]">*</span>
              AI summaries and bullet polishing
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8a6f4d]">*</span>
              Template switching with instant preview
            </div>
          </div>
        </div>

        <div className="vintage-float relative">
          <div className="rounded-[32px] border border-[#BDE7C1] bg-[#FFFBF1] p-5 shadow-[0_24px_80px_rgba(2,129,116,0.15)]">
            <div className="rounded-[28px] border border-[#D8F0C8] bg-[linear-gradient(180deg,_#FFFBF1_0%,_#F4FFE7_100%)] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-[#028174]">
                Why people use it
              </p>
              <h2 className="home-display mt-2 text-4xl text-[#025c52]">
                Everything stays simple while your resume gets better.
              </h2>

              <div className="mt-6 grid gap-4">
                <div className="rounded-[22px] border border-[#BDE7C1] bg-white/80 p-4">
                  <p className="text-sm font-semibold text-[#028174]">Write faster</p>
                  <p className="mt-2 text-sm leading-6 text-[#3e7b70]">
                    Use AI help for summaries and experience bullets without leaving the builder.
                  </p>
                </div>

                <div className="rounded-[22px] border border-[#BDE7C1] bg-white/80 p-4">
                  <p className="text-sm font-semibold text-[#028174]">Switch templates easily</p>
                  <p className="mt-2 text-sm leading-6 text-[#3e7b70]">
                    Try different resume looks instantly and keep your content intact.
                  </p>
                </div>

                <div className="rounded-[22px] border border-[#BDE7C1] bg-white/80 p-4">
                  <p className="text-sm font-semibold text-[#028174]">Save and share confidently</p>
                  <p className="mt-2 text-sm leading-6 text-[#3e7b70]">
                    Download polished resumes or share a public link when you are ready.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-[26px] border border-[#92DE8B] bg-[#FFE3B3] px-5 py-4 shadow-[0_18px_50px_rgba(2,129,116,0.14)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[#028174]">
                Built for clarity
              </p>
              <p className="mt-1 text-sm text-[#025c52]">
                Clean editing, clear previews, quicker decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="templates" className="mx-auto mt-20 max-w-6xl border-t border-[#d9cdbd] pt-8">
        <p className="mb-6 text-center text-xs uppercase tracking-[0.34em] text-[#8a6f4d]">
          Trusted by thoughtful teams
        </p>
        <div className="grid grid-cols-2 gap-4 text-center text-sm text-[#76634d] md:grid-cols-5">
          {companies.map((company) => (
            <div
              key={company}
              className="rounded-full border border-[#d8ccb8] bg-[#f8f1e8] px-5 py-3 shadow-sm"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
