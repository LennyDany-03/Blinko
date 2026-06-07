import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { PRO_PLAN, SUCCESS_FEATURES } from "@/lib/billing/constants";

export const metadata: Metadata = createPageMetadata({
  title: "Welcome to Blinko Pro",
  description: "Your Blinko Pro subscription is now active.",
  path: "/billing/success",
});

export default function BillingSuccessPage() {
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl">
          🎉
        </span>
      </div>

      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        Subscription Active
      </div>

      <h1 className="text-2xl font-extrabold text-on-surface sm:text-3xl">
        Welcome to Blinko Pro
      </h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        Your {PRO_PLAN.recurringDisplay} subscription is active. Premium features are unlocked instantly.
      </p>

      <section
        className="mt-8 rounded-2xl border border-white/60 bg-white/50 p-6 text-left shadow-sm backdrop-blur-md"
        aria-labelledby="unlocked-features"
      >
        <h2 id="unlocked-features" className="text-sm font-bold text-on-surface">
          Unlocked Features
        </h2>
        <ul className="mt-4 space-y-2.5" role="list">
          {SUCCESS_FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <Link
        href="/dashboard"
        className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-container px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 sm:w-auto"
      >
        Go To Dashboard
      </Link>
    </div>
  );
}
