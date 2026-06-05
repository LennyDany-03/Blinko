import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import BlinkoLogo from "./BlinkoLogo";
import Button from "./Button";

const navItems = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Templates", href: "/templates" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BlinkoLogo />

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition duration-200 hover:bg-white/[0.04] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-400 transition hover:text-white"
          >
            Login
          </Link>
          <Button href="/signup" size="sm" icon={ArrowRight}>
            Get Started
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white transition hover:border-violet-500/50 hover:bg-white/[0.08] md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </nav>
    </header>
  );
}
