import { createContext, useContext, useEffect, useState } from "react";
import { API_ENDPOINTS } from "@/constants/api";

interface User {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  gender: "male" | "female";
  avatar: string | null;
  last_login_at: string;
  is_active: number;
  referral_code: string | null;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  checkAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.ACCOUNT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      // Clear token if authentication fails
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    try {
      localStorage.setItem("token", token);
      await checkAuth(); // Immediately fetch user data after setting token
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      await checkAuth();
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
