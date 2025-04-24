'use client'
export const dynamic = 'force-dynamic'
import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import supabase from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const router = useRouter()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccessMsg('Login Successful')
      router.push('/home') 
    }
  }

  return (
    <div className='"grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"'>
    <div className="min-h-screen flex items-center justify-center tracking-tight">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4 text-lg">
        <h2 className="text-2xl font-[family-name:var(--font-geist-sans)] text-center text-black mb-4">Login</h2>

        {successMsg && (
          <p className="text-green-600 bg-green-100 px-3 py-2 rounded-md text-sm text-center font-[family-name:var(--font-geist-sans)]">
            ✅ {successMsg}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 text-black focus:ring-blue-500 font-[family-name:var(--font-geist-sans)]"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 text-black focus:ring-blue-500 font-[family-name:var(--font-geist-sans)]"
          required
        />

        {error && <p className="text-red-500 text-sm font-[family-name:var(--font-geist-sans)]">{error}</p>}

        <Button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-full hover:bg-blue-700 transition duration-200 font-[family-name:var(--font-geist-sans)]">
          Login
        </Button>

        <p className="text-center text-sm text-black font-[family-name:var(--font-geist-sans)]">
          Don’t have an account? <a href="/register" className="text-blue-500 underline hover:text-red-700 font-[family-name:var(--font-geist-sans)] ">Register here</a>
        </p>
      </form>
    </div>
    </div>
  )
}

export default LoginPage
