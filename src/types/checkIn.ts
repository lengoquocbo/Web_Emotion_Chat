// types/checkIn.ts

// ─── Enums (mirror BE) ───────────────────────────────────────────────────────

export type CheckInInputMode = 'Text' | 'Voice'

export type CheckInStatus =
  | 'Started'
  | 'InProgress'
  | 'AwaitingConfirmation'
  | 'Completed'
  | 'Cancelled'

export type CheckInStep =
  | 'Step1Emotion'
  | 'Step2MainIssue'
  | 'Step3DeepDive'
  | 'AwaitingConfirmation'
  | 'Completed'

// ─── Requests ────────────────────────────────────────────────────────────────

export interface StartCheckInRequest {
  inputMode: CheckInInputMode
}

export interface SubmitAnswerRequest {
  content: string
}

export interface ConfirmCheckInRequest {
  isConfirmed: boolean
  editedSummary?: string
}

// ─── Responses ───────────────────────────────────────────────────────────────

/** Trả về khi gọi POST /start */
export interface CheckInStartResponseDto {
  sessionId: string
  currentStep: CheckInStep
  status: CheckInStatus
  question: string
}

/** Trả về khi gọi POST /{sessionId}/answer */
export interface CheckInStepResponseDto {
  sessionId: string
  currentStep: CheckInStep
  status: CheckInStatus
  /** Có khi status còn InProgress */
  question?: string
  /** Có khi status = AwaitingConfirmation */
  generatedSummary?: string
}

export interface EmotionScoreDto {
  label: string
  score: number
}

/** Trả về khi gọi POST /{sessionId}/confirm */
export interface CheckInCompletedDto {
  sessionId: string
  emotionEntryId: string
  confirmedSummary: string
  topEmotion: string
  topEmotionScore: number
  allEmotions: EmotionScoreDto[]
  vector: number[]
  matchingRequestId: string
  candidates: MatchingCandidate[]
}

export interface MatchingCandidate {
  userId: string
  score: number
  [key: string]: unknown
}

/** Trả về khi gọi GET /active */
export interface CheckInSessionDto {
  sessionId: string
  status: CheckInStatus
  currentStep: CheckInStep
  inputMode: CheckInInputMode
}