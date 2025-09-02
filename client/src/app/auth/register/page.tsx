"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { signInWithGoogle } from "@/config/firebase";

// A simple SVG component for the Google Icon
const GoogleIcon = () => (
  <svg
    className="mr-2 h-4 w-4"
    aria-hidden="true"
    focusable="false"
    data-prefix="fab"
    data-icon="google"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 488 512"
  >
    <path
      fill="currentColor"
      d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.3 111.8 11.8 244 11.8c70.3 0 129.8 27.8 172.4 72.4l-66.2 64.2c-28-26.5-68.5-43.1-118.2-43.1-90.6 0-164.2 73.6-164.2 164.2 0 90.6 73.6 164.2 164.2 164.2 103.5 0 137.2-73.6 140.8-110.8H244V261.8h244z"
    ></path>
  </svg>
);

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Assuming your auth context will provide a signInWithGoogle method
  const { register } = useAuth();
  const router = useRouter();

  const passwordRequirements = [
    { regex: /.{8,}/, text: "At least 8 characters" },
    { regex: /[A-Z]/, text: "One uppercase letter" },
    { regex: /[a-z]/, text: "One lowercase letter" },
    { regex: /\d/, text: "One number" },
  ];

  const isPasswordValid = passwordRequirements.every((req) =>
    req.regex.test(formData.password)
  );
  const doPasswordsMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic phone validation (at least 10 digits)
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number (at least 10 digits)");
      setLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet requirements");
      setLoading(false);
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(
        (error as any)?.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handler for Google Sign-Up
  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");
    try {
      // This function should be implemented in your auth-context.js
      const token = await signInWithGoogle();
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(
        (error as any)?.response?.data?.message || "Google Sign-Up failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center ">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md my-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="relative">
                <Brain className="h-10 w-10 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent ml-2">
                IntelliCollab
              </h1>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">
              Create your account
            </h2>
            <p className="text-gray-300 text-sm">
              Join thousands of teams collaborating smarter
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-300 px-3 py-2 rounded-2xl text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-row gap-2 ">
              <div className="space-y-1 w-56">
                <Label
                  htmlFor="name"
                  className="text-gray-200 font-medium text-sm"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-10"
                  required
                />
              </div>
              <div className="space-y-1 w-full">
                <Label
                  htmlFor="phone"
                  className="text-gray-200 font-medium text-sm"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-gray-200 font-medium text-sm"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent h-10"
                required
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="password"
                className="text-gray-200 font-medium text-sm"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12 h-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-1 space-y-0.5">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      {req.regex.test(formData.password) ? (
                        <CheckCircle className="h-3 w-3 text-green-400 mr-1.5" />
                      ) : (
                        <XCircle className="h-3 w-3 text-gray-500 mr-1.5" />
                      )}
                      <span
                        className={
                          req.regex.test(formData.password)
                            ? "text-green-400"
                            : "text-gray-400"
                        }
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-200 font-medium text-sm"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12 h-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {formData.confirmPassword && (
                <div className="flex items-center text-xs mt-1">
                  {doPasswordsMatch ? (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-400 mr-1.5" />
                      <span className="text-green-400">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 text-red-400 mr-1.5" />
                      <span className="text-red-400">
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={loading || !isPasswordValid || !doPasswordsMatch}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 rounded-2xl py-3"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            <GoogleIcon />
            Sign up with Google
          </Button>
          {/* --- End of Added Section --- */}

          <div className="mt-4 text-center">
            <p className="text-gray-300 text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
