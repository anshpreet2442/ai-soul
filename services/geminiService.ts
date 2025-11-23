import { GoogleGenAI, Type } from "@google/genai";
import { Question, AttachmentDimension, AnalysisResult, Answer } from "../types";

// Helper to get clean JSON from markdown response
const cleanJson = (text: string): string => {
  let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return clean;
};

// Initialize Gemini Client
const getAiClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing. Please set process.env.API_KEY");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateQuestions = async (): Promise<Question[]> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';

    const prompt = `
        Act as a professional psychologist specializing in Attachment Theory.
        Generate a list of exactly 42 Multiple Choice Questions (Likert scale style) to assess a person's attachment style.
        The questions must cover these 8 dimensions evenly:
        ${Object.values(AttachmentDimension).join(', ')}.
        
        Return the response strictly as a JSON array of objects.
        Each object must have:
        - "id": number (1 to 42)
        - "text": string (The question text, asking about feelings in relationships)
        - "dimension": string (One of the 8 dimensions provided)

        Do not include any markdown formatting or extra text. Just the JSON array.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.NUMBER },
                            text: { type: Type.STRING },
                            dimension: { type: Type.STRING }
                        },
                        required: ["id", "text", "dimension"]
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        const questions: Question[] = JSON.parse(cleanJson(text));
        return questions;
    } catch (error) {
        console.error("Error generating questions:", error);
        // Fallback questions to prevent app crash if API fails temporarily
        return Array.from({ length: 42 }, (_, i) => ({
            id: i + 1,
            text: "I often worry that my partner doesn't really love me.",
            dimension: AttachmentDimension.Anxiety
        }));
    }
};

export const analyzeAttachmentStyle = async (answers: Answer[]): Promise<AnalysisResult> => {
    const ai = getAiClient();
    const model = 'gemini-3-pro-preview'; // Using a smarter model for deep psychological analysis

    const answersJson = JSON.stringify(answers.map(a => ({
        dimension: a.dimension,
        question: a.questionText,
        score: a.value // 1-5
    })));

    const prompt = `
        Analyze the following user answers to a 42-question attachment style test.
        User Answers: ${answersJson}

        Task:
        1. Calculate normalized scores (0-100) for the 8 dimensions: ${Object.values(AttachmentDimension).join(', ')}.
        2. Determine their specific Attachment Style (e.g., Secure, Anxious-Preoccupied, Dismissive-Avoidant, Fearful-Avoidant) based on the context of their specific answers.
        3. Create a unique, scientific-sounding 2-letter code for them (e.g., "Se" for Secure, "Ap" for Anxious-Preoccupied, "Da" for Dismissive, "Fa" for Fearful).
        4. Generate 5 witty, insightful, "Spotify Wrapped" style slide texts describing their personality, specific patterns, and dating advice.
        5. Create a prompt for an AI image generator to create a High-Contrast, Artistic COMIC BOOK STYLE illustration. This image should depict a character or abstract scene that visually represents their "Attachment Soul" and emotional state (e.g., a figure standing in a storm for anxious, a figure in a glass tower for avoidant).
        
        Return strictly JSON with this schema:
        {
            "twoLetterCode": "string (2 letters)",
            "attachmentStyleName": "string",
            "scores": { "DimensionName": number },
            "summary": "string (overall summary paragraph)",
            "slides": [
                { "title": "string", "content": "string", "bgColor": "hex code (dark/vibrant)", "textColor": "hex code (light)" }
            ],
            "imagePrompt": "string"
        }
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });

    const text = response.text;
    if (!text) throw new Error("No analysis returned");
    
    return JSON.parse(cleanJson(text));
};

export const generateSoulImage = async (imagePrompt: string): Promise<string | undefined> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-image';

    try {
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [{ text: imagePrompt + " --comic-book-style --vibrant-colors --high-detail" }]
            },
            config: {
                // Flash image config
            }
        });

        // Extract image
        const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (part && part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
        return undefined;
    } catch (error) {
        console.error("Image generation failed:", error);
        return undefined;
    }
};