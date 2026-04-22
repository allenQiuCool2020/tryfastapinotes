"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import type React from "react";
import { getCurrentUser } from "@/lib/api/auth";
import type { User } from "@/types/api";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const tokenStorageKey = "field-notes-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(tokenStorageKey);
    if (!storedToken) {
      setIsHydrated(true);
      return;
    }

    startTransition(() => {
      setToken(storedToken);
    });

    getCurrentUser(storedToken)
      .then((nextUser) => {
        setUser(nextUser);
      })
      .catch(() => {
        window.localStorage.removeItem(tokenStorageKey);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsHydrated(true);
      });
  }, []);

  async function handleLogin(nextToken: string) {
    window.localStorage.setItem(tokenStorageKey, nextToken);
    setToken(nextToken);
    const nextUser = await getCurrentUser(nextToken);
    setUser(nextUser);
  }

  function handleLogout() {
    window.localStorage.removeItem(tokenStorageKey);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        isHydrated,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
