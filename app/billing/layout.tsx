import Link from "next/link";
import BlinkoLogo from "@/app/components/BlinkoLogo";

export default function BillingFlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-black/5 bg-white/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <BlinkoLogo href="/dashboard" />
          <Link
            href="/contact"
            className="text-xs font-medium text-on-surface-variant transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-md px-2 py-1"
          >
            Need help?
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4">{children}</main>
    </div>
  );
}
