import { createContext, useEffect, useState, ReactNode } from "react";

import { getMeService } from "../services/authService";
import { AuthUser } from "../types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = user !== null;

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const res = await getMeService();
        setUser(res);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = (nextUser: AuthUser) => {
    setUser(nextUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
