"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Sparkles,
  CreditCard,
  Check,
  TrendingUp,
  Lock,
  ArrowUpRight,
  Shield,
  Download,
} from "lucide-react";
import { MOCK_PLANS } from "../../constants/dashboardData";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/Button";

export default function BillingPage() {
  const [billingState, setBillingState] = useState({
    planName: MOCK_PLANS.current.name,
    metrics: MOCK_PLANS.current.metrics,
    history: MOCK_PLANS.history,
  });

  const [upgraded, setUpgraded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUpgraded(true);
      
      // Update plan to Pro, set metrics limits to infinity/unlimited, and add a transaction to invoice history
      setBillingState({
        planName: "Pro",
        metrics: [
          { name: "Pages Created", current: 1, limit: "∞", percent: 5 },
          { name: "Monthly Views", current: 1240, limit: "∞", percent: 2 },
          { name: "Links Used", current: 4, limit: "∞", percent: 1 },
        ],
        history: [
          {
            id: `inv-${Date.now()}`,
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            amount: "$5.00",
            status: "Paid",
            invoice: "INV-2026-003",
          },
          ...billingState.history,
        ],
      });
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SectionHeader
        title="Billing & Subscription"
        description="Manage your subscription plans, track resource usage, and download invoices."
      />

      {/* Premium Upgrade Toast */}
      {upgraded && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-violet-500/30 bg-zinc-950 px-4 py-3 text-sm text-violet-400 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="h-4 w-4 animate-bounce" />
          <span>Congratulations! You are now subscribed to Blinko Pro. 🎉</span>
        </div>
      )}

      {/* Grid: Plan & Usage Overview */}
      <div className="grid gap-6 md:grid-cols-5">
        {/* Usage metrics panel */}
        <DashboardCard className="md:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">Resource Usage</h3>
              <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 text-[10px] text-zinc-400 font-medium">
                Resets in 24 days
              </span>
            </div>
            
            <div className="space-y-5">
              {billingState.metrics.map((metric) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-300">{metric.name}</span>
                    <span className="text-zinc-500 font-mono">
                      {metric.current} / <span className="text-zinc-350">{metric.limit}</span>
                    </span>
                  </div>
                  {/* Progress track */}
                  <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className={[
                        "h-full rounded-full transition-all duration-500",
                        billingState.planName === "Pro"
                          ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          : metric.percent > 75
                          ? "bg-rose-500"
                          : "bg-violet-500",
                      ].join(" ")}
                      style={{ width: `${metric.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-xs text-zinc-500 leading-relaxed border-t border-zinc-900 pt-4">
            * Limits reflect counts for the current billing cycle. Upgrade to access unlimited resources.
          </div>
        </DashboardCard>

        {/* Current Subscription Card */}
        <DashboardCard className="md:col-span-2 relative overflow-hidden bg-zinc-950 flex flex-col justify-between">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-violet-600/10 blur-2xl pointer-events-none" />
          
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Current Plan</span>
            <h4 className="text-3xl font-extrabold text-white mt-2 flex items-baseline gap-2">
              {billingState.planName}
              {billingState.planName === "Pro" ? (
                <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs text-violet-300 font-semibold uppercase tracking-wider">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                  Basic
                </span>
              )}
            </h4>
            <p className="text-xs text-zinc-400 mt-2">
              {billingState.planName === "Pro"
                ? "You have unlocked complete access to advanced themes, domain bindings, and AI creators."
                : "Ideal for basic link sharing. Upgrade to remove branding and unlock SEO controls."}
            </p>
          </div>

          <div className="mt-8">
            {billingState.planName === "Free" ? (
              <Button variant="primary" className="w-full text-xs font-bold" onClick={handleUpgrade} disabled={loading}>
                {loading ? "Processing..." : "Upgrade to Pro ($5/mo)"}
              </Button>
            ) : (
              <Button variant="secondary" className="w-full text-xs font-bold text-zinc-350" disabled>
                Manage Subscription
              </Button>
            )}
          </div>
        </DashboardCard>
      </div>

      {/* Upgrade CTA banner */}
      {billingState.planName === "Free" && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 md:p-8 text-white shadow-xl shadow-violet-950/20">
          {/* Sparkle layout details */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden md:block opacity-20">
            <Sparkles className="h-32 w-32 animate-pulse" />
          </div>

          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Special Offer
            </span>
            <h3 className="text-xl font-bold tracking-tight md:text-2xl">
              Ready to go unlimited with Blinko Pro?
            </h3>
            <p className="mt-2 text-sm text-violet-100 leading-relaxed">
              Unlock custom domain integration, full dashboard analytics, dedicated e-commerce store blocks, automated AI biography builder, and remove all Blinko platform watermarks.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-50 transition cursor-pointer shadow-lg disabled:opacity-50"
              >
                {loading ? "Processing..." : "Unlock Pro Now"}
              </button>
              <span className="text-xs text-violet-200 self-center font-medium">Cancel anytime. 30-day money-back guarantee.</span>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Comparison Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white">Compare Plans</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {MOCK_PLANS.pricing.map((plan) => {
            const isPro = plan.name === "Pro";
            const isUserCurrent = billingState.planName === plan.name;

            return (
              <DashboardCard
                key={plan.name}
                className={[
                  "relative flex flex-col justify-between border p-6 transition duration-300",
                  isPro && billingState.planName === "Free" ? "border-violet-500/50 bg-violet-650/[0.03]" : "",
                ].join(" ")}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-base font-semibold text-white">{plan.name}</h4>
                    {isPro && (
                      <span className="rounded bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] text-violet-400 font-semibold uppercase tracking-wider">
                        Recommended
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-zinc-500 mt-1.5">{plan.description}</p>
                  
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-xs text-zinc-500">/{plan.period}</span>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-xs text-zinc-400">
                        <Check className="h-4 w-4 text-violet-400 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  {isUserCurrent ? (
                    <button
                      disabled
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2.5 text-xs font-semibold text-zinc-500 cursor-not-allowed text-center"
                    >
                      Your Current Plan
                    </button>
                  ) : isPro ? (
                    <button
                      onClick={handleUpgrade}
                      disabled={loading}
                      className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 py-2.5 text-xs font-bold text-white hover:from-violet-500 hover:to-fuchsia-400 transition cursor-pointer text-center"
                    >
                      {loading ? "Processing..." : "Upgrade to Pro"}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full rounded-lg border border-zinc-900 bg-zinc-900/50 py-2.5 text-xs font-semibold text-zinc-500 cursor-not-allowed text-center"
                    >
                      Downgrade Unavailable
                    </button>
                  )}
                </div>
              </DashboardCard>
            );
          })}
        </div>
      </div>

      {/* Payment History Ledger */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-violet-400" />
          <h3 className="text-base font-semibold text-white">Payment History</h3>
        </div>

        <DashboardCard className="overflow-x-auto p-0">
          <table className="min-w-[600px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-950/60 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="px-6 py-3.5">Invoice Date</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Invoice Code</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 bg-zinc-950/20 text-xs">
              {billingState.history.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-zinc-900/20 transition">
                  <td className="px-6 py-3.5 text-zinc-300 font-semibold">{invoice.date}</td>
                  <td className="px-6 py-3.5 text-zinc-300 font-mono font-medium">{invoice.amount}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/15">
                      <span className="h-1 w-1 rounded-full bg-emerald-400" />
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-zinc-500 font-mono">{invoice.invoice}</td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => alert(`Success: Initiated download for ${invoice.invoice}`)}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-400 hover:text-violet-400 transition"
                    >
                      <Download className="h-3 w-3" />
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DashboardCard>
      </div>
    </div>
  );
}
