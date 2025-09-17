"use client";
import {
  getCurrentUserToken,
  signInWithGoogle,
  signUpWithEmail,
} from "@/config/firebase";
import axios from "axios";
import React from "react";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = React.useState({
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputValue({ ...inputValue, [id]: value });
  };

  const handleEmailPasswordRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signUpWithEmail(inputValue.email, inputValue.password);
      console.log("Firebase user created:", res);
      const token = await getCurrentUserToken();
      const backendRes = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        {
          email: inputValue.email,
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
        router.push("/test/dashboard");
      } else {
        alert("Registration failed on the server side. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration failed:", error.message);
    }
  };

  const handleGmailRegister = async () => {
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
        router.push("/test/dashboard");
      } else {
        alert("Registration failed on the server side. Please try again.");
      }
    } catch (error: any) {
      console.error("Google sign-in failed:", error.message);
    }
  };

  return (
    <div className="bg-white text-black p-4 rounded shadow-md max-w-md mx-auto mt-10">
      <form onSubmit={handleEmailPasswordRegister}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={inputValue.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={inputValue.password}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Register with Email
        </button>
      </form>
      <div className="my-4">
        <div className="border-b border-gray-500">
          <span className="block w-full text-center">OR</span>
        </div>
      </div>
      <div>
        <button
          onClick={handleGmailRegister}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Register with Google
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
