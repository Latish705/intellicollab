// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, User } from "firebase/auth";

type AuthContextType = { user: User | null };

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        console.log("Auth state changed. Current user:", firebaseUser);
        localStorage.setItem("user", JSON.stringify(firebaseUser));
        localStorage.setItem(
          "firebase_token",
          //@ts-ignore
          firebaseUser?.stsTokenManager?.accessToken || ""
        );
        return setUser(firebaseUser);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
