import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getSupabaseUserClient } from "../../../../lib/supabase";

export async function POST(request) {
  try {
    const supabaseClient = getSupabaseUserClient(request);
    
    // Retrieve logged in user credentials
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan } = body; // Pro, etc.

    if (plan !== "Pro") {
      return NextResponse.json(
        { success: false, message: "Invalid plan type. Blinko supports Pro upgrades." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Fallback Mock Order if credentials are not specified
    if (!keyId || !keySecret || keyId === "rzp_test_yourKeyId" || keySecret === "yourRazorpayKeySecret") {
      console.warn("Using simulated order flow because Razorpay keys are not configured in environment variables.");
      return NextResponse.json({
        success: true,
        data: {
          id: `order_mock_${Date.now()}`,
          entity: "order",
          amount: 500,
          currency: "USD",
          status: "created",
          receipt: `receipt_mock_${Date.now()}`,
          notes: {
            user_id: user.id,
            plan: "Pro",
          },
        },
      });
    }

    // Initialize Razorpay Client
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Create payment session order
    const orderOptions = {
      amount: 500, // $5.00 represented as 500 cents
      currency: "USD",
      receipt: `receipt_${user.id.substring(0, 8)}_${Date.now()}`,
      notes: {
        user_id: user.id,
        plan: "Pro",
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
