import type { AISummary, CheckInStage } from '@/components/ai-support/ai-support-data'

type CheckInAnswerKey = 'emotion' | 'issue' | 'deepdive'

type StartCheckInResponse = {
  nextStage: 'emotion'
  question: string
  suggestions: string[]
}

type SubmitCheckInAnswerParams = {
  stage: Extract<CheckInStage, CheckInAnswerKey>
  answers: Partial<Record<CheckInAnswerKey, string>>
}

type SubmitCheckInAnswerResponse = {
  nextStage: Exclude<CheckInStage, 'idle' | 'completed'>
  question?: string
  suggestions: string[]
  summary?: AISummary
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const questionMap: Record<CheckInAnswerKey, { question: string; suggestions: string[] }> = {
  emotion: {
    question: 'Luc nay cam xuc noi bat nhat cua ban la gi?',
    suggestions: ['Lo lang', 'Met moi', 'Boi roi', 'Buon', 'Can duoc lang nghe'],
  },
  issue: {
    question: 'Dieu gi dang tac dong manh nhat den tam tri cua ban luc nay?',
    suggestions: [
      'Ap luc cong viec',
      'Mau thuan quan he',
      'Kiet suc',
      'Kho tap trung',
      'Khong ro van de',
    ],
  },
  deepdive: {
    question: 'Neu dao sau hon mot chut, dieu nao dang lam ban mac ket nhat?',
    suggestions: [
      'No lap lai nhieu lan',
      'Toi so ket qua xau',
      'Toi thay co loi',
      'Toi dang qua tai',
      'Toi can goi y de dien dat',
    ],
  },
}

const buildNarrative = (summary: Omit<AISummary, 'narrative'>) =>
  `Ban dang trai nghiem ${summary.emotion.toLowerCase()}. Van de trung tam co ve lien quan den ${summary.issue.toLowerCase()}. Khi dao sau hon, dieu dang giu ban lai la ${summary.deepdive.toLowerCase()}.`

const rewriteNarrative = (summary: Omit<AISummary, 'narrative'>) =>
  `Hien tai ban co dau hieu ${summary.emotion.toLowerCase()}. Goc van de duoc ban mo ta la ${summary.issue.toLowerCase()}, va lop sau hon cho thay ${summary.deepdive.toLowerCase()}.`

export async function startCheckIn(): Promise<StartCheckInResponse> {
  await delay(500)

  return {
    nextStage: 'emotion',
    question: questionMap.emotion.question,
    suggestions: questionMap.emotion.suggestions,
  }
}

export async function submitCheckInAnswer({
  stage,
  answers,
}: SubmitCheckInAnswerParams): Promise<SubmitCheckInAnswerResponse> {
  await delay(650)

  if (stage === 'emotion') {
    return {
      nextStage: 'issue',
      question: questionMap.issue.question,
      suggestions: questionMap.issue.suggestions,
    }
  }

  if (stage === 'issue') {
    return {
      nextStage: 'deepdive',
      question: questionMap.deepdive.question,
      suggestions: questionMap.deepdive.suggestions,
    }
  }

  const summaryBase = {
    emotion: answers.emotion ?? 'mot trang thai cam xuc kho goi ten',
    issue: answers.issue ?? 'mot van de chua duoc dien dat ro',
    deepdive: answers.deepdive ?? 'mot noi lo can duoc lam ro hon',
  }

  return {
    nextStage: 'summary',
    suggestions: [],
    summary: {
      ...summaryBase,
      narrative: buildNarrative(summaryBase),
    },
  }
}

export async function rewriteCheckInSummary(
  summary: Omit<AISummary, 'narrative'>,
): Promise<AISummary> {
  await delay(400)

  return {
    ...summary,
    narrative: rewriteNarrative(summary),
  }
}

export async function confirmCheckInSummary(): Promise<{ nextStage: 'completed' }> {
  await delay(300)

  return { nextStage: 'completed' }
}
