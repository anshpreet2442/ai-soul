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

export interface TarotCard {
    cardName: string;
    meaning: string;
    imagePrompt: string; // For generating the card image
    imageBase64?: string;
}

export interface SongRecommendation {
    title: string;
    artist: string;
    reason: string;
    coverArtPrompt: string; // For generating album art
    coverArtBase64?: string;
}

export interface CelebrityMatch {
    name: string;
    reason: string;
    imagePrompt: string;
    imageBase64?: string;
}

export interface RelationshipAdvice {
    status: 'Single' | 'Relationship' | 'Complicated' | 'Married';
    // For Singles
    datingStrategy?: string;
    meetingPlace?: string;
    myType?: string; // New: What kind of partner suits them
    improvementTips?: string[]; // New: Things to work on
    beginnerTips?: string[]; // New: Dating 101 for their age
    // For Relationships
    redFlags?: string[];
    greenFlags?: string[];
    dominantFlagScore?: number; // 0 (All Red) to 100 (All Green)
}

export interface AnalysisResult {
    twoLetterCode: string; // e.g., "SA", "AP"
    attachmentStyleName: string;
    scores: Record<string, number>; // dimension -> score 0-100
    summary: string;
    slides: WrappedSlide[];
    tarot: TarotCard;
    song: SongRecommendation;
    celebrityMatch: CelebrityMatch;
    advice: RelationshipAdvice;
    mainImagePrompt: string;
    generatedImageBase64?: string;
}

export interface UserContext {
    name: string;
    age: number;
    gender: string;
    relationshipStatus: 'Single' | 'Relationship' | 'Complicated' | 'Married';
    relationshipHistoryCount: number;
    intent: string; // "Find myself", "Fix my relationship", "Just curious"
    insecurity?: string; // New
    selfLoveTrait?: string; // New
}

export enum AppState {
    WELCOME,
    USER_CONTEXT,
    GENERATING_QUIZ,
    QUIZ,
    ANALYZING,
    WRAPPED
}