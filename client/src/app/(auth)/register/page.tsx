"use client";
import React from "react";

import { GoogleIcon } from "@/components/icons";
import AuthLayout from "@/components/auth/AuthLayout";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterPage: React.FC = () => {
  const navigate = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate.push("/dashboard");
  };

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Start your free trial today"
    >
      <div className="space-y-4">
        <button
          type="button"
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

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
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
              required
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-dark-bg focus:ring-brand-purple-light"
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-300"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-dark-bg focus:ring-brand-purple-light"
            />
          </div>
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
