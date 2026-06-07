import { Check } from "lucide-react";
import { PRO_FEATURES } from "@/lib/billing/constants";

export default function CheckoutPlanDetails() {
  return (
    <section
      className="rounded-2xl border border-white/60 bg-white/50 p-6 shadow-sm backdrop-blur-md"
      aria-labelledby="plan-details-heading"
    >
      <h2 id="plan-details-heading" className="text-xl font-bold text-on-surface">
        Blinko Pro
      </h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        Unlock the full power of Blinko.
      </p>

      <ul className="mt-6 space-y-3" role="list">
        {PRO_FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-on-surface-variant">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
