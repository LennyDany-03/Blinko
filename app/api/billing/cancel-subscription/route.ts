import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/billing/auth";
import { getSupabaseService } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);

    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const adminSupabase = getSupabaseService();

    // Fetch the existing active subscription first to verify status
    const { data: subscription, error: fetchError } = await adminSupabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json(
        { success: false, message: "Failed to query subscription status." },
        { status: 500 }
      );
    }

    if (!subscription || subscription.status !== "active") {
      return NextResponse.json(
        { success: false, message: "No active subscription found to cancel." },
        { status: 400 }
      );
    }

    // Update status to 'cancelled'
    const { error: updateError } = await adminSupabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Subscription cancellation error:", updateError.message);
      return NextResponse.json(
        { success: false, message: "Failed to cancel subscription in database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription has been successfully cancelled.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
