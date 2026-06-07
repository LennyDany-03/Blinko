import type { SupabaseClient } from "@supabase/supabase-js";
import type { SubscriptionRecord } from "./types";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function isActiveProSubscription(
  sub: Pick<SubscriptionRecord, "status" | "plan" | "plan_id"> | null | undefined
): boolean {
  if (!sub || sub.status !== "active") return false;
  const plan = (sub.plan ?? "").toLowerCase();
  const planId = (sub.plan_id ?? "").toLowerCase();
  return plan === "pro" || planId === "pro_monthly" || planId.includes("pro");
}

export function buildProSubscriptionPayload({
  userId,
  orderId,
  paymentId,
  customerId,
}: {
  userId: string;
  orderId: string;
  paymentId: string;
  customerId?: string | null;
}): SubscriptionRecord {
  const now = new Date();
  const periodEnd = new Date(now.getTime() + THIRTY_DAYS_MS);

  return {
    user_id: userId,
    status: "active",
    plan: "pro",
    plan_id: "pro_monthly",
    subscription_started_at: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_customer_id: customerId ?? null,
    razorpay_subscription_id: orderId,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  };
}

export async function activateProSubscription(
  adminSupabase: SupabaseClient,
  params: {
    userId: string;
    orderId: string;
    paymentId: string;
    customerId?: string | null;
  }
) {
  const payload = buildProSubscriptionPayload(params);

  return adminSupabase
    .from("subscriptions")
    .upsert(payload, { onConflict: "user_id" });
}
