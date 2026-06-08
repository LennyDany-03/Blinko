"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, AlertTriangle, Loader2 } from "lucide-react";
import type { Session, User } from "@supabase/supabase-js";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { PRO_PLAN, PRO_FEATURES } from "@/lib/billing/constants";
import Toast from "@/components/ui/Toast";

export default function ManageSubscriptionClient() {
  const auth = useAuth() as {
    user: User | null;
    session: Session | null;
    loading: boolean;
  };
  const { user, session, loading: authLoading } = auth;
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(
    null
  );

  const getAuthHeaders = useCallback((): HeadersInit => {
    const token = session?.access_token;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, [session?.access_token]);

  const fetchSubscription = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (err) {
      console.error("Error fetching subscription details:", err);
      setToast({ message: "Unable to load subscription details.", variant: "error" });
    } finally {
      setPageLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login?next=/billing/manage");
      return;
    }

    fetchSubscription();
  }, [authLoading, user, router, fetchSubscription]);

  const handleCancelSubscription = async () => {
    setProcessing(true);
    setToast(null);
    setShowConfirmModal(false);

    try {
      const response = await fetch("/api/billing/cancel-subscription", {
        method: "POST",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to cancel subscription.");
      }

      setToast({
        message: "Your subscription has been successfully cancelled.",
        variant: "success",
      });
      
      // Refresh the page data
      await fetchSubscription();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setToast({ message, variant: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading || pageLoading) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse space-y-6" aria-busy="true">
        <div className="h-6 w-32 rounded bg-black/5" />
        <div className="h-8 w-64 rounded bg-black/5" />
        <div className="rounded-2xl border border-white/60 bg-white/40 p-6 shadow-sm">
          <div className="h-6 w-40 rounded bg-black/5 mb-6" />
          <div className="space-y-4">
            <div className="h-4 w-full rounded bg-black/5" />
            <div className="h-4 w-3/4 rounded bg-black/5" />
            <div className="h-4 w-1/2 rounded bg-black/5" />
          </div>
        </div>
      </div>
    );
  }

  const subscriptionId =
    subscription?.razorpay_payment_id ||
    subscription?.razorpay_order_id ||
    subscription?.razorpay_subscription_id ||
    null;

  const isActive = subscription?.status === "active";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-md px-1"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Billing
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-on-surface sm:text-3xl">
          Manage Pro Subscription
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          View details and make changes to your Blinko Pro plan.
        </p>
      </div>

      <div className="space-y-6">
        {/* Main subscription card */}
        <section
          className="rounded-2xl border border-white/60 bg-white/50 p-6 shadow-sm backdrop-blur-md relative overflow-hidden"
          aria-labelledby="subscription-details-heading"
        >
          <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/5 pb-4">
            <div>
              <h2 id="subscription-details-heading" className="text-xl font-bold text-on-surface">
                {PRO_PLAN.name}
              </h2>
              <p className="text-xs text-on-surface-variant">
                {PRO_PLAN.recurringDisplay} ({PRO_PLAN.billingCycle} billing)
              </p>
            </div>
            <div>
              {isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Cancelled
                </span>
              )}
            </div>
          </div>

          <dl className="mt-6 grid gap-y-4 gap-x-6 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-on-surface-variant">Cost</dt>
              <dd className="mt-0.5 font-semibold text-on-surface">{PRO_PLAN.priceDisplay} / month</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Start Date</dt>
              <dd className="mt-0.5 font-semibold text-on-surface">
                {formatDate(subscription?.subscription_started_at || subscription?.created_at)}
              </dd>
            </div>
            {isActive ? (
              <div>
                <dt className="text-on-surface-variant">Next Renewal</dt>
                <dd className="mt-0.5 font-semibold text-on-surface">
                  {formatDate(subscription?.current_period_end)}
                </dd>
              </div>
            ) : (
              <div>
                <dt className="text-on-surface-variant">Access Ends</dt>
                <dd className="mt-0.5 font-semibold text-rose-600">
                  Expired
                </dd>
              </div>
            )}
            {subscriptionId && (
              <div className="sm:col-span-2">
                <dt className="text-on-surface-variant">Subscription Reference ID</dt>
                <dd className="mt-0.5 font-mono text-xs font-semibold text-on-surface break-all bg-black/5 rounded-md p-2">
                  {subscriptionId}
                </dd>
              </div>
            )}
          </dl>

          {isActive && (
            <div className="mt-8 border-t border-black/5 pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={processing}
                className="rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300 text-rose-600 hover:text-rose-700 px-4 py-2.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-rose-500/30 flex items-center justify-center gap-1.5"
              >
                {processing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                Cancel Subscription
              </button>
            </div>
          )}
        </section>

        {/* Plan Features List */}
        <section
          className="rounded-2xl border border-white/60 bg-white/50 p-6 shadow-sm backdrop-blur-md"
          aria-labelledby="plan-features-heading"
        >
          <h2 id="plan-features-heading" className="text-base font-bold text-on-surface">
            Included in Blinko Pro
          </h2>
          <p className="mt-1 text-xs text-on-surface-variant">
            Here are the premium benefits you currently have access to:
          </p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2" role="list">
            {PRO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-on-surface-variant">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl border border-white/80 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 id="modal-title" className="text-lg font-bold text-on-surface">
                Cancel Blinko Pro?
              </h3>
            </div>

            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              Are you sure you want to cancel your Blinko Pro subscription? You will lose access to unlimited links, custom domains, premium themes, and analytics immediately.
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-xl border border-black/5 bg-black/5 hover:bg-black/10 px-4 py-2.5 text-xs font-bold text-on-surface-variant transition focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                No, Keep Pro
              </button>
              <button
                type="button"
                onClick={handleCancelSubscription}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-xs font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-rose-500/40 shadow-sm"
              >
                Yes, Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
