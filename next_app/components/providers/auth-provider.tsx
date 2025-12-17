"use client";
import { createContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  getIdToken,
} from "@firebase/auth";
import { auth } from "@/lib/firebase-front";
import api from "@/services/api";

export const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => void;
  register: (email: string, password: string) => void;
  logout: () => void;
}>({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await getIdToken(currentUser, true);
        api.token = token;
      } else {
        api.token = null;
      }
      setUser(currentUser);
      setReady(true);
    });
    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string) => {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    setUser(credentials.user);
  };
  const login = async (email: string, password: string) => {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    setUser(credentials.user);
  };

  const logout = async () => {
    await signOut(auth);
    api.token = null;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {ready && children}
      {!ready && <div>Loading...</div>}
    </AuthContext.Provider>
  );
}
