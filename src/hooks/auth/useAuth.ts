import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { AuthResponse } from "@/types/auth";


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth phải dùng trong AuthProvider");
  return context;
};

interface AuthContextType {
  user: AuthResponse["user"] | null;
  token: string | null;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

export type { AuthContextType };