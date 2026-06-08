import type { Metadata } from "next";
import Link from "next/link";
import { Check, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";
import { PRO_PLAN, SUCCESS_FEATURES } from "@/lib/billing/constants";

export const metadata: Metadata = createPageMetadata({
  title: "Welcome to Blinko Pro",
  description: "Your Blinko Pro subscription is now active.",
  path: "/billing/success",
});

export default function BillingSuccessPage() {
  return (
    <div className="relative mx-auto max-w-lg px-4 py-2 sm:py-4">
      {/* Background Ambient Glowing Blobs */}
      <div className="absolute -left-12 -top-12 -z-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl animate-float-1" />
      <div className="absolute -right-12 bottom-12 -z-10 h-72 w-72 rounded-full bg-secondary/15 blur-3xl animate-float-2" />

      {/* Main Success Container */}
      <div className="glass-panel-solid rounded-2xl p-6 sm:p-7 shadow-xl relative border border-white/80 overflow-hidden text-center animate-scale-in">
        {/* Sparkle top-right corner decoration */}
        <div className="absolute right-4 top-4 text-primary/30 animate-twinkle">
          <Sparkles className="h-6 w-6" />
        </div>

        {/* Celebration Header */}
        <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary/10 to-primary-container/10 border border-primary/20 shadow-inner">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
          <span className="text-2xl animate-bounce-subtle">🎉</span>
        </div>

        {/* Badge */}
        <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 shadow-sm">
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          Subscription Active
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          Welcome to Blinko Pro
        </h1>
        <p className="mt-1 text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
          Premium builder themes, unlimited trees, and custom domain integrations are unlocked.
        </p>

        {/* Premium Order Details Receipt */}
        <section 
          className="mt-4 rounded-xl border border-black/5 bg-black/5 p-3.5 text-left text-[11px] space-y-2"
          aria-labelledby="receipt-heading"
        >
          <h2 id="receipt-heading" className="font-bold text-on-surface uppercase tracking-wider text-[9px] opacity-70">
            Subscription Summary
          </h2>
          <div className="space-y-1.5 divide-y divide-black/5">
            <div className="flex justify-between pt-0.5">
              <span className="text-on-surface-variant">Selected Plan</span>
              <span className="font-semibold text-on-surface">{PRO_PLAN.name}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-on-surface-variant">Billing Cycle</span>
              <span className="font-semibold text-on-surface">{PRO_PLAN.billingCycle}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-on-surface-variant">Amount Paid</span>
              <span className="font-mono font-bold text-primary">{PRO_PLAN.priceDisplay}</span>
            </div>
            <div className="flex justify-between pt-1.5">
              <span className="text-on-surface-variant">Status</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
          </div>
        </section>

        {/* Included features grid */}
        <section
          className="mt-4 text-left"
          aria-labelledby="unlocked-features-heading"
        >
          <h2 id="unlocked-features-heading" className="text-[9px] font-bold text-on-surface uppercase tracking-wider mb-2 opacity-70">
            What is now active:
          </h2>
          <div className="grid gap-2 grid-cols-2">
            {SUCCESS_FEATURES.slice(0, 4).map((feature) => (
              <div 
                key={feature} 
                className="flex items-center gap-2 rounded-lg border border-white/50 bg-white/40 p-2 text-[10px] text-on-surface-variant transition hover:border-primary/20 hover:bg-white/60"
              >
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </div>
                <span className="font-medium truncate">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Buttons */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-container px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/25 transition hover:shadow-lg hover:shadow-primary/35 hover:scale-102 active:scale-98 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Go To Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
