'use client';

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
      const res = await API.post("/user/signup", {
        email,
        password
      });

      console.log("User registered:", res.data);
      router.push("/login");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <>
    <Header></Header>
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-grey p-4 color-light-grey text-xs w-full">
      <form
        onSubmit={handleRegister}
        className="flex flex-col w-full max-w-sm items-center"
      >
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        <input
          type="text"
          placeholder="Email"
          className=" mb-2 sm:mb-6 p-2 rounded h-10 sm:h-12 sm:w-8/12 "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{backgroundColor:"hsl(218, 11%, 20%)"}}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-2 sm:mb-6 p-2  rounded h-10 sm:h-12 sm:w-8/12"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{backgroundColor:"hsl(218, 11%, 20%)"}}

        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded cursor-pointer w-4/12"
        >
          Register
        </button>
        <h1 className="pt-2 text-[0.6rem] sm:text-xs ">
            Already have an account?&nbsp;
            <Link className="underline" href="/login" passHref>
            LogIn
            </Link>
          </h1>   

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
    </>
  );
}
