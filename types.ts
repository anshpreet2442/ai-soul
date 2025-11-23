export enum AttachmentDimension {
    Anxiety = "Anxiety",
    Avoidance = "Avoidance",
    Security = "Security",
    Independence = "Independence",
    EmotionalIntimacy = "Emotional Intimacy",
    Trust = "Trust",
    SelfReliance = "Self-Reliance",
    Ambivalence = "Ambivalence"
}

export interface Question {
    id: number;
    text: string;
    dimension: AttachmentDimension;
}

export interface Answer {
    questionId: number;
    questionText: string;
    dimension: AttachmentDimension;
    value: number; // 1 (Strongly Disagree) to 5 (Strongly Agree)
}

export interface WrappedSlide {
    title: string;
    content: string;
    bgColor: string; // Tailwind class or hex
    textColor: string;
}

export interface AnalysisResult {
    twoLetterCode: string; // e.g., "SA", "AP"
    attachmentStyleName: string;
    scores: Record<string, number>; // dimension -> score 0-100
    summary: string;
    slides: WrappedSlide[];
    imagePrompt: string;
    generatedImageBase64?: string;
}

export enum AppState {
    WELCOME,
    GENERATING_QUIZ,
    QUIZ,
    ANALYZING,
    WRAPPED
}
