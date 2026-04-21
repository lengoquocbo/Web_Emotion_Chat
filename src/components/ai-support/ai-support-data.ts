export type AIMessageRole = 'assistant' | 'user' | 'system'

export type CheckInStage = 'idle' | 'emotion' | 'issue' | 'deepdive' | 'summary' | 'completed'

export type AIMessageKind = 'question' | 'answer' | 'status'

export type AIMessage = {
  id: string
  role: AIMessageRole
  time: string
  text: string
  kind?: AIMessageKind
}

export type AISummary = {
  emotion: string
  issue: string
  deepdive: string
  narrative: string
}

export type AIThread = {
  id: string
  title: string
  preview: string
  updatedAt: string
  stage: CheckInStage
  messages: AIMessage[]
  summary: AISummary | null
  answers: Partial<Record<'emotion' | 'issue' | 'deepdive', string>>
  suggestions: string[]
  canRewrite: boolean
}

export const checkInStepOrder: Exclude<CheckInStage, 'idle'>[] = [
  'emotion',
  'issue',
  'deepdive',
  'summary',
  'completed',
]

export const checkInStepLabels: Record<Exclude<CheckInStage, 'idle'>, string> = {
  emotion: 'Emotion',
  issue: 'Issue',
  deepdive: 'Deep Dive',
  summary: 'Review',
  completed: 'Completed',
}

export const quickPrompts = [
  { label: 'I need help naming what I feel right now.', active: true },
  { label: 'Help me unpack what is weighing on me.', active: false },
  { label: 'I want to slow down before reacting.', active: false },
  { label: 'Summarize what I am going through.', active: false },
] as const
