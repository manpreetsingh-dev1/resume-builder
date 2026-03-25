import OpenAI from "openai";

const baseURL = process.env.OPENAI_BASE_URL?.trim();
const configuredModel = process.env.OPENAI_MODEL?.trim();
const isGeminiOpenAICompat = baseURL?.includes("generativelanguage.googleapis.com");

export const AI_CHAT_MODEL =
    isGeminiOpenAICompat && (!configuredModel || configuredModel === "gemini-1.5-flash")
        ? "gemini-2.5-flash"
        : configuredModel || "gpt-4o-mini";

const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL,
});

export default ai;
