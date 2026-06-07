import { NextRequest, NextResponse } from "next/server";
import { PRO_PLAN } from "@/lib/billing/constants";
import { getAuthenticatedUser } from "@/lib/billing/auth";
import { isActiveProSubscription } from "@/lib/billing/subscription";
import {
  createMockOrderId,
  createRazorpayClient,
  getRazorpayCredentials,
} from "@/lib/billing/razorpay-server";

export async function POST(request: NextRequest) {
  try {
    const { user, supabaseClient, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { data: existingSub } = await supabaseClient
      .from("subscriptions")
      .select("status, plan, plan_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (isActiveProSubscription(existingSub)) {
      return NextResponse.json(
        { success: false, message: "You already have an active Blinko Pro subscription." },
        { status: 400 }
      );
    }

    const { keyId, isConfigured } = getRazorpayCredentials();

    if (!isConfigured || !keyId) {
      console.warn("Using simulated checkout because Razorpay keys are not configured.");
      return NextResponse.json({
        success: true,
        orderId: createMockOrderId(),
        amount: PRO_PLAN.priceCents,
        currency: PRO_PLAN.currency,
        key: "rzp_test_mock",
      });
    }

    const razorpay = createRazorpayClient();
    if (!razorpay) {
      return NextResponse.json(
        { success: false, message: "Payment provider is not configured." },
        { status: 500 }
      );
    }

    const order = await razorpay.orders.create({
      amount: PRO_PLAN.priceCents,
      currency: PRO_PLAN.currency,
      receipt: `receipt_${user.id.substring(0, 8)}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan: "pro",
        plan_id: PRO_PLAN.id,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
