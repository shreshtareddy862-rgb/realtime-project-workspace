"use client";

import { useState } from "react";
import API from "../../services/api";
import { useRouter } from "next/navigation";

export default function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const login = async () => {

    try {
        const res = await API.post("/auth/login",{
        email,
        password
        });

        localStorage.setItem("token",res.data.token);

        router.push("/dashboard");
    } catch (err:any) {

        setError("Incorrect email or password");

    }
  };

  return (

  <div className="min-h-screen flex items-center justify-center bg-gray-100">

    <div className="bg-white p-8 rounded-xl shadow-md w-[360px]">

      <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
        Login
      </h1>

      <p className="text-sm text-gray-500 text-center mb-6">
        Access your workspace
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
        className="w-full border border-gray-300 rounded-md p-2 mb-2 text-gray-900"
      />

      {error && (
        <p className="text-red-500 text-sm mb-3 text-center">
          {error}
        </p>
      )}

      <button
        onClick={login}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Login
      </button>

      <p className="mt-5 text-sm text-center text-gray-500">
        Don't have an account?
        <a href="/register" className="text-blue-600 ml-1 font-semibold">
          Sign up
        </a>
      </p>

    </div>

  </div>

);
}