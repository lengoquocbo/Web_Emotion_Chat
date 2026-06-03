import axiosClient from './axiosClient'
import type {
  AdminAccessRule,
  AdminAchievement,
  AdminLoginAudit,
  AdminRoomConversationExport,
  AdminRoomQuery,
  AdminRoomRow,
  AdminUserQuery,
  AdminUserRow,
  CreateAccessRuleRequest,
  CreateAdminUserRequest,
  PagedAdminResult,
  UpdateAdminUserRequest,
  UpsertAdminAchievementRequest,
} from '@/types/admin'

export const getAdminUsers = async (
  query: AdminUserQuery = {},
): Promise<PagedAdminResult<AdminUserRow>> => {
  const response = await axiosClient.get<PagedAdminResult<AdminUserRow>>('/api/Admin/users', {
    params: {
      search: query.search,
      status: query.status,
      role: query.role,
      skip: query.skip ?? 0,
      take: query.take ?? 50,
    },
  })

  return response.data
}

export const createAdminUser = async (data: CreateAdminUserRequest): Promise<AdminUserRow> => {
  const response = await axiosClient.post<AdminUserRow>('/api/Admin/users', data)
  return response.data
}

export const updateAdminUser = async (
  userId: string,
  data: UpdateAdminUserRequest,
): Promise<AdminUserRow> => {
  const response = await axiosClient.put<AdminUserRow>(`/api/Admin/users/${userId}`, data)
  return response.data
}

export const deleteAdminUser = async (userId: string): Promise<void> => {
  await axiosClient.delete(`/api/Admin/users/${userId}`)
}

export const getAdminRooms = async (
  query: AdminRoomQuery = {},
): Promise<PagedAdminResult<AdminRoomRow>> => {
  const response = await axiosClient.get<PagedAdminResult<AdminRoomRow>>('/api/Admin/rooms', {
    params: {
      search: query.search,
      status: query.status,
      roomType: query.roomType,
      skip: query.skip ?? 0,
      take: query.take ?? 50,
    },
  })

  return response.data
}

export const exportRoomConversation = async (
  roomId: string,
): Promise<AdminRoomConversationExport> => {
  const response = await axiosClient.get<AdminRoomConversationExport>(
    `/api/Admin/rooms/${roomId}/conversation-export`,
  )

  return response.data
}

export const getAdminLoginAudits = async (take = 50): Promise<AdminLoginAudit[]> => {
  const response = await axiosClient.get<AdminLoginAudit[]>('/api/Admin/login-audits', {
    params: { take },
  })

  return response.data
}

export const getAdminAchievements = async (): Promise<AdminAchievement[]> => {
  const response = await axiosClient.get<AdminAchievement[]>('/api/Admin/achievements')
  return response.data
}

export const createAdminAchievement = async (
  data: UpsertAdminAchievementRequest,
): Promise<AdminAchievement> => {
  const response = await axiosClient.post<AdminAchievement>('/api/Admin/achievements', data)
  return response.data
}

export const updateAdminAchievement = async (
  achievementId: string,
  data: UpsertAdminAchievementRequest,
): Promise<AdminAchievement> => {
  const response = await axiosClient.put<AdminAchievement>(
    `/api/Admin/achievements/${achievementId}`,
    data,
  )

  return response.data
}

export const deleteAdminAchievement = async (achievementId: string): Promise<void> => {
  await axiosClient.delete(`/api/Admin/achievements/${achievementId}`)
}

export const getAdminAccessRules = async (): Promise<AdminAccessRule[]> => {
  const response = await axiosClient.get<AdminAccessRule[]>('/api/Admin/access-rules')
  return response.data
}

export const createAdminAccessRule = async (
  data: CreateAccessRuleRequest,
): Promise<AdminAccessRule> => {
  const response = await axiosClient.post<AdminAccessRule>('/api/Admin/access-rules', data)
  return response.data
}

export const deleteAdminAccessRule = async (ruleId: string): Promise<void> => {
  await axiosClient.delete(`/api/Admin/access-rules/${ruleId}`)
}