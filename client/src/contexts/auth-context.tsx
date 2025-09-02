"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { User, AuthContextType, RegisterUserDto } from "@/types";
import { authAPI } from "@/lib/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    // this is firebase hook for noticing the auth state change
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser);

        try {
          // Get or create user in your backend
          const token = await firebaseUser.getIdToken();
          localStorage.setItem("firebase_token", token);

          // Try to get user from your backend first
          try {
            const response = await authAPI.validate(token);
            if (response.data.valid && response.data.user) {
              setUser(response.data.user);
            } else {
              // If validation fails, try to create user
              throw new Error("User validation failed");
            }
          } catch (validateError) {
            // User doesn't exist in backend or validation failed, try to create them
            const userData = {
              name:
                firebaseUser.displayName ||
                firebaseUser.email?.split("@")[0] ||
                "User",
              email: firebaseUser.email!,
              firebase_uid: firebaseUser.uid,
            };

            try {
              // Try the new Firebase endpoint first
              const createResponse = await authAPI.createFromFirebase(userData);
              setUser(createResponse.data.user);
            } catch (createError) {
              // If createFromFirebase doesn't exist, try regular register
              try {
                const fallbackData = {
                  name: userData.name,
                  email: userData.email,
                  password: "firebase_user_" + firebaseUser.uid, // Temp password for Firebase users
                };
                await authAPI.register(fallbackData);

                // Now try to validate again
                const retryResponse = await authAPI.validate(token);
                if (retryResponse.data.valid && retryResponse.data.user) {
                  setUser(retryResponse.data.user);
                }
              } catch (fallbackError) {
                console.error(
                  "Error creating user via fallback:",
                  fallbackError
                );
                // Create a minimal user object from Firebase data
                setUser({
                  id: firebaseUser.uid,
                  name: userData.name,
                  email: userData.email,
                  is_premium: false,
                  created_at: new Date().toISOString(),
                  firebase_uid: firebaseUser.uid,
                });
              }
            }
          }
        } catch (error) {
          console.error("Error handling Firebase user:", error);
          // Fallback: create minimal user from Firebase data
          setUser({
            id: firebaseUser.uid,
            name:
              firebaseUser.displayName ||
              firebaseUser.email?.split("@")[0] ||
              "User",
            email: firebaseUser.email!,
            is_premium: false,
            created_at: new Date().toISOString(),
            firebase_uid: firebaseUser.uid,
          });
        } finally {
          setLoading(false);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        localStorage.removeItem("firebase_token");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // The onAuthStateChanged listener will handle the rest
      // Force a redirect to dashboard after successful login
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

      return userCredential;
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData: RegisterUserDto) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: userData.name,
      });

      // The onAuthStateChanged listener will handle backend user creation
      // Force a redirect to dashboard after successful registration
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

      return userCredential;
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("firebase_token");
      setUser(null);
      setFirebaseUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
