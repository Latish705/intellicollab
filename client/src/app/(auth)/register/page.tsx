"use client";
import React from "react";

import { GoogleIcon } from "@/components/icons";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signInWithGoogle,
  signUpWithEmail,
  getCurrentUserToken,
} from "@/config/firebase";
import axios from "axios";

const RegisterPage: React.FC = () => {
  const [user, setUser] = React.useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useRouter();

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const res = await signInWithGoogle();
      console.log("Google sign-in successful:", res);
      const token = await getCurrentUserToken();
      const backendRes = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        {
          name: res.displayName,
          email: res.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (backendRes.data && backendRes.data.success) {
        alert("Registration successful via Google!");
        console.log("Backend user creation successful:", backendRes.data);
        navigate.push("/dashboard");
      } else {
        alert("Registration failed on the server side. Please try again.");
      }
    } catch (error: any) {
      console.error("Google sign-in failed:", error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (user.password !== user.confirmPassword) {
        alert("Passwords do not match");
        setIsLoading(false);
        return;
      }
      const res = await signUpWithEmail(user.email, user.password);
      console.log("Firebase user created:", res);
      const token = await getCurrentUserToken();
      const backendRes = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        {
          email: user.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Backend user creation successful:", backendRes.data);

      if (backendRes.data && backendRes.data.success) {
        alert(
          "Registration successful! Please verify your email before logging in."
        );
        navigate.push("/dashboard");
      } else {
        alert("Registration failed on the server side. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Start your free trial today"
    >
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => handleGoogleSignUp()}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-purple disabled:opacity-50"
        >
          <GoogleIcon className="w-5 h-5" />
          {isLoading ? "Signing up..." : "Sign up with Google"}
        </button>
      </div>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-300"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={user.fullName}
            onChange={(e) => setUser({ ...user, fullName: e.target.value })}
            required
            className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-dark-bg focus:ring-brand-purple-light"
          />
        </div>

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
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
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
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            autoComplete="new-password"
            required
            className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-dark-bg focus:ring-brand-purple-light"
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-300"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={user.confirmPassword}
            onChange={(e) =>
              setUser({ ...user, confirmPassword: e.target.value })
            }
            autoComplete="new-password"
            required
            className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-dark-bg focus:ring-brand-purple-light"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-purple disabled:opacity-50"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-purple-light hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
