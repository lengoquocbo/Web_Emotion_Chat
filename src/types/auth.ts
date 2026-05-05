// auth.ts
export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresAtUtc: string;
  user: AuthUser;
}

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  phone?: string;
  avatarUrl?: string
  Bio?: string
}

export interface UpdateProfileRequest {
  displayName?: string
  bio? : string
  avatarUrl?: string
}

