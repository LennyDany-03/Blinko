"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Lock,
  Mail,
  Sparkles,
  User,
  Loader2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { validateUsername, validateDisplayName, validateEmail } from "../../lib/validation";
import BlinkoLogo from "../components/BlinkoLogo";
import Button from "../components/Button";

export default function SignupPage() {
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading and Error states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Username checking states
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null); // null, true, false
  const [usernameStatusMsg, setUsernameStatusMsg] = useState("");

  // Debounce username queries
  useEffect(() => {
    if (!username) {
      Promise.resolve().then(() => {
        setUsernameAvailable(null);
        setUsernameStatusMsg("");
      });
      return;
    }

    const timer = setTimeout(async () => {
      setUsernameChecking(true);
      
      const valCheck = validateUsername(username);
      if (!valCheck.isValid) {
        setUsernameAvailable(false);
        setUsernameStatusMsg(valCheck.message);
        setUsernameChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("trees")
          .select("id")
          .eq("slug", valCheck.cleanValue)
          .maybeSingle();

        if (error) {
          // Fallback check on profiles table if slug column does not exist yet
          const { data: profData } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", valCheck.cleanValue)
            .maybeSingle();

          if (profData) {
            setUsernameAvailable(false);
            setUsernameStatusMsg(`@${valCheck.cleanValue} is already taken.`);
          } else {
            setUsernameAvailable(true);
            setUsernameStatusMsg(`@${valCheck.cleanValue} is available!`);
          }
          return;
        }

        if (!data) {
          setUsernameAvailable(true);
          setUsernameStatusMsg(`@${valCheck.cleanValue} is available!`);
        } else {
          setUsernameAvailable(false);
          setUsernameStatusMsg(`@${valCheck.cleanValue} is already taken.`);
        }
      } catch (err) {
        console.error("Username Check Error:", err.message || err);
        // Fallback check on profiles table on catch
        try {
          const { data: profData } = await supabase
            .from("profiles")
            .select("id")
            .eq("username", valCheck.cleanValue)
            .maybeSingle();

          if (profData) {
            setUsernameAvailable(false);
            setUsernameStatusMsg(`@${valCheck.cleanValue} is already taken.`);
          } else {
            setUsernameAvailable(false);
            setUsernameStatusMsg("Error checking handle availability.");
          }
        } catch {
          setUsernameAvailable(false);
          setUsernameStatusMsg("Error checking handle availability.");
        }
      } finally {
        setUsernameChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // Dynamic Password Strength check
  const getPasswordStrength = () => {
    if (!password) return { label: "Empty", score: 0, color: "bg-white/10" };
    if (password.length < 6) return { label: "Weak", score: 1, color: "bg-rose-500" };
    
    let hasLetters = /[a-zA-Z]/.test(password);
    let hasNumbers = /[0-9]/.test(password);
    let hasSpecial = /[^a-zA-Z0-9]/.test(password);
    
    const criteriaCount = [hasLetters, hasNumbers, hasSpecial].filter(Boolean).length;
    
    if (password.length >= 8 && criteriaCount === 3) {
      return { label: "Strong", score: 3, color: "bg-emerald-500" };
    }
    return { label: "Medium", score: 2, color: "bg-violet-500" };
  };

  const strength = getPasswordStrength();

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Front-end Validations
    const nameVal = validateDisplayName(fullName);
    if (!nameVal.isValid) {
      setErrorMsg(`Name Error: ${nameVal.message}`);
      return;
    }

    const userVal = validateUsername(username);
    if (!userVal.isValid) {
      setErrorMsg(`Username Error: ${userVal.message}`);
      return;
    }

    if (usernameAvailable === false) {
      setErrorMsg("Please choose an available username.");
      return;
    }

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setErrorMsg(`Email Error: ${emailVal.message}`);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: nameVal.cleanValue,
            username: userVal.cleanValue,
          },
        },
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error("Failed to register user. Please try again.");
      }

      // 2. Redirect/Alert based on active session existence (email verification checks)
      if (authData.session) {
        router.push("/dashboard");
        router.refresh();
      } else {
        // Verification email sent, redirect to verify-email page
        router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      if (err.message?.includes("already registered")) {
        setErrorMsg("This email is already associated with an account.");
      } else {
        setErrorMsg(err.message || "Failed to create account. Please verify input fields.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
      console.error("Google Auth Signup Error:", err);
      setErrorMsg(err.message || "Failed to initiate Google sign up.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4 py-12 text-white select-none">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.2),transparent_35%)]" />
      <section className="relative z-10 w-full max-w-lg rounded-lg border border-white/10 bg-[#111111]/75 p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          <BlinkoLogo />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Create your Blinko account
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
          {/* Google signup trigger */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
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

          <form onSubmit={handleEmailSignUp} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full Name"
                icon={User}
                placeholder="Avery Stone"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading || googleLoading}
              />
              <Field
                label="Username"
                icon={Sparkles}
                placeholder="avery"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading || googleLoading}
              />
            </div>
            <Field
              label="Email"
              icon={Mail}
              placeholder="you@company.com"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || googleLoading}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Password"
                icon={Lock}
                placeholder="Create password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || googleLoading}
              />
              <Field
                label="Confirm Password"
                icon={Lock}
                placeholder="Confirm password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading || googleLoading}
              />
            </div>

            {/* Dynamic Status Blocks */}
            <div className="rounded-md border border-[#222222] bg-black/25 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-400">
                  Password strength
                </span>
                <span className={password ? (strength.score === 3 ? "text-emerald-400 font-semibold" : strength.score === 2 ? "text-violet-400 font-semibold" : "text-rose-400 font-semibold") : "text-zinc-650"}>
                  {password ? strength.label : "None"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className={`h-1.5 rounded-full transition ${strength.score >= 1 ? strength.color : "bg-white/10"}`} />
                <span className={`h-1.5 rounded-full transition ${strength.score >= 2 ? strength.color : "bg-white/10"}`} />
                <span className={`h-1.5 rounded-full transition ${strength.score >= 3 ? strength.color : "bg-white/10"}`} />
                <span className="h-1.5 rounded-full bg-white/10" />
              </div>
              
              {/* Dynamic Username availability notifications */}
              <div className="flex items-center gap-2 text-xs pt-1">
                {usernameChecking ? (
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Checking handle availability...
                  </span>
                ) : usernameAvailable === true ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    {usernameStatusMsg}
                  </span>
                ) : usernameAvailable === false ? (
                  <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
                    <XCircle className="h-3.5 w-3.5 text-rose-400" />
                    {usernameStatusMsg}
                  </span>
                ) : (
                  <span className="text-zinc-550">Username availability checks show here</span>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-sm font-bold"
              disabled={loading || googleLoading || usernameAvailable === false}
              icon={loading ? undefined : ArrowRight}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-violet-300 transition hover:text-violet-200 font-semibold"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

function Field({ label, icon: Icon, placeholder, type, required, value, onChange, disabled }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <span className="mt-2 flex h-11 items-center gap-3 rounded-md border border-[#222222] bg-black/30 px-3 transition focus-within:border-violet-500/70">
        <Icon className="h-4 w-4 text-zinc-500" aria-hidden="true" />
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-zinc-650 disabled:opacity-50"
        />
      </span>
    </label>
  );
}
