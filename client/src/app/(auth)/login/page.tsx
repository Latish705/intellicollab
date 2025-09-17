"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import { GoogleIcon } from "@/components/icons";
import AuthLayout from "@/components/auth/AuthLayout";
import {
  signInWithEmail,
  signInWithGoogle,
  getCurrentUserToken,
} from "@/config/firebase";
import { useAuth } from "@/hooks/useAuth";

const LoginPage: React.FC = () => {
  const navigate = useRouter();
  const { user, loading } = useAuth();
  const [userData, setUser] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate.push("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleLoginEmailAndPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!userData.email || !userData.password) {
      alert("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Logging in with:", userData);
      const token = await signInWithEmail(userData.email, userData.password);
      console.log("Received token:", token);
      navigate.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log("Google Sign-In clicked");
      const user = await signInWithGoogle();
      console.log("Google sign-in successful:", user);

      if (user) {
        const token = await getCurrentUserToken();
        const res = await axios.post(
          "http://localhost:4000/api/v1/user/login",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Backend login response:", res.data);

        if (res.data.success) {
          navigate.push("/dashboard");
        } else {
          alert("User not found, please register first.");
          navigate.push("/register");
        }
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert((error as Error).message);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Add proper loading component
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => handleGoogleSignIn()}
          className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-purple"
        >
          <GoogleIcon className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      <form onSubmit={handleLoginEmailAndPassword} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            onChange={(e) => setUser({ ...userData, email: e.target.value })}
            autoComplete="email"
            required
            className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-dark-bg focus:ring-brand-purple-light"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="********"
            required
            onChange={(e) => setUser({ ...userData, password: e.target.value })}
            className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-dark-bg focus:ring-brand-purple-light"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-purple disabled:opacity-50"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-purple-light hover:underline"
          >
            Sign up
          </Link>
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-sm text-gray-400 hover:text-white transition-colors"
        >
          &larr; Back to home
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
