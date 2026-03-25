const sendFeedbackEmail = async ({ name, email, message }) => {
    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const feedbackFromEmail =
        process.env.FEEDBACK_FROM_EMAIL?.trim() || "onboarding@resend.dev";

    if (!adminEmail) {
        console.warn("Feedback email skipped: ADMIN_EMAIL is not configured.");
        return { delivered: false, reason: "missing_admin_email" };
    }

    if (!resendApiKey) {
        console.warn("Feedback email skipped: RESEND_API_KEY is not configured.");
        console.info("Feedback submission:", { name, email, message });
        return { delivered: false, reason: "missing_resend_key" };
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: feedbackFromEmail,
            to: adminEmail,
            reply_to: email,
            subject: `New Resume Builder Feedback from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nFeedback:\n${message}`,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || "Failed to send feedback email.");
    }

    return { delivered: true };
};

export const submitFeedback = async (req, res) => {
    try {
        const name = req.body?.name?.trim();
        const email = req.body?.email?.trim();
        const message = req.body?.message?.trim();

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }

        const result = await sendFeedbackEmail({ name, email, message });

        return res.status(result.delivered ? 200 : 202).json({
            message: "Thanks for your feedback!",
            delivered: result.delivered,
        });
    } catch (error) {
        console.error("submitFeedback error:", error);
        return res.status(500).json({ message: "Failed to submit feedback." });
    }
};
