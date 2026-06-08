import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, HelpCircle, ArrowRight, RefreshCw } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Payment Failed",
  description: "Your Blinko Pro payment could not be processed.",
  path: "/billing/failed",
});

export default function BillingFailedPage() {
  const troubleshootingTips = [
    "Check for insufficient funds or transaction limits.",
    "Verify card CVV, expiry date, and number are correct.",
    "Ensure 3D-Secure / OTP verification was completed.",
    "If using a corporate card, contact your administrator."
  ];

  return (
    <div className="relative mx-auto max-w-lg px-4 py-2 sm:py-4 animate-in fade-in duration-300">
      {/* Background Ambient Crimson Blob */}
      <div className="absolute -left-12 -top-12 -z-10 h-64 w-64 rounded-full bg-rose-500/10 blur-3xl animate-float-1" />
      <div className="absolute -right-12 bottom-12 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-float-2" />

      {/* Main Container */}
      <div className="glass-panel-solid rounded-2xl p-6 sm:p-7 shadow-xl relative border border-white/80 overflow-hidden text-center animate-scale-in">
        {/* Warning Icon Container */}
        <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20 shadow-inner">
          <span className="absolute inset-0 animate-ping rounded-full bg-rose-500/5" />
          <AlertCircle className="h-7 w-7 text-rose-600 animate-pulse" aria-hidden="true" />
        </div>

        {/* Title & Desc */}
        <h1 className="text-2xl font-extrabold tracking-tight text-on-surface sm:text-3xl bg-gradient-to-r from-rose-600 to-primary bg-clip-text text-transparent">
          Payment Process Failed
        </h1>
        <p className="mt-1.5 text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
          We couldn&apos;t complete your upgrade request. No charges were made to your account.
        </p>

        {/* Troubleshooting Guide */}
        <section
          className="mt-4 rounded-xl border border-black/5 bg-black/5 p-3.5 text-left text-[11px] space-y-2.5"
          aria-labelledby="tips-heading"
        >
          <div className="flex items-center gap-1.5 text-on-surface font-bold">
            <HelpCircle className="h-3.5 w-3.5 text-primary" />
            <h2 id="tips-heading" className="uppercase tracking-wider text-[9px] opacity-70">
              Troubleshooting Suggestions
            </h2>
          </div>
          <ul className="space-y-1.5 text-on-surface-variant text-[10px]" role="list">
            {troubleshootingTips.map((tip, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="font-semibold text-primary">{i + 1}.</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/billing/checkout"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-container px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-primary/25 transition hover:shadow-lg hover:shadow-primary/35 hover:scale-102 active:scale-98 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry Upgrade
          </Link>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center justify-center gap-1 rounded-full border border-black/10 bg-white/60 px-6 py-2.5 text-xs font-semibold text-on-surface transition hover:bg-white hover:scale-102 active:scale-98 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Back to Billing
            <ArrowRight className="h-3.5 w-3.5 text-on-surface-variant" />
          </Link>
        </div>
      </div>
    </div>
  );
}
