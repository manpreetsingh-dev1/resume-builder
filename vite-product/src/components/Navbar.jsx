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
    <header className="premium-navbar sticky top-0 z-40">
      <nav className="mx-auto  max-w-7xl items-center  px-4 py-4 md:px-8">
        

        <div className="flex items-center justify-around  gap-3 md:gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-[var(--premium-gold)]/20 bg-[var(--premium-gold)]/10 px-4 py-2 text-sm text-[var(--premium-ivory)] sm:flex">
            <Sparkles className="text-[var(--premium-gold)] size-4" />
            <span>Hi, {user?.name}</span>
          </div>

          <Link
            to="/"
            className="premium-btn-outline bg-amber-50 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium"
          >
            <Home className="size-4" />
            Home
          </Link>

          <button
            onClick={logoutUser}
            className="premium-btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium"
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
