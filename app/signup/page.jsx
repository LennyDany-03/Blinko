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
    if (!password) return { label: "Empty", score: 0, color: "bg-black/10" };
    if (password.length < 6) return { label: "Weak", score: 1, color: "bg-rose-500" };
    
    let hasLetters = /[a-zA-Z]/.test(password);
    let hasNumbers = /[0-9]/.test(password);
    let hasSpecial = /[^a-zA-Z0-9]/.test(password);
    
    const criteriaCount = [hasLetters, hasNumbers, hasSpecial].filter(Boolean).length;
    
    if (password.length >= 8 && criteriaCount === 3) {
      return { label: "Strong", score: 3, color: "bg-emerald-500" };
    }
    return { label: "Medium", score: 2, color: "bg-primary" };
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

    if (typeof window !== "undefined") {
      localStorage.setItem("blinko_auth_mode", "signup");
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
      console.error("Google Auth Signup Error:", err);
      setErrorMsg(err.message || "Failed to initiate Google sign up.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 text-on-surface select-none relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(159,65,34,0.06),transparent_45%)]" />
      <section className="relative z-10 w-full max-w-lg rounded-[32px] border border-white/60 bg-white/45 p-6 shadow-[0_8px_32px_rgba(159,65,34,0.04)] backdrop-blur-2xl sm:p-8 animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <BlinkoLogo />
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-on-surface font-display-xl">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant/80 font-body-md">
            Create your Blinko account
          </p>
        </div>

        {/* Error Notice Box */}
        {errorMsg && (
          <div className="mt-6 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-650" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-8 space-y-4">
          {/* Google signup trigger */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
            <div className="rounded-2xl border border-black/10 bg-white/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-on-surface-variant/80">
                  Password strength
                </span>
                <span className={password ? (strength.score === 3 ? "text-emerald-600 font-semibold" : strength.score === 2 ? "text-primary font-semibold" : "text-rose-605 font-semibold") : "text-on-surface-variant/40"}>
                  {password ? strength.label : "None"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <span className={`h-1.5 rounded-full transition ${strength.score >= 1 ? strength.color : "bg-black/10"}`} />
                <span className={`h-1.5 rounded-full transition ${strength.score >= 2 ? strength.color : "bg-black/10"}`} />
                <span className={`h-1.5 rounded-full transition ${strength.score >= 3 ? strength.color : "bg-black/10"}`} />
                <span className="h-1.5 rounded-full bg-black/10" />
              </div>
              
              {/* Dynamic Username availability notifications */}
              <div className="flex items-center gap-2 text-xs pt-1">
                {usernameChecking ? (
                  <span className="flex items-center gap-1.5 text-on-surface-variant/50">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    Checking handle availability...
                  </span>
                ) : usernameAvailable === true ? (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    {usernameStatusMsg}
                  </span>
                ) : usernameAvailable === false ? (
                  <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                    <XCircle className="h-3.5 w-3.5 text-rose-500" />
                    {usernameStatusMsg}
                  </span>
                ) : (
                  <span className="text-on-surface-variant/40">Username availability checks show here</span>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="luminous"
              className="w-full h-11 text-sm font-bold shadow-md shadow-primary/10"
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

        <p className="mt-6 text-center text-sm text-on-surface-variant/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-container transition duration-200"
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
      <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{label}</span>
      <span className="mt-2 flex h-11 items-center gap-3 rounded-2xl border border-black/10 bg-white/45 px-3.5 transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15">
        <Icon className="h-4 w-4 text-on-surface-variant/60" aria-hidden="true" />
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full min-w-0 bg-transparent text-sm text-on-surface outline-none placeholder:text-on-surface-variant/30 disabled:opacity-50"
        />
      </span>
    </label>
  );
}
