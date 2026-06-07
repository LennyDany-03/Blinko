import { ShieldCheck } from "lucide-react";
import { TRUST_INDICATORS } from "@/lib/billing/constants";

export default function CheckoutTrustIndicators() {
  return (
    <section
      className="rounded-2xl border border-white/60 bg-white/30 p-5 shadow-sm"
      aria-labelledby="trust-heading"
    >
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 id="trust-heading" className="text-sm font-semibold text-on-surface">
          Why upgrade with confidence
        </h2>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2" role="list">
        {TRUST_INDICATORS.map((item) => (
          <li key={item} className="flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="text-primary" aria-hidden="true">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
