import axiosClient from '@/services/axiosClient'
import { mapAxiosErrorToServiceResult } from '@/services/serviceResult'
import type {
  JoinOrCreateRoomResponseDto,
  MatchingStatusResponseDto,
} from '@/types/matching'
import { ServiceResult } from '@/types/serviceResult'

export const matchingService = {
  joinOrCreate: async (
    matchingRequestId: string,
  ): Promise<ServiceResult<JoinOrCreateRoomResponseDto>> => {
    try {
      const response = await axiosClient.post<JoinOrCreateRoomResponseDto>(
        `/api/matching/${matchingRequestId}/join-or-create`,
      )
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<JoinOrCreateRoomResponseDto>(
        error,
        'Loi khi tham gia matching queue',
      )
    }
  },

  getStatus: async (
    matchingRequestId: string,
  ): Promise<ServiceResult<MatchingStatusResponseDto>> => {
    try {
      const response = await axiosClient.get<MatchingStatusResponseDto>(
        `/api/matching/${matchingRequestId}/status`,
      )
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<MatchingStatusResponseDto>(
        error,
        'Loi khi lay trang thai matching',
      )
    }
  },

  leaveQueue: async (matchingRequestId: string): Promise<ServiceResult<null>> => {
    try {
      const response = await axiosClient.post(`/api/matching/${matchingRequestId}/leave-queue`)
      return ServiceResult.ok(null, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<null>(error, 'Loi khi roi matching queue')
    }
  },
}
