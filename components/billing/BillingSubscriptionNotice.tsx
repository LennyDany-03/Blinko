import Link from "next/link";

export default function BillingSubscriptionNotice() {
  return (
    <div className="mt-4 space-y-2 border-t border-black/5 pt-4 text-center">
      <p className="text-[11px] leading-relaxed text-on-surface-variant">
        Recurring monthly subscription.
        <br />
        Cancel anytime.
      </p>
      <p className="text-[11px] leading-relaxed text-on-surface-variant/80">
        By upgrading you agree to our:{" "}
        <Link
          href="/terms"
          className="font-semibold text-primary hover:text-primary-container transition-colors"
        >
          Terms of Service
        </Link>
        ,{" "}
        <Link
          href="/privacy"
          className="font-semibold text-primary hover:text-primary-container transition-colors"
        >
          Privacy Policy
        </Link>
        , and{" "}
        <Link
          href="/refund-policy"
          className="font-semibold text-primary hover:text-primary-container transition-colors"
        >
          Refund Policy
        </Link>
        .
      </p>
    </div>
  );
}
