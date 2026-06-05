"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe2, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import BlinkoLogo from "../components/BlinkoLogo";
import Button from "../components/Button";

export default function LoginPage() {
  const router = useRouter();
  
  // Form input and loading states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      // Redirect user on successful auth
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Login Error:", err);
      // Map friendly error notices
      if (err.message?.includes("Invalid login credentials") || err.message?.includes("invalid_credentials")) {
        setErrorMsg("Incorrect email or password. Please try again.");
      } else {
        setErrorMsg(err.message || "Failed to sign in. Please verify your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error("Google Auth Error:", err);
      setErrorMsg(err.message || "Failed to initiate Google sign in.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4 py-12 text-white select-none">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.22),transparent_35%)]" />
      <section className="relative z-10 w-full max-w-md rounded-lg border border-white/10 bg-[#111111]/75 p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <BlinkoLogo />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            Welcome Back to Blinko
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to manage your page
          </p>
        </div>

        {/* Error Notice Box */}
        {errorMsg && (
          <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-400 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {/* Google OAuth Login Trigger */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:border-violet-500/50 hover:bg-white/[0.08] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
            ) : (
              <Globe2 className="h-4 w-4" aria-hidden="true" />
            )}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <div className="h-px flex-1 bg-white/10" />
            or
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Email Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-zinc-300">Email</span>
              <span className="mt-2 flex h-11 items-center gap-3 rounded-md border border-[#222222] bg-black/30 px-3 transition focus-within:border-violet-500/70">
                <Mail className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || googleLoading}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-650 disabled:opacity-50"
                />
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-300">
                Password
              </span>
              <span className="mt-2 flex h-11 items-center gap-3 rounded-md border border-[#222222] bg-black/30 px-3 transition focus-within:border-violet-500/70">
                <Lock className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || googleLoading}
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-650 disabled:opacity-50"
                />
              </span>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-black accent-violet-600 cursor-pointer"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="font-medium text-violet-300 transition hover:text-violet-200"
              >
                Forgot Password
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-bold"
              disabled={loading || googleLoading}
              icon={loading ? undefined : ArrowRight}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          New to Blinko?{" "}
          <Link
            href="/signup"
            className="font-medium text-violet-300 transition hover:text-violet-200 font-semibold"
          >
            Create Account
          </Link>
        </p>
      </section>
    </main>
  );
}
