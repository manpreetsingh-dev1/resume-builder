import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');

                .footer-body {
                    font-family: 'Manrope', sans-serif;
                }
            `}</style>

      <footer className="footer-body mt-14 border-t border-[#BDE7C1] bg-[#FFE3B3] px-6 py-16 text-[13px] text-[#3e7b70] md:px-16 lg:px-24 xl:px-32">
        <div className="flex flex-wrap justify-center gap-10 md:gap-16 lg:justify-between">
          <div className="flex flex-wrap items-start gap-10 md:gap-[60px] xl:gap-[120px]">
            <Link to="/" className="flex items-center">
              <img src="/logo.svg" alt="Resume Builder logo" className="h-11 w-auto" />
            </Link>

            <div>
              <p className="font-semibold text-[#025c52]">Product</p>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link to="/" className="transition hover:text-[#028174]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="transition hover:text-[#028174]">
                    Support
                  </Link>
                </li>
                <li>
                  <a href="#templates" className="transition hover:text-[#028174]">
                    Templates
                  </a>
                </li>
                <li>
                  <Link to="/app" className="transition hover:text-[#028174]">
                    Builder
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-[#4c3f31]">Resources</p>
              <ul className="mt-2 space-y-2">
                <li>
                  <Link to="/" className="transition hover:text-[#8a6f4d]">
                    Company
                  </Link>
                </li>
                <li>
                  <a href="#templates" className="transition hover:text-[#8a6f4d]">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="#templates" className="transition hover:text-[#8a6f4d]">
                    Community
                  </a>
                </li>
                <li>
                  <Link to="/contact" className="transition hover:text-[#8a6f4d]">
                    Contact
                    <span className="ml-2 rounded-md bg-[#8a6f4d] px-2 py-1 text-xs text-[#f7efe3]">
                      Say hello
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/app" className="transition hover:text-[#8a6f4d]">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-[#4c3f31]">Legal</p>
              <ul className="mt-2 space-y-2">
                <li>
                  <a href="#" className="transition hover:text-[#8a6f4d]">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition hover:text-[#8a6f4d]">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 max-md:items-center max-md:text-center">
            <p className="max-w-60 leading-6">
              Helping every job seeker present their story with more calm, clarity,
              and confidence.
            </p>

            <div className="mt-3 flex items-center gap-4">
              <a href="https://dribbble.com/prebuiltui" target="_blank" rel="noreferrer">
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
                  className="size-5 transition hover:text-[#8a6f4d]"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"></path>
                  <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"></path>
                  <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"></path>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/prebuiltui" target="_blank" rel="noreferrer">
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
                  className="size-5 transition hover:text-[#8a6f4d]"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="https://x.com/prebuiltui" target="_blank" rel="noreferrer">
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
                  className="size-5 transition hover:text-[#8a6f4d]"
                  aria-hidden="true"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="https://www.youtube.com/@prebuiltui" target="_blank" rel="noreferrer">
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
                  className="size-6 transition hover:text-[#8a6f4d]"
                  aria-hidden="true"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                  <path d="m10 15 5-3-5-3z"></path>
                </svg>
              </a>
            </div>

            <p className="mt-3 text-center">© 2026 Resume Builder</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
