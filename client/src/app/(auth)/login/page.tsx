"use client";
import React from "react";

import { GoogleIcon } from "@/components/icons";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const navigate = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate.push("/dashboard");
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
    >
      <div className="space-y-4">
        <button
          type="button"
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

      <form onSubmit={handleLogin} className="space-y-6">
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
            autoComplete="email"
            required
            defaultValue="lotishadwani70@gmail.com"
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
            required
            defaultValue="password"
            className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-dark-bg focus:ring-brand-purple-light"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-purple"
        >
          Sign In
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
