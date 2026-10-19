import { createContext, useState, type ReactNode } from "react";

type AuthContextProviderProps = {
  children: ReactNode;
};
type User = {
  id: number;
  username: string;
  email: string;
};

const AuthContext = createContext({});
export default AuthContext;

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>();

  async function refreshUser() {
    
    try {
        
        const user = await a

    } catch (error) {
        
    }

  }

  const value = {
    user,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
