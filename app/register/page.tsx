'use client';
export const dynamic = 'force-dynamic'; // avoid static prerender for this route

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import Header from "../Components/Header";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/user/signup", { email, password });
      // if your API returns a token and you want auto login:
      // const token = res.data?.accessToken; if (token) localStorage.setItem("token", token);
      router.push("/login");
    } catch (err: unknown) {
      const maybeAxiosErr = err as { response?: { data?: { msg?: string } } };
      setError(maybeAxiosErr.response?.data?.msg ?? "Registration failed");
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 dark:bg-dark-grey p-4 text-gray-700 dark:text-gray-200 text-xs w-full">
        <form onSubmit={handleRegister} className="flex flex-col w-full max-w-sm items-center">
          <h1 className="text-2xl font-bold mb-4">Register</h1>

          <input
            type="email"
            placeholder="Email"
            className="field !bg-blue-800 mb-2 sm:mb-6 p-2 rounded h-10 sm:h-12 sm:w-8/12"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
           
          />

          <input
            type="password"
            placeholder="Password"
            className=" mb-2 sm:mb-6 p-2 rounded h-10 sm:h-12 sm:w-8/12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            
          />

          <button type="submit" className="bg-blue-300 text-gray-800 dark:bg-gray-100 dark:text-gray-800 p-2 rounded cursor-pointer w-4/12">
            Register
          </button>

          <h1 className="pt-2 text-[0.6rem] sm:text-xs">
            Already have an account?&nbsp;
            <Link className="underline" href="/login">LogIn</Link>
          </h1>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </>
  );
}
