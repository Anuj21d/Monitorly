
import axios from "axios";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: baseUrl || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

type User = {
  id: number;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  authError: string | null;
  setAuthError: Dispatch<SetStateAction<string | null>>;
  refreshUser: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export default AuthContext;

export function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  async function refreshUser(): Promise<void> {
    try {
      setAuthError(null);

      const response = await apiClient.get<{
        message: string;
        user: User;
      }>("/api/auth/me");

      setUser(response.data.user);
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        setUser(null);
      } else {
        console.error("Failed to refresh user:", error);
        setAuthError(
          "Unable to verify your session. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void refreshUser();
  }, []);

  const value: AuthContextType = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    authError,
    setAuthError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      "useAuth must be used within AuthContextProvider"
    );
  }

  return context;
}
