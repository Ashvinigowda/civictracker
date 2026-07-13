import React, { createContext, useContext, useState, useEffect } from "react";
import { User, loginUser, signupUser } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("auth");
      if (stored) {
        const { user, token } = JSON.parse(stored);
        setUser(user);
        setToken(token);
      }
    } catch (err) {
      console.error("Error loading auth from localStorage:", err);
      localStorage.removeItem("auth");
    }
  }, []);

  const save = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("auth", JSON.stringify({ user, token }));
  };

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    save(res.user, res.token);
    // redirect based on role
    if (res.user.role === "ADMIN") navigate("/admin");
    else if (["BBMP", "BWSSB", "BESOM"].includes(res.user.role)) navigate("/member");
    else navigate("/");
  };

  const signup = async (name: string, email: string, password: string, role?: string) => {
    const res = await signupUser({ name, email, password, role });
    save(res.user, res.token);
    if (res.user.role === "ADMIN") navigate("/admin");
    else if (["BBMP", "BWSSB", "BESOM"].includes(res.user.role)) navigate("/member");
    else navigate("/");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
