import axiosClient from './axiosClient'
import { ApiResponse } from '../types/apiresponse'
import { AuthResponse, LoginRequest, RegisterRequest, AuthUser, UpdateProfileRequest } from '../types/auth'
import { UserSummaryDto } from '@/types/friendship'

function normalizeAuthUser(payload: any): AuthUser {
  return {
    id: payload?.id ?? '',
    username: payload?.username ?? '',
    email: payload?.email ?? '',
    displayName: payload?.displayName,
    phone: payload?.phone,
    avatarUrl: payload?.avatarUrl,
    Bio: payload?.Bio ?? payload?.bio ?? '',
    bio: payload?.bio ?? payload?.Bio ?? '',
  }
}

export const LoginService = async (
  data: LoginRequest,
): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosClient.post<ApiResponse<AuthResponse>>('/api/Auth/login', data)
  return {
    ...response.data,
    data: response.data?.data
      ? {
          ...response.data.data,
          user: normalizeAuthUser(response.data.data.user),
        }
      : response.data.data,
  }
}

export const RefreshTokenService = async (): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosClient.post<ApiResponse<AuthResponse>>(
    '/api/Auth/refresh-token',
    {},
  )

  return {
    ...response.data,
    data: response.data?.data
      ? {
          ...response.data.data,
          user: normalizeAuthUser(response.data.data.user),
        }
      : response.data.data,
  }
}

export const getMeService = async (): Promise<AuthUser> => {
  const response = await axiosClient.get<AuthUser>('/api/Auth/me')
  return normalizeAuthUser(response.data)
}

export const getUserProfile = async (userId: string): Promise<AuthUser> => {
  const response = await axiosClient.get<AuthUser>(`/api/Auth/profile/${userId}`)
  return normalizeAuthUser(response.data)
}

export const UpdateProfileService = async (data: UpdateProfileRequest): Promise<AuthUser> => {
  const response = await axiosClient.put<AuthUser | UserSummaryDto>('/api/Auth/me/profile', data)
  return normalizeAuthUser(response.data)
}

export const UploadAvatar = async (file: File): Promise<AuthUser> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axiosClient.post<AuthUser | UserSummaryDto>(
    '/api/Auth/me/avatar',
    formData,
    {
      headers: {
        'Content-Type': undefined as never,
        Accept: 'application/json',
      },
    },
  )

  return normalizeAuthUser(response.data)
}


export const searchUsers = async (username : string, take : number): Promise<AuthUser[]> => {
  const response = await axiosClient.get<AuthUser[]>(`/api/Auth/search?username=${encodeURIComponent(username)}&take=${take}`)
  return response.data.map(normalizeAuthUser)
}

export const RegisterService = async (
  data: RegisterRequest,
): Promise<ApiResponse<null>> => {
  const response = await axiosClient.post<ApiResponse<null>>('/api/Auth/register', data)
  return response.data
}

export const LogoutService = async (): Promise<void> => {
  await axiosClient.post('/api/Auth/logout')
}

export const getGoogleLoginUrl = (): string => {
  return '/api/Auth/google-login'
}
