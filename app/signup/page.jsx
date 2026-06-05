import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import BlinkoLogo from "../components/BlinkoLogo";
import Button from "../components/Button";

export const metadata = {
  title: "Create Account | Blinko",
  description:
    "Create your Blinko account and launch a smarter link-in-bio page.",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4 py-12 text-white">
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

        <div className="mt-8 space-y-4">
          <button
            type="button"
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:border-violet-500/50 hover:bg-white/[0.08]"
          >
            <Globe2 className="h-4 w-4" aria-hidden="true" />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <div className="h-px flex-1 bg-white/10" />
            or
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full Name"
                icon={User}
                placeholder="Avery Stone"
                type="text"
              />
              <Field
                label="Username"
                icon={Sparkles}
                placeholder="avery"
                type="text"
              />
            </div>
            <Field
              label="Email"
              icon={Mail}
              placeholder="you@company.com"
              type="email"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Password"
                icon={Lock}
                placeholder="Create password"
                type="password"
              />
              <Field
                label="Confirm Password"
                icon={Lock}
                placeholder="Confirm password"
                type="password"
              />
            </div>

            <div className="rounded-md border border-[#222222] bg-black/25 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-300">
                  Password strength
                </span>
                <span className="text-violet-300">Strong</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                <span className="h-1.5 rounded-full bg-violet-500" />
                <span className="h-1.5 rounded-full bg-violet-500" />
                <span className="h-1.5 rounded-full bg-violet-500" />
                <span className="h-1.5 rounded-full bg-white/10" />
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Username availability will appear here
              </div>
            </div>

            <Button type="submit" className="w-full" icon={ArrowRight}>
              Create Account
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-violet-300 transition hover:text-violet-200"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

function Field({ label, icon: Icon, placeholder, type }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <span className="mt-2 flex h-11 items-center gap-3 rounded-md border border-[#222222] bg-black/30 px-3 transition focus-within:border-violet-500/70">
        <Icon className="h-4 w-4 text-zinc-500" aria-hidden="true" />
        <input
          type={type}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
        />
      </span>
    </label>
  );
}
