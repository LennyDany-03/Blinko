"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2, Sparkles, CreditCard, Check, TrendingUp, Lock,
  ArrowUpRight, Shield, Download, Loader2
} from "lucide-react";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/Button";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

export default function BillingPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Loading & Upgrading state
  const [loading, setLoading] = useState(true);
  const [upgraded, setUpgraded] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Stats & subscription state
  const [planName, setPlanName] = useState("Free");
  const [usage, setUsage] = useState({
    pagesCount: 0,
    viewsCount: 0,
    linksCount: 0,
  });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchBillingData = async () => {
      try {
        setLoading(true);

        // 1. Fetch user's tree
        const { data: tree } = await supabase
          .from("trees")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        const pagesCount = tree ? 1 : 0;

        // 2. Fetch views count
        let viewsCount = 0;
        let linksCount = 0;

        if (tree) {
          const { data: analytics } = await supabase
            .from("analytics")
            .select("views")
            .eq("tree_id", tree.id)
            .maybeSingle();

          viewsCount = analytics?.views || 0;

          const { count } = await supabase
            .from("links")
            .select("id", { count: "exact", head: true })
            .eq("tree_id", tree.id);

          linksCount = count || 0;
        }

        setUsage({
          pagesCount,
          viewsCount,
          linksCount,
        });

        // 3. Fetch Subscription status
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (sub && sub.status === "active") {
          setPlanName("Pro");
        } else {
          setPlanName("Free");
        }

        // Generate Invoice history
        if (sub && sub.status === "active") {
          setHistory([
            {
              id: "inv-initial",
              date: new Date(sub.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              amount: "$5.00",
              status: "Paid",
              invoice: "INV-2026-001",
            }
          ]);
        } else {
          setHistory([]);
        }

      } catch (err) {
        console.error("Fetch Billing Data Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [user]);

  // Simulate upgrade to Pro in DB
  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      // Insert active record in subscriptions to verify Pro status
      const payload = {
        user_id: user.id,
        status: "active",
        plan_id: "pro_monthly",
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from("subscriptions")
        .upsert(payload, { onConflict: "user_id" });

      if (error) throw error;

      setPlanName("Pro");
      setUpgraded(true);
      setHistory([
        {
          id: `inv-${Date.now()}`,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          amount: "$5.00",
          status: "Paid",
          invoice: "INV-2026-002",
        }
      ]);
      setTimeout(() => setUpgraded(false), 3000);
    } catch (err) {
      console.error("Upgrade Subscription Error:", err);
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500 mx-auto" />
          <p className="text-sm text-zinc-400">Loading subscription billing records...</p>
        </div>
      </div>
    );
  }

  // Calculate percentage usage
  const pagesLimit = planName === "Pro" ? "unlimited" : 1;
  const viewsLimit = planName === "Pro" ? "unlimited" : 5000;
  const linksLimit = planName === "Pro" ? "unlimited" : 5;

  const pagesPercent = planName === "Pro" ? 100 : Math.min(100, (usage.pagesCount / 1) * 100);
  const viewsPercent = planName === "Pro" ? 100 : Math.min(100, (usage.viewsCount / 5000) * 100);
  const linksPercent = planName === "Pro" ? 100 : Math.min(100, (usage.linksCount / 5) * 100);

  const metrics = [
    { name: "Pages Created", current: usage.pagesCount, limit: planName === "Pro" ? "∞" : "1", percent: pagesPercent },
    { name: "Monthly Views", current: usage.viewsCount, limit: planName === "Pro" ? "∞" : "5,000", percent: viewsPercent },
    { name: "Links Used", current: usage.linksCount, limit: planName === "Pro" ? "∞" : "5", percent: linksPercent },
  ];

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
                Billing Cycle
              </span>
            </div>
            
            <div className="space-y-5">
              {metrics.map((metric) => (
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
                      className={`h-full rounded-full transition-all duration-500 ${
                        planName === "Pro"
                          ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          : metric.percent > 75
                          ? "bg-rose-500"
                          : "bg-violet-500"
                      }`}
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
              {planName}
              {planName === "Pro" ? (
                <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-xs text-violet-300 font-semibold uppercase tracking-wider">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">
                  Basic
                </span>
              )}
            </h4>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              {planName === "Pro"
                ? "You have unlocked complete access to advanced themes, domain bindings, and AI creators."
                : "Ideal for basic link sharing. Upgrade to remove branding and unlock SEO controls."}
            </p>
          </div>

          <div className="mt-8">
            {planName === "Free" ? (
              <Button variant="primary" className="w-full text-xs font-bold" onClick={handleUpgrade} disabled={upgrading}>
                {upgrading ? "Processing..." : "Upgrade to Pro ($5/mo)"}
              </Button>
            ) : (
              <Button variant="secondary" className="w-full text-xs font-bold text-zinc-350" disabled>
                Manage Subscription
              </Button>
            )}
          </div>
        </DashboardCard>
      </div>

      {/* Pricing Comparison Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-white">Compare Plans</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free Card */}
          <DashboardCard className="relative flex flex-col justify-between border border-zinc-900 p-6">
            <div>
              <h4 className="text-base font-semibold text-white">Free Basic</h4>
              <p className="text-xs text-zinc-500 mt-1.5">Ideal for basic social profiles or simple directories.</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">$0</span>
                <span className="text-xs text-zinc-500">/forever</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex gap-2 text-xs text-zinc-400">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Up to 5 live links</span>
                </li>
                <li className="flex gap-2 text-xs text-zinc-400">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Standard Theme designs</span>
                </li>
                <li className="flex gap-2 text-xs text-zinc-400">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Basic performance metrics</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              <button disabled className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2.5 text-xs font-semibold text-zinc-500 cursor-not-allowed text-center">
                {planName === "Free" ? "Your Current Plan" : "Basic Tier"}
              </button>
            </div>
          </DashboardCard>

          {/* Pro Card */}
          <DashboardCard className={`relative flex flex-col justify-between border p-6 ${planName === "Free" ? "border-violet-500/50 bg-violet-650/[0.03]" : "border-zinc-900"}`}>
            <div>
              <div className="flex justify-between items-start">
                <h4 className="text-base font-semibold text-white">Blinko Pro</h4>
                <span className="rounded bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] text-violet-400 font-semibold uppercase tracking-wider">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1.5">Unlocks complete styling customization and analytics views.</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">$5</span>
                <span className="text-xs text-zinc-500">/monthly</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex gap-2 text-xs text-zinc-400">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Unlimited Link additions</span>
                </li>
                <li className="flex gap-2 text-xs text-zinc-400">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Premium themes (Neon, Cyberpunk, Glassmorphism)</span>
                </li>
                <li className="flex gap-2 text-xs text-zinc-400">
                  <Check className="h-4 w-4 text-violet-400 shrink-0" />
                  <span>Full click CTR dashboard analytics</span>
                </li>
              </ul>
            </div>
            <div className="mt-8">
              {planName === "Pro" ? (
                <button disabled className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 py-2.5 text-xs font-semibold text-zinc-500 cursor-not-allowed text-center">
                  Your Current Plan
                </button>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 py-2.5 text-xs font-bold text-white hover:from-violet-500 hover:to-fuchsia-400 transition cursor-pointer text-center"
                >
                  {upgrading ? "Processing..." : "Upgrade to Pro"}
                </button>
              )}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* Payment History Ledger */}
      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-violet-400" />
            <h3 className="text-base font-semibold text-white">Payment History</h3>
          </div>

          <DashboardCard className="overflow-x-auto p-0 border-zinc-900">
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
                {history.map((invoice) => (
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
                        onClick={() => alert(`Success: Initiated invoice receipt download`)}
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
      )}
    </div>
  );
}
