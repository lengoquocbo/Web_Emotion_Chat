import type { CheckInStage } from '@/components/ai-support/ai-support-data'
import { CheckInStatus, CheckInStep, type CheckInSessionDto } from '@/types/checkIn'

const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
})

export const mapStepToStage = (
  step: CheckInStep | null | undefined,
  status: CheckInStatus | null | undefined,
): CheckInStage => {
  if (status === CheckInStatus.Completed || step === CheckInStep.Completed) {
    return 'completed'
  }

  if (
    status === CheckInStatus.AwaitingConfirmation ||
    step === CheckInStep.AwaitingConfirmation ||
    step === CheckInStep.SummaryGenerated
  ) {
    return 'summary'
  }

  if (step === CheckInStep.Step1Emotion) {
    return 'emotion'
  }

  if (step === CheckInStep.Step2MainIssue) {
    return 'issue'
  }

  if (step === CheckInStep.Step3DeepDive) {
    return 'deepdive'
  }

  return 'idle'
}

export const formatSessionTimestamp = (session: CheckInSessionDto) => {
  const rawValue = session.updatedAt ?? session.completedAt ?? session.createdAt

  if (!rawValue) {
    return timeFormatter.format(new Date())
  }

  const date = new Date(rawValue)

  if (Number.isNaN(date.getTime())) {
    return rawValue
  }

  return timeFormatter.format(date)
}

export const getSafeSessionId = (session: CheckInSessionDto) => {
  const rawValue = session.sessionId ?? session.id

  if (typeof rawValue === 'string' && rawValue.trim().length > 0) {
    return rawValue
  }

  const fallbackSource =
    session.createdAt ??
    session.updatedAt ??
    session.completedAt ??
    session.cancelledAt ??
    session.currentStep ??
    'unknown'

  return `unknown-session-${String(fallbackSource).replace(/\s+/g, '-').toLowerCase()}`
}

export const buildSessionTitle = (session: CheckInSessionDto) => {
  const summary = session.confirmedSummary ?? session.editedSummary ?? session.generatedSummary

  if (typeof summary === 'string' && summary.trim().length > 0) {
    return summary.length > 40 ? `${summary.slice(0, 40)}...` : summary
  }

  return 'Check-in moi'
}

export const buildSessionPreview = (session: CheckInSessionDto) => {
  if (typeof session.confirmedSummary === 'string' && session.confirmedSummary.trim().length > 0) {
    return session.confirmedSummary
  }

  if (typeof session.editedSummary === 'string' && session.editedSummary.trim().length > 0) {
    return session.editedSummary
  }

  if (typeof session.generatedSummary === 'string' && session.generatedSummary.trim().length > 0) {
    return session.generatedSummary
  }

  if (typeof session.currentQuestion === 'string' && session.currentQuestion.trim().length > 0) {
    return session.currentQuestion
  }

  return session.currentStep ?? 'Session in progress'
}
