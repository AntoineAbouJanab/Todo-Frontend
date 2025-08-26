'use client';

export const dynamic = 'force-dynamic'; // prevents static prerender for this route

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '../../utils/api';
import Header from '../Components/Header'; // make sure this casing matches your folder name exactly!

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/user/login', { email, password });
      const token = res.data?.accessToken as string | undefined;

      if (!token) {
        setError('No token returned from server.');
        return;
      }

      // safe: runs on click in the browser, not during render
      localStorage.setItem('token', token);
      router.push('/todos');
    } catch (err: unknown) {
      const maybeAxiosErr = err as { response?: { data?: { msg?: string } } };
      setError(maybeAxiosErr.response?.data?.msg ?? 'Login failed');
    }
  };

  return (
    <>
      <Header />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 dark:bg-dark-grey p-4 text-gray-700 dark:text-gray-200 text-xs w-full">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col w-full max-w-sm items-center">
          <input
            type="email"
            placeholder="Email"
            className="field mb-2 sm:mb-6 p-2 rounded h-10 sm:h-12 sm:w-8/12"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Password"
            className="field mb-2 sm:mb-6 p-2 rounded h-10 sm:h-12 sm:w-8/12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            className="bg-blue-300 text-gray-800 dark:bg-gray-100 dark:text-gray-800 p-2 rounded cursor-pointer w-4/12"
          >
            Login
          </button>

          <p className="pt-2 text-[0.6rem] sm:text-xs">
            Don&apos;t have an account yet?{' '}
            <Link className="underline" href="/register">
              Sign Up
            </Link>
          </p>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </>
  );
}
