import Link from "next/link";
import { ArrowRight, Globe2, Lock, Mail } from "lucide-react";
import BlinkoLogo from "../components/BlinkoLogo";
import Button from "../components/Button";

export const metadata = {
  title: "Login | Blinko",
  description: "Sign in to manage your Blinko link-in-bio page.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4 py-12 text-white">
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

          <form className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-zinc-300">Email</span>
              <span className="mt-2 flex h-11 items-center gap-3 rounded-md border border-[#222222] bg-black/30 px-3 transition focus-within:border-violet-500/70">
                <Mail className="h-4 w-4 text-zinc-500" aria-hidden="true" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
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
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                />
              </span>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-zinc-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-black accent-violet-600"
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

            <Button type="submit" className="w-full" icon={ArrowRight}>
              Sign In
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          New to Blinko?{" "}
          <Link
            href="/signup"
            className="font-medium text-violet-300 transition hover:text-violet-200"
          >
            Create Account
          </Link>
        </p>
      </section>
    </main>
  );
}
