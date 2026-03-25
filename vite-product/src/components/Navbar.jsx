import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Home, LogOut, Sparkles } from "lucide-react";
import { logout } from "../app/features/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutUser = () => {
    navigate("/");
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#BDE7C1] bg-[#FFFBF1]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-[#025c52] md:px-8">
        <Link to="/" className="flex items-center">
          <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-[#BDE7C1] bg-[#F4FFE7] px-4 py-2 text-sm text-[#028174] sm:flex">
            <Sparkles className="size-4 text-[#0AB68B]" />
            <span>Hi, {user?.name}</span>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#92DE8B] bg-[#FFFBF1] px-5 py-2 text-sm font-medium text-[#028174] transition hover:border-[#028174] hover:bg-[#FFE3B3]"
          >
            <Home className="size-4" />
            Home
          </Link>

          <button
            onClick={logoutUser}
            className="inline-flex items-center gap-2 rounded-full border border-[#028174] bg-[#028174] px-5 py-2 text-sm font-medium text-[#FFFBF1] transition hover:bg-[#0AB68B]"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
