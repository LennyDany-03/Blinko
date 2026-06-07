import { NextResponse } from "next/server";
import { getSupabaseUserClient, getSupabaseService } from "../../../lib/supabase";

// GET: Fetch analytics logs for the owner's dashboard
export async function GET(request) {
  try {
    const supabaseClient = getSupabaseUserClient(request);
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    // Retrieve last 30 days of analytics rows
    const { data: logs, error } = await supabaseClient
      .from("analytics")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true })
      .limit(30);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: logs || [] });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST: Public increment trigger for page views or link clicks
export async function POST(request) {
  try {
    const body = await request.json();
    const { action_type, target_user_id } = body; // action_type: 'view' or 'click'

    if (!target_user_id) {
      return NextResponse.json({ success: false, message: "Missing target_user_id." }, { status: 400 });
    }

    if (action_type !== "view" && action_type !== "click") {
      return NextResponse.json({ success: false, message: "Invalid action_type. Must be 'view' or 'click'." }, { status: 400 });
    }

    const adminSupabase = getSupabaseService();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Fetch existing log for today
    const { data: records, error: fetchError } = await adminSupabase
      .from("analytics")
      .select("id, page_views, link_clicks")
      .eq("user_id", target_user_id)
      .eq("date", today)
      .limit(1);

    if (fetchError) {
      return NextResponse.json({ success: false, message: fetchError.message }, { status: 400 });
    }

    const record = records && records.length > 0 ? records[0] : null;

    if (record) {
      // Record exists: Increment count
      const updatePayload = action_type === "view"
        ? { page_views: record.page_views + 1 }
        : { link_clicks: record.link_clicks + 1 };

      const { error: updateError } = await adminSupabase
        .from("analytics")
        .update(updatePayload)
        .eq("id", record.id);

      if (updateError) {
        return NextResponse.json({ success: false, message: updateError.message }, { status: 400 });
      }
    } else {
      // No record yet today: Insert default values
      const insertPayload = action_type === "view"
        ? { user_id: target_user_id, date: today, page_views: 1, link_clicks: 0 }
        : { user_id: target_user_id, date: today, page_views: 0, link_clicks: 1 };

      const { error: insertError } = await adminSupabase
        .from("analytics")
        .insert(insertPayload);

      if (insertError) {
        return NextResponse.json({ success: false, message: insertError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, message: `Successfully registered ${action_type} event.` });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
