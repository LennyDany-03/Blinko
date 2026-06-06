"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "../../lib/supabase";
import BlinkoLogo from "../components/BlinkoLogo";
import Button from "../components/Button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState({ type: null, text: "" }); // { type: 'success' | 'error', text: '' }

  // Cooldown timer handler
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    if (!email) {
      setMessage({ type: "error", text: "No email address found. Please go back to the signup page." });
      return;
    }

    setLoading(true);
    setMessage({ type: null, text: "" });

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;

      setMessage({ type: "success", text: "Verification link resent successfully! Please check your inbox." });
      setCooldown(60); // 60 seconds cooldown
    } catch (err) {
      console.error("Resend Error:", err);
      
      const errMsg = err.message || "";
      const secondsMatch = errMsg.match(/after\s+(\d+)\s+seconds/i);
      
      if (secondsMatch) {
        const seconds = parseInt(secondsMatch[1], 10);
        setCooldown(seconds);
        setMessage({
          type: "error",
          text: `Please wait ${seconds} second${seconds === 1 ? "" : "s"} before requesting another link.`,
        });
      } else if (errMsg.toLowerCase().includes("rate limit exceeded")) {
        setMessage({
          type: "error",
          text: "Email rate limit exceeded. Please wait a while before requesting another link, or check your spam folder.",
        });
      } else {
        setMessage({
          type: "error",
          text: errMsg || "Failed to resend verification link. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/60 bg-white/45 p-6 shadow-[0_8px_32px_rgba(159,65,34,0.04)] backdrop-blur-2xl sm:p-8 animate-scale-in">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <BlinkoLogo />
        </div>
        
        {/* Pulsating Mail Icon Container */}
        <div className="relative my-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/5 opacity-75" style={{ animationDuration: '2s' }} />
          <Mail className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
          Check your email
        </h1>
        <p className="mt-3 text-sm text-on-surface-variant/80">
          We sent a verification link to your email address:
        </p>
        
        {email ? (
          <div className="mt-2 rounded-xl bg-white/50 px-3.5 py-2 font-mono text-xs text-primary border border-black/5 break-all max-w-full">
            {email}
          </div>
        ) : (
          <div className="mt-2 text-xs text-on-surface-variant/50 italic">
            your registered email address
          </div>
        )}

        <p className="mt-4 text-xs text-on-surface-variant/70 leading-relaxed">
          Please confirm your email address using the link in that mail, then return here to sign in to access your dashboard.
        </p>
      </div>

      {/* Message Notifications */}
      {message.text && (
        <div className={`mt-6 flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs animate-in fade-in duration-200 ${
          message.type === "success" 
            ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
            : "border-rose-200 bg-rose-50 text-rose-700"
        }`}>
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {/* Main action: Sign In */}
        <Link href="/login" className="block w-full">
          <Button variant="luminous" className="w-full h-11 text-sm font-bold shadow-md shadow-primary/10" icon={ArrowRight}>
            Go to Login
          </Button>
        </Link>

        {/* Resend utility */}
        {email && (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading || cooldown > 0}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-white/60 bg-white/45 text-xs font-semibold text-on-surface hover:bg-white/60 hover:border-white/80 transition shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                Resending link...
              </>
            ) : cooldown > 0 ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-on-surface-variant/50 duration-1000" />
                Resend in {cooldown}s
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5 text-on-surface-variant/65" />
                Didn&apos;t receive email? Resend
              </>
            )}
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-on-surface-variant/60">
        Wrong email?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary hover:text-primary-container transition duration-200"
        >
          Sign up with another email
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 text-on-surface select-none relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(159,65,34,0.06),transparent_45%)]" />
      <Suspense fallback={
        <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/60 bg-white/45 p-12 shadow-[0_8px_32px_rgba(159,65,34,0.04)] backdrop-blur-2xl flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mt-4 text-sm text-on-surface-variant/70">Loading page info...</span>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
