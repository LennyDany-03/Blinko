import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseService } from "../../../../lib/supabase";
import { activateProSubscription } from "../../../../lib/billing/subscription";

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, message: "Missing Razorpay webhook signature header." },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.RAZORPAY_KEY_SECRET;
    
    // Validate signature authenticity if secret key is present in environment configs
    if (webhookSecret && webhookSecret !== "yourRazorpayKeySecret") {
      const shasum = crypto.createHmac("sha256", webhookSecret);
      shasum.update(rawBody);
      const digest = shasum.digest("hex");

      if (digest !== signature) {
        return NextResponse.json(
          { success: false, message: "Invalid cryptographic signature verification check." },
          { status: 400 }
        );
      }
    }

    // Parse payload details
    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Check payment captures or subscription logs
    if (event === "order.paid" || event === "payment.captured") {
      const paymentEntity = payload.payload?.payment?.entity || {};
      const notes = paymentEntity.notes || {};
      const userId = notes.user_id;
      const plan = notes.plan || "Pro";

      if (userId) {
        const adminSupabase = getSupabaseService();

        const { error } = await activateProSubscription(adminSupabase, {
          userId,
          orderId: paymentEntity.order_id || `order_webhook_${Date.now()}`,
          paymentId: paymentEntity.id || `pay_webhook_${Date.now()}`,
          customerId: paymentEntity.customer_id || null,
        });

        if (error) {
          console.error("Error updating subscription table in webhook:", error.message);
          return NextResponse.json(
            { success: false, message: "Failed writing subscription updates to database." },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook event processed successfully.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
