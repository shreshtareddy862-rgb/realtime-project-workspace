"use client";

import { useState } from "react";
import API from "../../services/api";
import { useRouter } from "next/navigation";

export default function Register(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();

  const register = async () => {

    try {

      await API.post("/auth/register", {
        email,
        password,
        confirmPassword
      });

      alert("Account created");

      router.push("/login");

    } catch (err) {

      alert("Registration failed");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-[360px]">

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Create Account
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Sign up to start managing your projects
        </p>

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-3 text-gray-900"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-3 text-gray-900"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-3 text-gray-900"
        />

        <button
          onClick={register}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Sign Up
        </button>

        <p className="mt-5 text-sm text-center text-gray-500">
          Already have an account?
          <a href="/login" className="text-blue-600 ml-1 font-semibold">
            Login
          </a>
        </p>

      </div>

    </div>

  );
}