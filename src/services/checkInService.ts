// services/checkInService.ts
import axiosClient from '@/services/axiosClient'
import type {
  CheckInCompletedDto,
  CheckInSessionDto,
  CheckInStartResponseDto,
  CheckInStepResponseDto,
  ConfirmCheckInRequest,
  StartCheckInRequest,
  SubmitAnswerRequest,
} from '@/types/checkIn'

export const checkInService = {
  /** POST /api/CheckInSession/start */
  start: (data: StartCheckInRequest): Promise<CheckInStartResponseDto> =>
    axiosClient.post('/api/CheckInSession/start', data),

  /** GET /api/CheckInSession/active */
  getActive: async (): Promise<CheckInSessionDto | null> => {
  try {
    const res = await axiosClient.get<CheckInSessionDto>('/api/CheckInSession/active')
    return res.data
  } catch (err: any) {
    if (err?.response?.status === 404) return null
    throw err
  }
},

  /** POST /api/CheckInSession/{sessionId}/answer */
  submitAnswer: (sessionId: string, data: SubmitAnswerRequest): Promise<CheckInStepResponseDto> =>
    axiosClient.post(`/api/CheckInSession/${sessionId}/answer`, data),

  /** POST /api/CheckInSession/{sessionId}/confirm */
  confirm: (sessionId: string, data: ConfirmCheckInRequest): Promise<CheckInCompletedDto> =>
    axiosClient.post(`/api/CheckInSession/${sessionId}/confirm`, data),

  /** POST /api/CheckInSession/{sessionId}/cancel → 204 No Content */
  cancel: (sessionId: string): Promise<void> =>
    axiosClient.post(`/api/CheckInSession/${sessionId}/cancel`),
}