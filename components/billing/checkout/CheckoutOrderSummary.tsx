import { PRO_PLAN } from "@/lib/billing/constants";

type CheckoutOrderSummaryProps = {
  children?: React.ReactNode;
};

export default function CheckoutOrderSummary({ children }: CheckoutOrderSummaryProps) {
  return (
    <section
      className="rounded-2xl border border-white/60 bg-white/60 p-6 shadow-md backdrop-blur-md lg:sticky lg:top-8"
      aria-labelledby="order-summary-heading"
    >
      <h2 id="order-summary-heading" className="text-base font-bold text-on-surface">
        Order Summary
      </h2>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-on-surface-variant">Plan</dt>
          <dd className="font-semibold text-on-surface">{PRO_PLAN.name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-on-surface-variant">Billing Cycle</dt>
          <dd className="font-semibold text-on-surface">{PRO_PLAN.billingCycle}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-on-surface-variant">Price</dt>
          <dd className="font-mono font-semibold text-on-surface">{PRO_PLAN.priceDisplay}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-on-surface-variant">Tax</dt>
          <dd className="font-mono font-semibold text-on-surface">{PRO_PLAN.taxDisplay}</dd>
        </div>
      </dl>

      <div className="my-5 border-t border-black/5" />

      <div className="space-y-1">
        <div className="flex justify-between gap-4 text-sm">
          <span className="font-semibold text-on-surface">Total Due Today</span>
          <span className="font-mono text-lg font-bold text-on-surface">{PRO_PLAN.priceDisplay}</span>
        </div>
        <p className="text-xs text-on-surface-variant">
          Recurring: <span className="font-semibold">{PRO_PLAN.recurringDisplay}</span>
        </p>
      </div>

      {children && <div className="mt-6 space-y-5">{children}</div>}
    </section>
  );
}
