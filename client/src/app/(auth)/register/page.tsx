"use client";
import React from "react";

import { GoogleIcon } from "@/components/icons";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithGoogle, signUpWithEmail } from "@/config/firebase";

const RegisterPage: React.FC = () => {
  const [user, setUser] = React.useState({
    fullName: "",

    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleGoogleSignUp = async () => {
    try {
      const token = await signInWithGoogle();
      console.log(token);
      navigate.push("/dashboard");
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert((error as Error).message);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user.password !== user.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      const newUser = await signUpWithEmail(user.email, user.password);
      console.log("Registered user:", newUser);
      alert(
        "Registration successful! Please check your email to verify your account."
      );
      navigate.push("/dashboard");
    } catch (error: any) {
      console.error("Registration failed:", error);
      alert(error.message);
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
          className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-white/20 rounded-md shadow-sm text-sm font-medium text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-purple"
        >
          <GoogleIcon className="w-5 h-5" />
          Sign up with Google
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
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-purple"
        >
          Create Account
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
