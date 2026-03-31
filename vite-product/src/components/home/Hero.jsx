import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const companies = ["Atelier", "Northwind", "Autumn & Co.", "Ledger", "Aster"];

  return (
    <section className="home-body relative overflow-hidden px-4 pb-24 md:px-10 xl:px-20">
      <div className="vintage-drift absolute left-[8%] top-24 h-52 w-52 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="vintage-float absolute right-[6%] top-44 h-64 w-64 rounded-full bg-yellow-100/30 blur-3xl" />

      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between py-6 text-sm text-[var(--premium-charcoal)]">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className="font-medium transition hover:text-[var(--premium-gold)]">Home</Link>
          <Link to="/contact" className="font-medium transition hover:text-[var(--premium-gold)]">Contact</Link>
        </div>

        <div className="hidden gap-3 md:flex">
          {!user ? (
            <>
              <Link to="app?state=register" className="premium-btn-primary rounded-full px-6 py-2.5 text-sm font-medium">
                Get started
              </Link>
              <Link to="app?state=login" className="premium-btn-outline rounded-full px-6 py-2.5 text-sm font-medium">
                Login
              </Link>
            </>
          ) : (
            <Link to="/app" className="premium-btn-primary rounded-full px-7 py-2.5 text-sm font-medium">
              Dashboard
            </Link>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          className="rounded-full p-2 md:hidden border-2 border-[var(--premium-slate)] hover:border-[var(--premium-gold)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--premium-charcoal)]">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-[var(--premium-midnight)] text-lg text-white backdrop-blur md:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}
      >
        <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-[var(--premium-gold)] transition">Home</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-[var(--premium-gold)] transition">Contact</Link>
        {!user ? (
          <>
            <Link to="app?state=register" onClick={() => setMenuOpen(false)} className="hover:text-[var(--premium-gold)] transition">Get started</Link>
            <Link to="app?state=login" onClick={() => setMenuOpen(false)} className="hover:text-[var(--premium-gold)] transition">Login</Link>
          </>
        ) : (
          <Link to="/app" onClick={() => setMenuOpen(false)} className="hover:text-[var(--premium-gold)] transition">Dashboard</Link>
        )}
        <button onClick={() => setMenuOpen(false)} className="rounded-full px-5 py-2 text-sm border-2 border-[var(--premium-gold)] text-[var(--premium-gold)] hover:bg-[var(--premium-gold)] hover:text-white transition">
          Close
        </button>
      </div>

      <div className="mx-auto grid max-w-7xl gap-14 pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="vintage-fade-up">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-[var(--premium-charcoal)] shadow-sm">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" alt="user one" className="size-8 rounded-full border-2 border-white object-cover" />
              <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="user two" className="size-8 rounded-full border-2 border-white object-cover" />
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="user three" className="size-8 rounded-full border-2 border-white object-cover" />
            </div>
            <span className="font-medium">Trusted by 10,000+ job seekers</span>
          </div>

          <h1 className="home-display max-w-4xl text-6xl leading-[0.95] text-[var(--premium-charcoal)] md:text-7xl xl:text-8xl font-bold">
            Build resumes with professional precision.
          </h1>

          <p className="text-[var(--premium-slate)] mt-7 max-w-xl text-base leading-8 md:text-lg">
            Create, refine, and download professional resumes with AI assistance,
            thoughtful layouts, and a premium design that feels crafted instead
            of generic.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/app" className="premium-btn-primary rounded-full px-8 py-3 font-medium">
              Get Started
            </Link>
            <Link to="/contact" className="premium-btn-outline rounded-full px-8 py-3 font-medium">
              Contact Us
            </Link>
          </div>

          <div className="vintage-muted-text mt-12 flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="vintage-accent">*</span>
              AI summaries and bullet polishing
            </div>
            <div className="flex items-center gap-2">
              <span className="vintage-accent">*</span>
              Template switching with instant preview
            </div>
          </div>
        </div>

        <div className="vintage-float relative">
          <div className="vintage-card rounded-[32px] p-5">
            <div className="rounded-[28px] border border-[var(--vintage-border)] bg-[linear-gradient(180deg,_var(--vintage-cream)_0%,_var(--vintage-paper)_100%)] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--vintage-olive)]">
                Why people use it
              </p>
              <h2 className="home-display mt-2 text-4xl text-[var(--vintage-walnut)]">
                Everything stays simple while your resume gets better.
              </h2>

              <div className="mt-6 grid gap-4">
                <div className="rounded-[22px] border border-[var(--vintage-border)] bg-white/80 p-4">
                  <p className="text-sm font-semibold text-[var(--vintage-olive)]">Write faster</p>
                  <p className="vintage-muted-text mt-2 text-sm leading-6">
                    Use AI help for summaries and experience bullets without leaving the builder.
                  </p>
                </div>

                <div className="rounded-[22px] border border-[var(--vintage-border)] bg-white/80 p-4">
                  <p className="text-sm font-semibold text-[var(--vintage-olive)]">Switch templates easily</p>
                  <p className="vintage-muted-text mt-2 text-sm leading-6">
                    Try different resume looks instantly and keep your content intact.
                  </p>
                </div>

                <div className="rounded-[22px] border border-[var(--vintage-border)] bg-white/80 p-4">
                  <p className="text-sm font-semibold text-[var(--vintage-olive)]">Save and share confidently</p>
                  <p className="vintage-muted-text mt-2 text-sm leading-6">
                    Download polished resumes or share a public link when you are ready.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-[26px] border border-[rgba(238,187,34,0.3)] bg-[var(--vintage-highlight)] px-5 py-4 shadow-[0_18px_50px_rgba(83,43,43,0.14)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--vintage-olive)]">
                Built for clarity
              </p>
              <p className="mt-1 text-sm text-[var(--vintage-walnut)]">
                Clean editing, clear previews, quicker decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div id="templates" className="mx-auto mt-20 max-w-6xl border-t border-[var(--vintage-border)] pt-8">
        <p className="mb-6 text-center text-xs uppercase tracking-[0.34em] text-[var(--vintage-olive)]">
          Trusted by thoughtful teams
        </p>
        <div className="grid grid-cols-2 gap-4 text-center text-sm text-[var(--vintage-muted)] md:grid-cols-5">
          {companies.map((company) => (
            <div key={company} className="rounded-full border border-[var(--vintage-border)] bg-[var(--vintage-paper)] px-5 py-3 shadow-sm">
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
