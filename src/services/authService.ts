import axiosClient from './axiosClient'
import { ApiResponse } from '../types/apiresponse'
import { AuthResponse, LoginRequest, RegisterRequest, AuthUser, UpdateProfileRequest } from '../types/auth'

export const LoginService = async (
  data: LoginRequest,
): Promise<ApiResponse<AuthResponse>> => {
  const response = await axiosClient.post<ApiResponse<AuthResponse>>('/api/Auth/login', data)
  return response.data
}

export const getMeService = async (): Promise<AuthUser> => {
  const response = await axiosClient.get<AuthUser>('/api/Auth/me')
  return response.data
}

export const getUserProfile = async (userId: string): Promise<AuthUser> => {
  const response = await axiosClient.get<AuthUser>(`/api/Auth/profile/${userId}`)
  return response.data
}

export const UpdateProfileService = async (data: UpdateProfileRequest): Promise<AuthUser> => {
  const response = await axiosClient.put<AuthUser>('/api/Auth/profile', data)
  return response.data
}

export const searchUsers = async (username : string, take : number): Promise<AuthUser[]> => {
  const response = await axiosClient.get<AuthUser[]>(`/api/Auth/search?username=${encodeURIComponent(username)}&take=${take}`)
  return response.data
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
