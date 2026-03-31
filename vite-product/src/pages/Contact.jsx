import React, { useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeftIcon, Mail, MessageSquareText, User } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../configs/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/feedback", formData);
      toast.success("Thanks for your feedback!");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vintage-app-shell vintage-text min-h-screen px-4 py-8 md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="vintage-btn-secondary inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Home
          </Link>
          <img src="/logo.svg" alt="Resume Builder logo" className="h-10 w-auto" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="vintage-header-bar overflow-hidden rounded-[28px] p-8">
            <p className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--vintage-cream)]">
              Contact
            </p>
            <h1 className="font-display text-4xl tracking-tight text-[var(--vintage-cream)]">
              Share your feedback with us
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-[rgba(255,253,254,0.84)]">
              Tell us what is working well, what feels confusing, or what you would
              love to see next in Resume Builder.
            </p>

            <div className="mt-8 space-y-4 rounded-3xl border border-white/15 bg-white/10 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-[rgba(238,187,34,0.22)] p-3 text-[var(--vintage-gold)]">
                  <User className="size-5" />
                </div>
                <div>
                  <h2 className="font-medium text-[var(--vintage-cream)]">We read every message</h2>
                  <p className="text-sm text-[rgba(255,253,254,0.82)]">
                    Product ideas, bugs, and small usability notes are all welcome.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-[rgba(238,187,34,0.22)] p-3 text-[var(--vintage-gold)]">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h2 className="font-medium text-[var(--vintage-cream)]">Delivered through the app</h2>
                  <p className="text-sm text-[rgba(255,253,254,0.82)]">
                    Feedback is submitted to the backend so you can manage delivery from your deployment config.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="vintage-card rounded-[28px] p-8"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Feedback</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Type your feedback"
                  className="w-full resize-none"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="vintage-btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MessageSquareText className="size-4" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              <Link
                to="/"
                className="vintage-btn-secondary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"
              >
                Go Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
