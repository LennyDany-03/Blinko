import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/billing/auth";
import { activateProSubscription, isActiveProSubscription } from "@/lib/billing/subscription";
import {
  createMockPaymentId,
  getRazorpayCredentials,
  verifyPaymentSignature,
} from "@/lib/billing/razorpay-server";
import { getSupabaseService } from "@/lib/supabase";
import type { VerifyPaymentRequest } from "@/lib/billing/types";

export async function POST(request: NextRequest) {
  try {
    const { user, supabaseClient, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as VerifyPaymentRequest;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment verification fields." },
        { status: 400 }
      );
    }

    const { data: existingSub } = await supabaseClient
      .from("subscriptions")
      .select("status, plan, plan_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (isActiveProSubscription(existingSub)) {
      return NextResponse.json({
        success: true,
        message: "Subscription already active.",
        alreadyActive: true,
      });
    }

    const { isConfigured } = getRazorpayCredentials();
    let paymentId = razorpay_payment_id;

    if (!isConfigured && razorpay_order_id.startsWith("order_mock_")) {
      paymentId = createMockPaymentId();
    } else {
      const isValid = verifyPaymentSignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      if (!isValid) {
        return NextResponse.json(
          { success: false, message: "Payment signature verification failed." },
          { status: 400 }
        );
      }
    }

    const adminSupabase = getSupabaseService();
    const { error: upsertError } = await activateProSubscription(adminSupabase, {
      userId: user.id,
      orderId: razorpay_order_id,
      paymentId,
    });

    if (upsertError) {
      console.error("Subscription activation error:", upsertError.message);
      return NextResponse.json(
        { success: false, message: "Failed to activate subscription." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and subscription activated.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
