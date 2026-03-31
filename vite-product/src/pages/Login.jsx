import { Lock, Mail, User2Icon } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import api from "../configs/api";

const Login = () => {
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");

  const [state, setState] = React.useState(urlState || "login");
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post(`/users/${state}`, formData);
      dispatch(login(data));
      localStorage.setItem("token", data.token);
      toast.success(data.message);
    } catch (error) {
      toast(error?.response?.data?.message || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #f7f5f2 0%, #f5f3ef 100%)" }}>
      <form
        onSubmit={handleSubmit}
        className="premium-card w-full rounded-[28px] px-8 py-10 text-center sm:w-[26rem]"
      >
        <h1 className="premium-heading text-4xl">
          {state === "login" ? "Login" : "Sign up"}
        </h1>
        <p className="text-[var(--premium-slate)] mt-2 text-sm">
          Please {state} to continue
        </p>

        {state !== "login" && (
          <div className="mt-6 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-[var(--premium-slate)] bg-white pl-6">
            <User2Icon size={16} className="text-[var(--premium-gold)]" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border-none bg-transparent outline-none ring-0 text-[var(--premium-charcoal)]"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="mt-4 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-[var(--premium-slate)] bg-white pl-6">
          <Mail size={13} className="text-[var(--premium-gold)]" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="border-none bg-transparent outline-none ring-0 text-[var(--premium-charcoal)]"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mt-4 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full border border-[var(--premium-slate)] bg-white pl-6">
          <Lock size={13} className="text-[var(--premium-gold)]" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border-none bg-transparent outline-none ring-0 text-[var(--premium-charcoal)]"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mt-4 text-left">
          <button className="text-sm text-[var(--premium-gold)] hover:text-[var(--premium-charcoal)]" type="reset">
            Forget password?
          </button>
        </div>

        <button
          type="submit"
          className="premium-btn-primary mt-3 w-full rounded-full py-3 text-sm font-medium"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-[var(--premium-slate)] mt-4 text-sm"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <a
            href="#"
            className="font-medium text-[var(--premium-gold)] hover:text-[var(--premium-charcoal)]"
          >
            click here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
