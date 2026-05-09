export type EmotionType =
    'Anger' |
    'Disgust' |
    'Enjoyment' |
    'Fear' |
    'Other' |
    'Sadness' |
    'Surprise'

export interface ReflectionDto {
    Id : string,
    UserId : string
    RoomId : string
    EmotionEntryId? : string
    MoodBefore? : EmotionType
    MoodBeforeIntensity? : number
    MoodAfter? : EmotionType
    MoodAfterIntensity? : number
    EmotionShiftScore? : number
    Content?: string
    Tags? : string[]
    CreatedAt : string
}

export interface CreateReflectionRequest {
    RoomId : string
    EmotionEntryId? : string
    MoodBefore? : EmotionType
    MoodBeforeIntensity? : number
    MoodAfter? : EmotionType
    MoodAfterIntensity? : number
    Content?: string
    Tags? : string[]
}

export interface ReflectionAnalysisSummaryDto {
    totalReflections: number;
    activeDays: number;
    mostCommonMoodBefore?: EmotionType | null;
    mostCommonMoodAfter?: EmotionType | null;
    topTag?: string | null;
    averageMoodBeforeIntensity: number;
    averageMoodAfterIntensity: number;
    averageEmotionShiftScore: number;
}

export interface ReflectionMoodDistributionDto {
    mood: string;
    beforeCount: number;
    afterCount: number;
    averageBeforeIntensity: number;
    averageAfterIntensity: number;
}

export interface ReflectionTagDistributionDto {
    tag: string;
    count: number;
    averageShiftScore: number;
}

export interface ReflectionTimelinePointDto {
    period: string;
    reflectionCount: number;
    averageMoodBeforeIntensity: number;
    averageMoodAfterIntensity: number;
    averageEmotionShiftScore: number;
}

export interface ReflectionTransitionDto {
    fromMood: string;
    toMood: string;
    count: number;
}

export interface ReflectionHistoryPagedResult {
    items: ReflectionDto[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
}

export interface GetReflectionTimelineParams {
    from?: string;
    to?: string;
    groupBy?: string;
}

export interface GetReflectionDistributionParams {
    from?: string;
    to?: string;
}

export interface GetReflectionTagDistributionParams {
    from?: string;
    to?: string;
    take?: number;
}

export interface GetReflectionHistoryParams {
    skip?: number;
    take?: number;
    from?: string;
    to?: string;
    tag?: string;
    moodBefore?: string;
    moodAfter?: string;
    roomId?: string;
}

export const EMOTION_OPTIONS: EmotionType[] = [
    'Enjoyment',
    'Surprise',
    'Fear',
    'Sadness',
    'Anger',
    'Disgust',
    'Other',
];

export const REFLECTION_TAGS = [
    "stress",
    "loneliness",
    "burnout",
    "relationship",
    "study_pressure",
    "self_esteem",
    "family_conflict",
    "career_pressure",
    "grief",
    "anxiety",
    "social_pressure",
    "identity",
    "motivation",
    "financial_pressure",
    "future_uncertainty"
] as const;
