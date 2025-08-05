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

  } catch (err: any) {
    console.log("Login error:", err.response?.data);
    setError(err.response?.data?.msg || "Login failed");
  }
};

  return (
    <>
   <Header></Header>

    <div className="flex flex-col items-center justify-center min-h-screen bg-dark-grey p-4 color-light-grey text-xs w-full">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleLogin} className="flex flex-col w-full max-w-sm items-center">
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
        

        <button type="submit" className="bg-blue-500 text-white p-2 rounded cursor-pointer w-4/12 ">
          Login
        </button>

          <h1 className="pt-2 text-[0.6rem] sm:text-xs ">
            Don't have an account yet?&nbsp;
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
