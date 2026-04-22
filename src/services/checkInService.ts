import axiosClient from '@/services/axiosClient'
import { mapAxiosErrorToServiceResult } from '@/services/serviceResult'
import type {
  CheckInCompletedDto,
  CheckInSessionDto,
  CheckInStartResponseDto,
  CheckInStepResponseDto,
  ConfirmCheckInRequest,
  StartCheckInRequest,
  SubmitAnswerRequest,
} from '@/types/checkIn'
import { ServiceResult } from '@/types/serviceResult'

export const checkInService = {
  start: async (data: StartCheckInRequest): Promise<ServiceResult<CheckInStartResponseDto>> => {
    try {
      const response = await axiosClient.post<CheckInStartResponseDto>('/api/CheckInSession/start', data)
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<CheckInStartResponseDto>(error, 'Loi khi bat dau session')
    }
  },

  getActive: async (): Promise<ServiceResult<CheckInSessionDto | null>> => {
    try {
      const response = await axiosClient.get<CheckInSessionDto>('/api/CheckInSession/active')
      return ServiceResult.ok<CheckInSessionDto | null>(response.data, response.status)
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return ServiceResult.ok<CheckInSessionDto | null>(null, 404)
      }

      return mapAxiosErrorToServiceResult<CheckInSessionDto | null>(
        error,
        'Loi khi lay session active',
      )
    }
  },

  submitAnswer: async (
    sessionId: string,
    data: SubmitAnswerRequest,
  ): Promise<ServiceResult<CheckInStepResponseDto>> => {
    try {
      const response = await axiosClient.post<CheckInStepResponseDto>(
        `/api/CheckInSession/${sessionId}/answer`,
        data,
      )
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<CheckInStepResponseDto>(error, 'Loi khi gui cau tra loi')
    }
  },

  confirm: async (
    sessionId: string,
    data: ConfirmCheckInRequest,
  ): Promise<ServiceResult<CheckInCompletedDto>> => {
    try {
      const response = await axiosClient.post<CheckInCompletedDto>(
        `/api/CheckInSession/${sessionId}/confirm`,
        data,
      )
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<CheckInCompletedDto>(error, 'Loi khi xac nhan session')
    }
  },

  cancel: async (sessionId: string): Promise<ServiceResult<null>> => {
    try {
      const response = await axiosClient.post(`/api/CheckInSession/${sessionId}/cancel`)
      return ServiceResult.ok(null, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<null>(error, 'Loi khi huy session')
    }
  },
}
