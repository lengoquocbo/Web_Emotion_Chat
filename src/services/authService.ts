import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/apiresponse";
import { AuthResponse, LoginRequest, RegisterRequest, AuthUser } from "../types/auth";

export const LoginService = async (
  data: LoginRequest
): Promise<ApiResponse<AuthResponse>> => {
  return await axiosClient.post("/api/Auth/login", data);
};

// Kiểu trả về thực tế là AuthUser, không phải ApiResponse<AuthUser>
export const getMeService = async (): Promise<AuthUser> => {
  return await axiosClient.get("/api/Auth/me");
};

export const RegisterService = async (
  data: RegisterRequest
): Promise<ApiResponse<null>> => {
  return await axiosClient.post("/api/Auth/register", data);
};

export const LogoutService = async (): Promise<void> => {
  await axiosClient.post("/api/Auth/logout");
};
export const getGoogleLoginUrl = (): string => {
  return "https://localhost:7138/api/Auth/google-login";
};
