import axiosClient from '@/services/axiosClient'
import { mapAxiosErrorToServiceResult } from '@/services/serviceResult'
import { ServiceResult } from '@/types/serviceResult'
import type { FriendshipDto } from '@/types/friendship'

export const friendshipService = {
  AddFriend: async (addresseeId: string): Promise<ServiceResult<FriendshipDto>> => {
    try {
      const response = await axiosClient.post<FriendshipDto>(`/api/Friendship/request`, addresseeId)
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<FriendshipDto>(error, 'Unable to send friend request.')
    }
  },

  AcceptFriendRequest: async (friendshipId: string): Promise<ServiceResult<FriendshipDto>> => {
    try {
      const response = await axiosClient.post<FriendshipDto>(`/api/Friendship/${friendshipId}/accept`)
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<FriendshipDto>(error, 'Unable to accept friend request.')
    }
  },

  Reject: async (friendshipId: string): Promise<ServiceResult<FriendshipDto>> => {
    try {
      const response = await axiosClient.post<FriendshipDto>(`/api/Friendship/${friendshipId}/reject`)
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<FriendshipDto>(error, 'Unable to reject friend request.')
    }
  },

  Cancel: async (friendshipId: string): Promise<ServiceResult<FriendshipDto>> => {
    try {
      const response = await axiosClient.post<FriendshipDto>(`/api/Friendship/${friendshipId}/cancel`)
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<FriendshipDto>(error, 'Unable to cancel friend request.')
    }
  },

  Block: async (friendshipId: string): Promise<ServiceResult<FriendshipDto>> => {
    try {
      const response = await axiosClient.post<FriendshipDto>(`/api/Friendship/${friendshipId}/block`)
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<FriendshipDto>(error, 'Unable to block user.')
    }
  },

  Remove: async (friendshipId: string): Promise<ServiceResult<void>> => {
    try {
      await axiosClient.delete(`/api/Friendship/${friendshipId}`)
      return ServiceResult.ok(undefined, 204)
    } catch (error) {
      return mapAxiosErrorToServiceResult<void>(error, 'Unable to remove friend.')
    }
  },

  GetById: async (friendshipId: string): Promise<ServiceResult<FriendshipDto>> => {
    try {
      const response = await axiosClient.get<FriendshipDto>(`/api/Friendship/${friendshipId}`)
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<FriendshipDto>(error, 'Unable to load friendship.')
    }
  },

  GetWithUser: async (otherUserId: string): Promise<ServiceResult<FriendshipDto | null>> => {
    try {
      const response = await axiosClient.get<FriendshipDto | ''>(`/api/Friendship/with/${otherUserId}`)

      if (response.status === 204 || !response.data) {
        return ServiceResult.ok<FriendshipDto | null>(null, response.status)
      }

      return ServiceResult.ok<FriendshipDto | null>(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<FriendshipDto | null>(error, 'Unable to load friendship with this user.')
    }
  },

  GetIncomingRequests: async (): Promise<ServiceResult<FriendshipDto[]>> => {
    try {
      const response = await axiosClient.get<FriendshipDto[]>('/api/Friendship/incoming')
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<FriendshipDto[]>(error, 'Unable to load incoming requests.')
    }
  },

  GetOutgoingRequests: async (): Promise<ServiceResult<FriendshipDto[]>> => {
    try {
      const response = await axiosClient.get<FriendshipDto[]>('/api/Friendship/outgoing')
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<FriendshipDto[]>(error, 'Unable to load outgoing requests.')
    }
  },

  GetFriends: async (): Promise<ServiceResult<FriendshipDto[]>> => {
    try {
      const response = await axiosClient.get<FriendshipDto[]>('/api/Friendship/friends')
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<FriendshipDto[]>(error, 'Unable to load friends list.')
    }
  },

  Exists: async (otherUserId: string): Promise<ServiceResult<boolean>> => {
    try {
      const response = await axiosClient.get<boolean>(`/api/Friendship/exists/${otherUserId}`)
      return ServiceResult.ok(response.data, response.status)
    } catch (error) {
      return mapAxiosErrorToServiceResult<boolean>(error, 'Unable to check friendship.')
    }
  },
}
