"use client";

import { useState } from "react";
import { Eye, EyeClosed } from "iconoir-react";
import { Spinner } from "@/components/Spinner";
import { MessageBox } from "@/components/MessageBox";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
    
      if(!response.ok){
        throw new Error(data.error || "Sign Up failed, try again.");
      }
      
      setMessage(data.message);
      
      setTimeout(() => {
        window.location.href = "/auth/signin";
      }, 500);
    
    } catch (error: any) {
      setError(error.message || "Something went wrong, try again.");
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <main className="w-full flex flex-col items-center gap-4">
      <section className="w-full p-2 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600">
        <h1 className="text-3xl text-center font-bold text-neutral-950 dark:text-neutral-50">Registration</h1>
      </section>
      <MessageBox type="error" message={error} />
      <MessageBox type="success" message={message} />
      <form onSubmit={handleSignUp}
        className="w-full p-2 rounded flex flex-col gap-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600">
        <input
          className="w-full p-2 rounded text-neutral-950 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600"
          type="email"
          placeholder="srikanth9x@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div id="passwordBox" className="w-full flex justify-between gap-2">
          <input
          className="w-full p-2 rounded text-neutral-950 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600"
          type={showPassword ? "text" : "password"}
          placeholder="•••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
          <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
            <Eye width={40} height={40} className="p-2 rounded text-neutral-950 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600" />
            ) : (
            <EyeClosed width={40} height={40} className="p-2 rounded text-neutral-950 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600" />
            )}
          </button>
        </div>
        
        <button 
        className="w-full flex justify-center p-2 rounded text-2xl font-bold text-neutral-50 bg-red-500 hover:bg-red-700" 
        type="submit"
        disabled={loading}
        >
          {loading ? (
          <Spinner />
          ) : (
          "Sign Up"
          )}
        </button>
      </form>
      <p className="text-neutral-700 dark:text-neutral-300">Already registered? <Link href="/auth/signin" className="text-red-500">Sign In here.</Link>
      </p>
    </main>
    );
}