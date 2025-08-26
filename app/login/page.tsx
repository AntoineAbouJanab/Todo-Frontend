'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import Link from "next/link";
import '../globals.css'; 
import Header from "../Components/Header";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const res = await API.post("/user/login", { email, password });
    console.log("Login response:", res.data);
    const token = res.data.accessToken;
    console.log("Saving token:", token);

    console.log("Login successful. Token:", token);
    localStorage.setItem("token", token);
    router.push("/todos");

  } catch (err: unknown) {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as {
      response?: {
        data?: {
          msg?: string;
        };
      };
    };

    console.log("Login error:", axiosErr.response?.data);
    setError(axiosErr.response?.data?.msg || "Login failed");
  } else {
    console.log("Unexpected login error:", err);
    setError("Login failed");
  }
}
};

  return (
    <>
   <Header></Header>

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 dark:bg-dark-grey p-4 text-gray-700 dark:text-gray-200 text-xs w-full">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col w-full max-w-sm items-center">
        <input
          type="text"
          placeholder="Email"
          className=" mb-2 sm:mb-6 p-2 rounded h-10 sm:h-12 sm:w-8/12 "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          
        />
      
          <input
          type="password"
          placeholder="Password"
          className="mb-2 sm:mb-6 p-2  rounded h-10 sm:h-12 sm:w-8/12"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required

        />
        

        <button type="submit" className=" bg-blue-300 text-grey-800 dark:bg-gray-100 text-gray-800 p-2 rounded cursor-pointer w-4/12 ">
          Login
        </button>

          <h1 className="pt-2 text-[0.6rem] sm:text-xs ">
            Don&apos;t have an account yet?&nbsp;
            <Link className="underline" href="/register" passHref>
            SignUp
            </Link>
          </h1>   

           
        
        
      

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      
    </div>
    </>
  );
}
