"use client";

import { useState, useEffect } from "react";
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

  // New user popup states
  const [showNewUserPopup, setShowNewUserPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("new_user") === "true") {
        setShowNewUserPopup(true);
        
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(interval);
      }
    }
  }, []);

  useEffect(() => {
    if (showNewUserPopup && countdown === 0) {
      router.push("/signup");
    }
  }, [countdown, showNewUserPopup, router]);

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

    if (typeof window !== "undefined") {
      localStorage.setItem("blinko_auth_mode", "login");
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
    <main className="flex flex-1 items-center justify-center bg-transparent px-4 py-12 text-on-surface select-none relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(159,65,34,0.06),transparent_45%)]" />
      <section className="relative z-10 w-full max-w-md rounded-[32px] border border-white/60 bg-white/45 p-6 shadow-[0_8px_32px_rgba(159,65,34,0.04)] backdrop-blur-2xl sm:p-8 animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <BlinkoLogo />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-on-surface font-display-xl">
            Welcome Back to Blinko
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant/80 font-body-md">
            Sign in to manage your page
          </p>
        </div>

        {/* Error Notice Box */}
        {errorMsg && (
          <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {/* Google OAuth Login Trigger */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/60 bg-white/45 text-sm font-semibold text-on-surface transition duration-200 hover:-translate-y-0.5 hover:bg-white/60 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Globe2 className="h-4 w-4 text-on-surface-variant/70" aria-hidden="true" />
            )}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs text-on-surface-variant/50 font-medium">
            <div className="h-px flex-1 bg-black/10" />
            or
            <div className="h-px flex-1 bg-black/10" />
          </div>

          {/* Email Password Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Email</span>
              <span className="mt-2 flex h-11 items-center gap-3 rounded-2xl border border-black/10 bg-white/45 px-3.5 transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15">
                <Mail className="h-4 w-4 text-on-surface-variant/60" aria-hidden="true" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || googleLoading}
                  className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/30 disabled:opacity-50"
                />
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Password
              </span>
              <span className="mt-2 flex h-11 items-center gap-3 rounded-2xl border border-black/10 bg-white/45 px-3.5 transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15">
                <Lock className="h-4 w-4 text-on-surface-variant/60" aria-hidden="true" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || googleLoading}
                  className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/30 disabled:opacity-50"
                />
              </span>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-on-surface-variant/80 hover:text-on-surface cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-black/10 bg-white/50 accent-primary cursor-pointer"
                />
                Remember me
              </label>
              <Link
                href="#"
                className="font-medium text-primary hover:text-primary-container transition duration-200"
              >
                Forgot Password
              </Link>
            </div>

            <Button
              type="submit"
              variant="luminous"
              className="w-full h-11 text-sm font-bold shadow-md shadow-primary/10"
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

        <p className="mt-6 text-center text-sm text-on-surface-variant/60">
          New to Blinko?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-primary-container transition duration-200"
          >
            Create Account
          </Link>
        </p>
      </section>

      {/* New User Redirection Popup Modal */}
      {showNewUserPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 select-none animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-[32px] border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-2xl text-center sm:p-8 animate-scale-in space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600 animate-bounce">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-on-surface font-display-xl">
                It seems you are a new user
              </h2>
              <p className="text-sm text-on-surface-variant/80 font-body-md leading-relaxed">
                You do not have a Blinko account associated with this email. Please sign up first to start creating your Blinko Tree.
              </p>
            </div>

            <div className="bg-black/5 rounded-2xl p-3 text-xs text-on-surface-variant/70 font-semibold">
              Redirecting to sign up page in <span className="text-primary font-bold">{countdown}</span> seconds...
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  router.push("/login");
                  setShowNewUserPopup(false);
                }}
                className="flex-1 h-11 rounded-full border border-black/10 bg-white/60 text-sm font-semibold text-on-surface hover:bg-white transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  router.push("/signup");
                }}
                className="flex-1 h-11 bg-primary text-white border border-primary/20 shadow-md rounded-full text-sm font-semibold hover:bg-primary/95 transition duration-200 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Sign Up
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
