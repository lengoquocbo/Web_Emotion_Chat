export enum CheckInStatus {
  Started = "Started",
  InProgress = "InProgress",
  AwaitingConfirmation = "AwaitingConfirmation",
  Confirmed = "Confirmed",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum CheckInStep {
  Step1Emotion = "Step1Emotion",
  Step2MainIssue = "Step2MainIssue",
  Step3DeepDive = "Step3DeepDive",
  SummaryGenerated = "SummaryGenerated",
  AwaitingConfirmation = "AwaitingConfirmation",
  Completed = "Completed",
}

export enum CheckInInputMode {
  Text = "Text",
  Voice = "Voice",
}

export interface EmotionScoreDto {
  label: string
  score: number
}

export interface MatchingCandidate {
  id?: string
  candidateUserId?: string
  candidateRoomId?: string
  matchType?: string
  similarityScore?: number
  matchReason?: string
  rank?: number
  userId?: string
  score?: number
  [key: string]: unknown
}

export interface StartCheckInRequest {
  inputMode: CheckInInputMode | keyof typeof CheckInInputMode | string
}

export interface SubmitCheckInAnswerRequest {
  content: string
}

export interface RewriteSummaryRequestDto {
  text : string
}

export interface RewriteSummaryResponseDto {
  originalText : string
  rewrittenText : string
}

export interface ConfirmCheckInRequest {
  isConfirmed: boolean
  editedSummary?: string | null
}

export interface CheckInStartResponseDto {
  sessionId: string
  status: CheckInStatus
  currentStep: CheckInStep
  inputMode: CheckInInputMode
  firstQuestion: string
}

export interface CheckInSessionDto {
  id?: string
  sessionId?: string
  userId?: string
  emotionEntryId?: string | null
  status: CheckInStatus
  currentStep: CheckInStep
  inputMode: CheckInInputMode
  currentQuestion?: string | null
  emotionQuestion?: string | null
  issueQuestion?: string | null
  deepDiveQuestion?: string | null
  reviewQuestion?: string | null
  emotionAnswer?: string | null
  issueAnswer?: string | null
  deepDiveAnswer?: string | null
  generatedSummary?: string | null
  editedSummary?: string | null
  confirmedSummary?: string | null
  createdAt?: string
  updatedAt?: string
  completedAt?: string | null
  cancelledAt?: string | null
}

export interface CheckInStepResponseDto {
  sessionId: string
  status: CheckInStatus
  currentStep: CheckInStep
  nextQuestion?: string | null
  isCompleted: boolean
  isAwaitingConfirmation: boolean
  summary?: string | null
}

export interface CheckInCompletedDto {
  sessionId: string
  emotionEntryId: string
  confirmedSummary: string
  topEmotion: string | null
  topEmotionScore: number | null
  allEmotions: EmotionScoreDto[]
  vector: number[]
  matchingRequestId: string | null
  candidates: MatchingCandidate[]
}
