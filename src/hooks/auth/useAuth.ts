import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { AuthUser } from "@/types/auth";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth pháº£i dÃ¹ng trong AuthProvider");
  return context;
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  logout: () => void;
}

export type { AuthContextType };
