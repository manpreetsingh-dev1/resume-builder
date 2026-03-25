import fs from "fs";
import Resume from "../models/Resume.js";
import ai, { AI_CHAT_MODEL } from "../configs/ai.js";
import imagekit from "../configs/imageKit.js";

const normalizeResume = (resume) => {
    if (!resume) {
        return resume;
    }

    const normalizedResume =
        typeof resume.toObject === "function" ? resume.toObject() : { ...resume };

    normalizedResume.professional_summary =
        typeof normalizedResume.professional_summary === "string"
            ? normalizedResume.professional_summary
            : "";

    return normalizedResume;
};

const parseJsonFromModelOutput = (content = "") => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
        return {};
    }

    try {
        return JSON.parse(trimmedContent);
    } catch (error) {
        const jsonMatch = trimmedContent.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("AI response did not contain valid JSON.");
        }

        return JSON.parse(jsonMatch[0]);
    }
};

const extractFirstMatch = (text, regex) => text.match(regex)?.[1]?.trim() || "";

const cleanText = (value = "") => value.replace(/\s+/g, " ").trim();

const toSentenceCase = (value = "") => {
    const normalized = cleanText(value);

    if (!normalized) {
        return "";
    }

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const ensureSentenceEnding = (value = "") => {
    const normalized = cleanText(value);

    if (!normalized) {
        return "";
    }

    return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
};

const extractKeywords = (content = "", limit = 3) => {
    const stopWords = new Set([
        "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "in",
        "is", "of", "on", "or", "that", "the", "to", "with", "my", "your",
        "i", "we", "our", "their", "this", "those", "these", "also", "have",
        "has", "had", "into", "over", "under", "using", "use", "used",
        "experience", "experienced", "professional", "summary", "career",
        "skills", "skill", "work", "working", "strong", "strongly",
    ]);

    const matches = cleanText(content).toLowerCase().match(/[a-z][a-z+-]{2,}/g) || [];
    const frequencies = new Map();

    for (const word of matches) {
        if (stopWords.has(word)) {
            continue;
        }

        frequencies.set(word, (frequencies.get(word) || 0) + 1);
    }

    return [...frequencies.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([word]) => word);
};

const buildProfessionalSummaryFallback = (content = "") => {
    const normalizedContent = cleanText(content);

    if (!normalizedContent) {
        return "";
    }

    const sentences = normalizedContent
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean);

    const firstSentence = toSentenceCase(sentences[0] || normalizedContent);
    const keywords = extractKeywords(normalizedContent);
    const keywordText =
        keywords.length > 0
            ? ` with strengths in ${keywords.join(", ")}`
            : "";

    const firstSentenceEnhanced = ensureSentenceEnding(
        firstSentence.includes("results-driven") || firstSentence.includes("detail-oriented")
            ? firstSentence
            : `Results-driven professional${keywordText} ${firstSentence}`.trim()
    );

    const secondSentenceSource =
        sentences[1] ||
        "Focused on delivering measurable results, continuous improvement, and clear communication in fast-paced environments";

    const secondSentence = ensureSentenceEnding(
        toSentenceCase(secondSentenceSource)
    );

    return `${firstSentenceEnhanced} ${secondSentence}`.trim();
};

const buildJobDescriptionFallback = (content = "") => {
    const normalizedContent = cleanText(content);

    if (!normalizedContent) {
        return "";
    }

    const keywords = extractKeywords(normalizedContent, 4);
    const keywordText =
        keywords.length > 0 ? ` using ${keywords.join(", ")}` : "";

    return [
        ensureSentenceEnding(
            "Delivered high-impact work and supported day-to-day responsibilities with a focus on quality, ownership, and measurable outcomes"
        ),
        ensureSentenceEnding(
            `Collaborated effectively across teams and improved execution${keywordText}`
        ),
    ].join(" ");
};

const uploadProfileImage = async (imagePath, removeBackground = false) => {
    if (!imagePath || !imagekit) {
        return "";
    }

    const imageBufferData = fs.createReadStream(imagePath);
    const imageTransformation = [
        "w-300",
        "h-300",
        "c-maintain_ratio",
        "fo-face",
        "z-0.75",
        removeBackground ? "e-bgremove" : null,
    ]
        .filter(Boolean)
        .join(",");

    const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: "resume-profile.png",
        folder: "user-resumes",
        transformation: {
            pre: imageTransformation,
        },
    });

    return response.url || "";
};

const buildResumeFallback = (resumeText = "") => {
    const cleanText = resumeText.replace(/\r/g, "").trim();
    const lines = cleanText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const email = extractFirstMatch(cleanText, /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i);
    const phone = extractFirstMatch(
        cleanText,
        /(\+?\d[\d\s().-]{7,}\d)/
    );
    const linkedin = extractFirstMatch(
        cleanText,
        /(https?:\/\/(?:www\.)?linkedin\.com\/[^\s]+)/i
    );
    const website = extractFirstMatch(
        cleanText,
        /(https?:\/\/(?!(?:www\.)?linkedin\.com)[^\s]+)/i
    );

    const topLines = lines.slice(0, 8);
    const fullName =
        topLines.find(
            (line) =>
                /^[A-Za-z][A-Za-z\s.'-]{2,}$/.test(line) &&
                !/@|http|linkedin|resume|curriculum vitae/i.test(line)
        ) || "";

    const profession =
        topLines.find(
            (line) =>
                line !== fullName &&
                !/@|http|linkedin/i.test(line) &&
                line.length <= 80
        ) || "";

    const summary = lines.slice(0, 12).join(" ").slice(0, 1200);

    const skillsLine =
        lines.find((line) => /skills|technologies|tech stack/i.test(line)) || "";

    const skills = skillsLine
        .split(/:|,|\||·/)
        .map((item) => item.trim())
        .filter(
            (item) =>
                item &&
                !/skills|technologies|tech stack/i.test(item) &&
                item.length <= 40
        )
        .slice(0, 20);

    return {
        professional_summary: summary,
        skills,
        personal_info: {
            full_name: fullName,
            profession,
            email,
            phone,
            linkedin,
            website,
        },
        experience: [],
        project: [],
        education: [],
    };
};

// controller for enhance proffesional summary 
// POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
    try {
        const summaryContent = cleanText(req.body?.userContent || "");

        if (!summaryContent) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let enhanceContent = "";

        try {
            const response = await ai.chat.completions.create({
                model: AI_CHAT_MODEL,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert resume writer. Rewrite the user's professional summary into a polished 1-2 sentence ATS-friendly summary. Return only the improved summary text.",
                    },
                    {
                        role: "user",
                        content: summaryContent,
                    },
                ],
            });

            enhanceContent = cleanText(response.choices[0].message.content || "");
        } catch (aiError) {
            console.error("enhanceProfessionalSummary fallback:", aiError);
            enhanceContent = buildProfessionalSummaryFallback(summaryContent);
        }

        return res.status(200).json({ enhanceContent });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
// controller for enhancing a resume job description
// POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
    try {
        const jobDescriptionContent = cleanText(req.body?.userContent || "");

        if (!jobDescriptionContent) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let enhanceContent = "";

        try {
            const response = await ai.chat.completions.create({
                model: AI_CHAT_MODEL,
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an expert resume writer. Rewrite the user's job description into 1-2 ATS-friendly resume bullet-style sentences. Use strong action language and return only the improved text.",
                    },
                    {
                        role: "user",
                        content: jobDescriptionContent,
                    },
                ],
            });

            enhanceContent = cleanText(response.choices[0].message.content || "");
        } catch (aiError) {
            console.error("enhanceJobDescription fallback:", aiError);
            enhanceContent = buildJobDescriptionFallback(jobDescriptionContent);
        }

        return res.status(200).json({ enhanceContent });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};
// controller for uploading a resume to database
// POST: /api/ai/upload-resume
export const uploadResume = async (req, res) => {
    try {
        const { resumeText, title, removeBackground } = req.body;
        const image = req.file;
        const userId = req.userId
        if (!resumeText) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const systemPrompt =
            "You extract resume data and return only valid JSON with no markdown fences, no commentary, and no extra text.";

        const userPrompt = `extract data from this resume:${resumeText} provide data in the following JSON format with no additional text before or after:
        {
        professional_summary: {
        type: String,
        default:''
    }, skills: [{type: String}],
        
     personal_info: {
    image: { type: String, default: "" },
    full_name: { type: String, default: "" },
    profession: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" },
  },
  experience: [
    {
      company: { type: String,  },
      position: { type: String,  },
      start_date: { type: String,  },
      end_date: { type: String},
       description: { type: String,},
        is_current: { type: Boolean,},
    },
  ],
  project:[
    {
    name: { type: String,  },
      type: { type: String,  },
     description: { type: String,},
    }
  ],
   education: [
    {
      institution: { type: String,  },
      degree: { type: String,  },
      field: { type: String,  },
      graduation_date: { type: String},
       gpa: { type: String,},
    },
  ],}`

        let parsedData = {};

        try {
            const response = await ai.chat.completions.create({
                model: AI_CHAT_MODEL,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt,
                    },
                    {
                        role: "user",
                        content: userPrompt,
                    },
                ]
            });

            const extractedData = response.choices[0].message.content;
            parsedData = parseJsonFromModelOutput(extractedData || "");
        } catch (aiError) {
            console.error("uploadResume AI fallback:", aiError);
            parsedData = buildResumeFallback(resumeText);
        }

        const normalizedData = {
            ...parsedData,
            professional_summary:
                typeof parsedData.professional_summary === "string"
                    ? parsedData.professional_summary
                    : "",
            skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
            personal_info:
                parsedData.personal_info && typeof parsedData.personal_info === "object"
                    ? parsedData.personal_info
                    : {},
            experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
            project: Array.isArray(parsedData.project) ? parsedData.project : [],
            education: Array.isArray(parsedData.education) ? parsedData.education : [],
        };

        if (image) {
            normalizedData.personal_info = {
                ...normalizedData.personal_info,
                image: await uploadProfileImage(image.path, Boolean(removeBackground)),
            };
        }

        const newResume = await Resume.create({ userId, title, ...normalizedData });
        res.json({ resumeId: newResume.id, resume: normalizeResume(newResume) });

    } catch (error) {
        console.error("uploadResume error:", error);
        return res.status(400).json({
            message:
                error?.response?.data?.error?.message ||
                error?.error?.message ||
                error.message,
        });
    }
};
