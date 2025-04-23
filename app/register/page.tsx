
'use client';

import React, { useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Registration successful! Please check your email for confirmation.');
      setEmail('');
      setPassword('');

      // Optional: Redirect after 3 seconds
      setTimeout(() => {
        router.push('/home');
      }, 3000);
    }
  };

  return (
    <div className='"grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"'>
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 font-[family-name:var(--font-geist-sans)]">Register</h2>

        {successMsg && (
          <p className="text-green-600 bg-green-100 px-3 py-2 rounded-md text-sm text-center font-[family-name:var(--font-geist-sans)]">
            ✅ {successMsg}
          </p>
        )}

        {errorMsg && (
          <p className="text-red-500 text-sm text-center font-[family-name:var(--font-geist-sans)]">{errorMsg}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 text-black border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 font-[family-name:var(--font-geist-sans)]"
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 text-black border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 font-[family-name:var(--font-geist-sans)]"
        />

        <Button
          type="submit"
          className="w-full bg-emerald-600 text-white rounded-full hover:bg-blue-700 font-[family-name:var(--font-geist-sans)]"
        >
          Register
        </Button>
      </form>
    </div>
    </div>
  );
};

export default RegisterPage;
