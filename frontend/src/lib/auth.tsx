"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Role = "USER" | "DOCTOR" | "ADMIN";

export type Session = {
  token: string;
  role: Role;
  name: string;
  email: string;
};

const KEY = "lumina.session";

type AuthValue = {
  session: Session | null;
  ready: boolean;
  setSession: (session: Session | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        setSessionState(JSON.parse(raw) as Session);
      } catch {
        localStorage.removeItem(KEY);
      }
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      ready,
      setSession(next) {
        setSessionState(next);
        if (next) localStorage.setItem(KEY, JSON.stringify(next));
        else localStorage.removeItem(KEY);
      },
      logout() {
        setSessionState(null);
        localStorage.removeItem(KEY);
      },
    }),
    [session, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within AuthProvider");
  return value;
}

export function homeFor(role: Role) {
  if (role === "ADMIN") return "/admin";
  if (role === "DOCTOR") return "/doctor";
  return "/appointments";
}
