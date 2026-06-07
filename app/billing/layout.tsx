import Link from "next/link";

export default function BillingFlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-black/5 bg-white/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              B
            </span>
            <span className="text-sm font-bold text-on-surface">Blinko</span>
          </Link>
          <Link
            href="/contact"
            className="text-xs font-medium text-on-surface-variant transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-md px-2 py-1"
          >
            Need help?
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
    </div>
  );
}
