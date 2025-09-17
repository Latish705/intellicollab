"use client";
import { signInWithEmail, signInWithGoogle } from "@/config/firebase";
import axios from "axios";
import React from "react";

const LoginPage = () => {
  const [inputValue, setInputValue] = React.useState({
    email: "",
    password: "",
  });

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.email || !inputValue.password) {
      alert("Please enter both email and password");
      return;
    }

    console.log("Logging in with:", inputValue);
    const token = await signInWithEmail(inputValue.email, inputValue.password);
    console.log("Received token:", token);
  };

  const handleGoogleSignIn = async () => {
    console.log("Google Sign-In clicked");

    const token = await signInWithGoogle();
    console.log(token);
    if (token) {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        {},
        {
          headers: {
            // Authorization: `Bearer ${token.token}`,
          },
        }
      );
      console.log("Backend login response:", res.data);
    }
    console.log("Received token from Google Sign-In:", token);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-purple via-brand-pink to-brand-purple-dark space-y-6 p-4">
      <div className=" flex items-center justify-center bg-white text-black">
        <label htmlFor="email">Email:</label>
        <input
          type="input"
          id="email"
          onChange={(e) =>
            setInputValue({ ...inputValue, email: e.target.value })
          }
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="input"
          id="password"
          onChange={(e) =>
            setInputValue({ ...inputValue, password: e.target.value })
          }
        />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
      <div>
        <button type="submit">Register</button>
      </div>
      <div>
        <button type="submit" onClick={handleGoogleSignIn}>
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
