"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Eye, EyeClosed } from "iconoir-react";
import { Spinner } from "@/components/Spinner";
import { MessageBox } from "@/components/MessageBox";
import Link from "next/link";

export default function SignInPage() {
  
  const supabase = createClientComponentClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email, 
        password,
      });
      if (error || !data.user) {
        setError(error?.message || "Sign In failed, try again.")
        return;
      }
      
      const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
      if (profileError) {
        setError(profileError.message);
        return;
      }
      if (profile.role === "admin") {
        router.push("/admin/dashboard");
      } else if (profile.role === "faculty_advisor") {
        router.push("/faculty-advisor/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong, try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
  <main className="w-full flex flex-col items-center gap-4">
    <section className="w-full p-2 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600">
      <h1 className="text-3xl text-center font-bold text-neutral-950 dark:text-neutral-50">Welcome back</h1>
    </section>
    <MessageBox type="error" message={error} />
    <MessageBox type="success" message={message} />
    <form onSubmit={handleSignIn}
      className="w-full p-2 rounded flex flex-col gap-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600">
      <input 
      className="w-full p-2 rounded text-neutral-950 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600" 
      type="email" 
      placeholder="srikanth9x@gmail.com" 
      value={email} 
      onChange={(e) => setEmail(e.target.value)}
      />
      <div id="passwordBox" 
      className="w-full flex justify-between gap-2">
        <input 
        className="w-full p-2 rounded text-neutral-950 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-800 border border-neutral-500 border-t border-t-neutral-400 dark:border-t-neutral-600"
        type={showPassword ? "text" : "password"}
        placeholder="•••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
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
      disabled={loading}>{
      loading ? (
      <Spinner />
      ) : (
      "Sign In"
      )}
      </button>
    </form>
    <p className="text-neutral-700 dark:text-neutral-300">Did not registered? <Link href="/auth/signup" className="text-red-500">Sign Up here.</Link>
    </p>
  </main>  
);
}