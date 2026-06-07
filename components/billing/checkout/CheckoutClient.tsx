"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Session, User } from "@supabase/supabase-js";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { isActiveProSubscription } from "@/lib/billing/subscription";
import type { CheckoutOrderResponse, RazorpaySuccessResponse } from "@/lib/billing/types";
import Toast from "@/components/ui/Toast";
import CheckoutSkeleton from "./CheckoutSkeleton";
import CheckoutPlanDetails from "./CheckoutPlanDetails";
import CheckoutPlanComparison from "./CheckoutPlanComparison";
import CheckoutTrustIndicators from "./CheckoutTrustIndicators";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutLegalConsent, { type ConsentState } from "./CheckoutLegalConsent";
import CheckoutPaymentButton from "./CheckoutPaymentButton";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutClient() {
  const auth = useAuth() as {
    user: User | null;
    session: Session | null;
    loading: boolean;
  };
  const { user, session, loading: authLoading } = auth;
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    terms: false,
    privacy: false,
    renewal: false,
  });
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(
    null
  );

  const allConsentGiven = consent.terms && consent.privacy && consent.renewal;

  const handleConsentChange = useCallback((key: keyof ConsentState, value: boolean) => {
    setConsent((prev) => ({ ...prev, [key]: value }));
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login?next=/billing/checkout");
      return;
    }

    const checkSubscription = async () => {
      try {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("status, plan, plan_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (isActiveProSubscription(sub)) {
          router.replace("/dashboard/billing");
          return;
        }
      } catch (err) {
        console.error("Checkout subscription check error:", err);
        setToast({ message: "Unable to load subscription status.", variant: "error" });
      } finally {
        setPageLoading(false);
      }
    };

    checkSubscription();
  }, [authLoading, user, router]);

  const getAuthHeaders = useCallback((): HeadersInit => {
    const token = session?.access_token;
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }, [session?.access_token]);

  const verifyPayment = async (response: RazorpaySuccessResponse) => {
    const verifyRes = await fetch("/api/billing/verify-payment", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      }),
    });

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || !verifyData.success) {
      throw new Error(verifyData.message || "Payment verification failed.");
    }

    router.push("/billing/success");
  };

  const handlePayment = async () => {
    if (!user || !allConsentGiven || processing) return;

    setProcessing(true);
    setToast(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Unable to load payment provider. Please try again.");
      }

      const checkoutRes = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ plan: "pro" }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok || !checkoutData.success) {
        throw new Error(checkoutData.message || "Failed to create checkout session.");
      }

      const order: CheckoutOrderResponse = {
        orderId: checkoutData.orderId,
        amount: checkoutData.amount,
        currency: checkoutData.currency,
        key: checkoutData.key,
      };

      const isMock = order.key === "rzp_test_mock" || order.orderId.startsWith("order_mock_");

      if (isMock) {
        await verifyPayment({
          razorpay_order_id: order.orderId,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: "mock_signature",
        });
        return;
      }

      const displayName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Blinko User";

      const razorpay = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Blinko Pro Subscription",
        description: "Blinko Pro Subscription - ₹299/month",
        order_id: order.orderId,
        prefill: {
          name: displayName,
          email: user.email ?? undefined,
        },
        theme: {
          color: "#9f4122",
        },
        handler: async (response) => {
          try {
            setProcessing(true);
            await verifyPayment(response);
          } catch (err) {
            const message = err instanceof Error ? err.message : "Payment verification failed.";
            setToast({ message, variant: "error" });
            router.push("/billing/failed");
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        setProcessing(false);
        setToast({
          message: response.error?.description || "Payment failed. Please try again.",
          variant: "error",
        });
        router.push("/billing/failed");
      });

      razorpay.open();
      setProcessing(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setToast({ message, variant: "error" });
      setProcessing(false);
    }
  };

  if (authLoading || pageLoading) {
    return <CheckoutSkeleton />;
  }

  return (
    <>
      <div className="mb-8">
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-md px-1"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Billing
        </Link>
        <h1 className="mt-4 text-2xl font-extrabold text-on-surface sm:text-3xl">
          Blinko Pro Checkout
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Complete your upgrade to unlock premium features.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <CheckoutPlanDetails />
          <CheckoutPlanComparison />
          <CheckoutTrustIndicators />
        </div>

        <div className="lg:col-span-2">
          <CheckoutOrderSummary>
            <CheckoutLegalConsent consent={consent} onChange={handleConsentChange} />
            <CheckoutPaymentButton
              disabled={!allConsentGiven}
              loading={processing}
              onClick={handlePayment}
            />
            {!allConsentGiven && (
              <p className="text-center text-[11px] text-on-surface-variant" role="status">
                Please accept all agreements to continue.
              </p>
            )}
          </CheckoutOrderSummary>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}
    </>
  );
}
