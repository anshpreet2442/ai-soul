import { GoogleGenAI, Type } from "@google/genai";
import { Question, AttachmentDimension, AnalysisResult, Answer, UserContext } from "../types";

// Helper to get clean JSON from markdown response
const cleanJson = (text: string): string => {
  let clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const firstSquare = clean.indexOf('[');
  const firstCurly = clean.indexOf('{');

  if (firstSquare === -1 && firstCurly === -1) return clean;

  let startIndex = 0;
  let endIndex = clean.length;

  if (firstSquare !== -1 && (firstCurly === -1 || firstSquare < firstCurly)) {
      startIndex = firstSquare;
      const lastSquare = clean.lastIndexOf(']');
      if (lastSquare !== -1) endIndex = lastSquare + 1;
  } else {
      startIndex = firstCurly;
      const lastCurly = clean.lastIndexOf('}');
      if (lastCurly !== -1) endIndex = lastCurly + 1;
  }

  return clean.substring(startIndex, endIndex);
};

const getAiClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing. Please set process.env.API_KEY");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateQuestions = async (context?: UserContext): Promise<Question[]> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';

    const contextStr = context 
        ? `The user is a ${context.age} year old ${context.gender}, relationship status: ${context.relationshipStatus}.` 
        : "";

    const prompt = `
        Act as a professional psychologist. Generate exactly 42 Multiple Choice Questions (Likert scale) to assess attachment style.
        ${contextStr}
        Ensure questions cover: ${Object.values(AttachmentDimension).join(', ')}.
        Return strictly as a JSON array of objects with "id", "text", "dimension".
        Do not include any markdown formatting.
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
        const cleaned = cleanJson(text);
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Error generating questions:", error);
        return Array.from({ length: 42 }, (_, i) => ({
            id: i + 1,
            text: "I worry about my relationships often.",
            dimension: AttachmentDimension.Anxiety
        }));
    }
};

export const getLoadingFacts = async (): Promise<string[]> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
    
    const prompt = `
        Generate 5 fascinating random facts (History of love, Indian Web Series recommendations, Psychology facts).
        Return JSON array of strings.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        const text = response.text;
        if(!text) return ["Love is complex.", "Relationships take work."];
        return JSON.parse(cleanJson(text));
    } catch (e) {
        return [
            "Secure attachment is the most common style.",
            "Oxytocin is released during hugs.",
            "Watch 'Made in Heaven' on Amazon Prime.",
            "Relationships affect physical health.",
            "Communication is the key to longevity."
        ];
    }
};

export const analyzeAttachmentStyle = async (answers: Answer[], context: UserContext): Promise<AnalysisResult> => {
    const ai = getAiClient();
    const model = 'gemini-3-pro-preview'; 

    const answersJson = JSON.stringify(answers.map(a => ({
        dimension: a.dimension,
        question: a.questionText,
        score: a.value
    })));

    const contextStr = `
        User Profile:
        Age: ${context.age}
        Gender: ${context.gender}
        Status: ${context.relationshipStatus}
        History: ${context.relationshipHistoryCount} past relationships
        Intent: ${context.intent}
    `;

    const prompt = `
        Analyze these attachment style test answers.
        ${contextStr}
        User Answers: ${answersJson}

        Tasks:
        1. Calculate scores (0-100) for 8 dimensions.
        2. Determine Attachment Style & 2-letter Code.
        3. Create 5 Spotify Wrapped style slides text.
        4. Select TAROT CARD (Name, Meaning, and a visual description for a comic style image).
        5. Recommend SONG (Title, Artist, Reason, and a visual description for album art).
        6. Determine CELEBRITY MATCH (Opposite gender/preference usually): Name, Why they match, and visual description.
        7. PROVIDE ADVICE based on Status:
           - IF SINGLE: Provide 'datingStrategy' and 'meetingPlace' (be specific, e.g., "Art gallery opening", "Coffee shop").
           - IF RELATIONSHIP/MARRIED: Provide list of 'redFlags' user ignores, 'greenFlags' they have, and 'dominantFlagScore' (0-100).
        8. Main Image Prompt: A high-contrast comic book style illustration of their soul.

        Return strictly JSON matching the AnalysisResult interface structure found in types.ts.
        Keys: twoLetterCode, attachmentStyleName, scores, summary, slides, tarot (cardName, meaning, imagePrompt), song (title, artist, reason, coverArtPrompt), celebrityMatch (name, reason, imagePrompt), advice, mainImagePrompt.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
    });

    const text = response.text;
    if (!text) throw new Error("No analysis returned");
    
    return JSON.parse(cleanJson(text));
};

export const generateSingleImage = async (prompt: string, style: string = ""): Promise<string | undefined> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-image';
    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [{ text: `${prompt} ${style} --high-quality --vibrant` }] }
        });
        const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (part?.inlineData?.data) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
        return undefined;
    } catch (e) {
        console.error("Image gen failed", e);
        return undefined;
    }
};

// Orchestrator to generate all images in parallel
export const generateAllImages = async (result: AnalysisResult): Promise<AnalysisResult> => {
    const [mainImg, tarotImg, songImg, celebImg] = await Promise.all([
        generateSingleImage(result.mainImagePrompt, "--comic-book-style --dramatic-lighting"),
        generateSingleImage(result.tarot.imagePrompt, "--tarot-card-style --mystical --intricate-border"),
        generateSingleImage(result.song.coverArtPrompt, "--album-cover-art --abstract --moody"),
        generateSingleImage(result.celebrityMatch.imagePrompt, "--portrait --celebrity-style --high-fashion")
    ]);

    return {
        ...result,
        generatedImageBase64: mainImg,
        tarot: { ...result.tarot, imageBase64: tarotImg },
        song: { ...result.song, coverArtBase64: songImg },
        celebrityMatch: { ...result.celebrityMatch, imageBase64: celebImg }
    };
};