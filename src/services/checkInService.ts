import axiosClient from '@/services/axiosClient'
import { mapAxiosErrorToServiceResult } from '@/services/serviceResult'
import type {
  CheckInCompletedDto,
  CheckInSessionDto,
  CheckInStartResponseDto,
  CheckInStepResponseDto,
  ConfirmCheckInRequest,
  RewriteSummaryRequestDto,
  RewriteSummaryResponseDto,
  StartCheckInRequest,
  SubmitCheckInAnswerRequest,
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
    } catch (error) {
      return mapAxiosErrorToServiceResult<CheckInSessionDto | null>(error, "Error when try to get session active")
    }
  },

  submitAnswer: async (
    sessionId: string,
    data: SubmitCheckInAnswerRequest,
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

  getMySessions : async () : Promise<ServiceResult<CheckInSessionDto[]>> => {
    try {
      const result = await axiosClient.get<CheckInSessionDto[]>('api/CheckInSession/my-sessions')
      return ServiceResult.ok(result.data, result.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<CheckInSessionDto[]>(error, 'Lỗi khi lấy ra danh sách session')
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

  rewrite : async (request : RewriteSummaryRequestDto) : Promise<ServiceResult<RewriteSummaryResponseDto>> => {
    try {
      const response = await axiosClient.post<RewriteSummaryResponseDto>('/api/CheckInSession/rewrite-summary', request)
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult(error, "Lỗi khi cố gắng rewrite summary")
    }
  },

  getSessionById : async (sessionId : string) : Promise<ServiceResult<CheckInSessionDto>> => {
    try {
      const response = await axiosClient.get(`/api/CheckInSession/${sessionId}`)
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<CheckInSessionDto>(error, 'Lỗi khi lấy ra sesion')
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
