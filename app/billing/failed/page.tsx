import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Payment Failed",
  description: "Your Blinko Pro payment could not be processed.",
  path: "/billing/failed",
});

export default function BillingFailedPage() {
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
        <AlertCircle className="h-8 w-8 text-error" aria-hidden="true" />
      </div>

      <h1 className="text-2xl font-extrabold text-on-surface sm:text-3xl">Payment Failed</h1>
      <p className="mt-2 text-sm text-on-surface-variant">
        We couldn&apos;t process your payment. No charges were made to your account.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/billing/checkout"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-container px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
        >
          Retry Payment
        </Link>
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/60 px-6 py-3 text-sm font-semibold text-on-surface transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
        >
          Back to Billing
        </Link>
      </div>
    </div>
  );
}
