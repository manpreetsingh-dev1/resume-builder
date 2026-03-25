import React, { useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeftIcon, Mail, MessageSquareText, User } from "lucide-react";
import { Link } from "react-router-dom";

const WHATSAPP_NUMBER = "8196937984";

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
      const message = [
        "Hello, I have feedback for Resume Builder.",
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        `Feedback: ${formData.message}`,
      ].join("\n");

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
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
    <div className="min-h-screen bg-[#FFF7E3] px-4 py-8 text-[#025c52] md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#cfbea6] bg-[#f7f0e6] px-5 py-2 text-sm text-[#5e4f3d] transition hover:border-[#8a6f4d] hover:text-[#8a6f4d]"
          >
            <ArrowLeftIcon className="size-4" />
            Back to Home
          </Link>
          <img src="/logo.svg" alt="Resume Builder logo" className="h-10 w-auto" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="overflow-hidden rounded-[28px] border border-[#BDE7C1] bg-[#FFE3B3] p-8 shadow-[0_20px_80px_rgba(2,129,116,0.12)]">
            <p className="mb-3 inline-flex rounded-full border border-[#92DE8B] bg-[#FFFBF1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#028174]">
              Contact
            </p>
            <h1 className="home-display text-4xl tracking-tight text-[#4c3f31]">
              Share your feedback with us
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#6f5d49]">
              Tell us what is working well, what feels confusing, or what you would
              love to see next in Resume Builder.
            </p>

            <div className="mt-8 space-y-4 rounded-3xl border border-[#ddcfbc] bg-[#f7f0e6] p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-[#e4d4bf] p-3 text-[#8a6f4d]">
                  <User className="size-5" />
                </div>
                <div>
                  <h2 className="font-medium text-[#4d4336]">We read every message</h2>
                  <p className="text-sm text-[#6f5d49]">
                    Product ideas, bugs, and small usability notes are all welcome.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-[#e4d4bf] p-3 text-[#8a6f4d]">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h2 className="font-medium text-[#4d4336]">Direct to WhatsApp</h2>
                  <p className="text-sm text-[#6f5d49]">
                    Your message opens directly in WhatsApp with your details and feedback pre-filled.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[28px] border border-[#BDE7C1] bg-[#FFFBF1] p-8 shadow-[0_20px_80px_rgba(2,129,116,0.1)]"
          >
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#5e4f3d]">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-2xl border border-[#d4c5af] bg-[#fffaf3] px-4 py-3 text-sm text-[#4d4336] outline-none transition focus:border-[#8a6f4d] focus:ring-4 focus:ring-[#e7dac7]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#5e4f3d]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-[#d4c5af] bg-[#fffaf3] px-4 py-3 text-sm text-[#4d4336] outline-none transition focus:border-[#8a6f4d] focus:ring-4 focus:ring-[#e7dac7]"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#5e4f3d]">
                  Feedback
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={7}
                  placeholder="Type your feedback"
                  className="w-full resize-none rounded-2xl border border-[#d4c5af] bg-[#fffaf3] px-4 py-3 text-sm text-[#4d4336] outline-none transition focus:border-[#8a6f4d] focus:ring-4 focus:ring-[#e7dac7]"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full border border-[#028174] bg-[#028174] px-7 py-3 text-sm font-medium text-[#FFFBF1] transition hover:bg-[#0AB68B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MessageSquareText className="size-4" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-[#cfbea6] bg-[#f7f0e6] px-6 py-3 text-sm text-[#5e4f3d] transition hover:border-[#8a6f4d] hover:text-[#8a6f4d]"
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
