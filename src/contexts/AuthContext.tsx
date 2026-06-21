import { createContext, useContext, useState } from "react";

type UserRole = "admin" | "user";

interface AuthUser {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  role: UserRole | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Load credentials from environment variables
const CREDENTIALS: Record<string, { password: string; role: UserRole }> = {
  [import.meta.env.VITE_USER_LOGIN]: { 
    password: import.meta.env.VITE_USER_PASSWORD, 
    role: "user" 
  },
  [import.meta.env.VITE_ADMIN_LOGIN]: { 
    password: import.meta.env.VITE_ADMIN_PASSWORD, 
    role: "admin" 
  },
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    try {
      const credentials = CREDENTIALS[username];

      if (!credentials || credentials.password !== password) {
        throw new Error("Sen guya agillisan da he ? 😂");
      }

      setUser({
        username,
        role: credentials.role,
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    role: user?.role ?? null,
    signIn,
    signOut,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
