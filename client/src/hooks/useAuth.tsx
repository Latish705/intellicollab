"use client";
// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import { getCurrentUserToken } from "@/config/firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  token: string | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  token: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: User | null) => {
        console.log("Auth state changed:", firebaseUser?.uid);
        setUser(firebaseUser);

        if (firebaseUser) {
          try {
            const userToken = await getCurrentUserToken();
            setToken(userToken);
          } catch (error) {
            console.error("Error getting token:", error);
            setToken(null);
          }
        } else {
          setToken(null);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
