import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-14 border-t border-[var(--vintage-border)] bg-[var(--vintage-paper)] px-6 py-16 text-[13px] text-[var(--vintage-muted)] md:px-16 lg:px-24 xl:px-32">
      <div className="flex flex-wrap justify-center gap-10 md:gap-16 lg:justify-between">
        <div className="flex flex-wrap items-start gap-10 md:gap-[60px] xl:gap-[120px]">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Resume Builder logo" className="h-11 w-auto" />
          </Link>

          <div>
            <p className="font-semibold text-[var(--vintage-walnut)]">Product</p>
            <ul className="mt-2 space-y-2">
              <li><Link to="/" className="transition hover:text-[var(--vintage-gold)]">Home</Link></li>
              <li><Link to="/contact" className="transition hover:text-[var(--vintage-gold)]">Support</Link></li>
              <li><a href="#templates" className="transition hover:text-[var(--vintage-gold)]">Templates</a></li>
              <li><Link to="/app" className="transition hover:text-[var(--vintage-gold)]">Builder</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-[var(--vintage-walnut)]">Resources</p>
            <ul className="mt-2 space-y-2">
              <li><Link to="/" className="transition hover:text-[var(--vintage-gold)]">Company</Link></li>
              <li><a href="#templates" className="transition hover:text-[var(--vintage-gold)]">Blogs</a></li>
              <li><a href="#templates" className="transition hover:text-[var(--vintage-gold)]">Community</a></li>
              <li>
                <Link to="/contact" className="transition hover:text-[var(--vintage-gold)]">
                  Contact
                  <span className="ml-2 rounded-md bg-[var(--vintage-olive)] px-2 py-1 text-xs text-[var(--vintage-cream)]">
                    Say hello
                  </span>
                </Link>
              </li>
              <li><Link to="/app" className="transition hover:text-[var(--vintage-gold)]">About</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-[var(--vintage-walnut)]">Legal</p>
            <ul className="mt-2 space-y-2">
              <li><a href="#" className="transition hover:text-[var(--vintage-gold)]">Privacy</a></li>
              <li><a href="#" className="transition hover:text-[var(--vintage-gold)]">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 max-md:items-center max-md:text-center">
          <p className="max-w-60 leading-6">
            Helping every job seeker present their story with more calm, clarity,
            and confidence.
          </p>

          <div className="mt-3 flex items-center gap-4 text-[var(--vintage-olive)]">
            <a href="https://dribbble.com/prebuiltui" target="_blank" rel="noreferrer" className="transition hover:text-[var(--vintage-gold)]">Dribbble</a>
            <a href="https://www.linkedin.com/company/prebuiltui" target="_blank" rel="noreferrer" className="transition hover:text-[var(--vintage-gold)]">LinkedIn</a>
            <a href="https://x.com/prebuiltui" target="_blank" rel="noreferrer" className="transition hover:text-[var(--vintage-gold)]">X</a>
            <a href="https://www.youtube.com/@prebuiltui" target="_blank" rel="noreferrer" className="transition hover:text-[var(--vintage-gold)]">YouTube</a>
          </div>

          <p className="mt-3 text-center">© 2026 Resume Builder</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
