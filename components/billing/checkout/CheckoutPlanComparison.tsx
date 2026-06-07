import { ArrowRight, Check } from "lucide-react";
import { FREE_LIMITS, PRO_BENEFITS } from "@/lib/billing/constants";

export default function CheckoutPlanComparison() {
  return (
    <section
      className="rounded-2xl border border-white/60 bg-white/40 p-6 shadow-sm backdrop-blur-md"
      aria-labelledby="plan-comparison-heading"
    >
      <h2 id="plan-comparison-heading" className="sr-only">
        Plan comparison
      </h2>

      <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
        <div className="rounded-xl border border-black/5 bg-white/60 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Current Plan
          </p>
          <h3 className="mt-1 text-lg font-bold text-on-surface">Free</h3>
          <p className="mt-3 text-xs font-semibold text-on-surface-variant">Limits:</p>
          <ul className="mt-2 space-y-2" role="list">
            {FREE_LIMITS.map((limit) => (
              <li key={limit} className="flex gap-2 text-xs text-on-surface-variant">
                <span className="text-on-surface-variant/50" aria-hidden="true">—</span>
                {limit}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center justify-center md:flex" aria-hidden="true">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 shadow-sm shadow-primary/5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
            Upgrade To
          </p>
          <h3 className="mt-1 text-lg font-bold text-on-surface">Blinko Pro</h3>
          <p className="mt-3 text-xs font-semibold text-on-surface-variant">Benefits:</p>
          <ul className="mt-2 space-y-2" role="list">
            {PRO_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex gap-2 text-xs text-on-surface-variant">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
