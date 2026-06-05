import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { validateContactMessage } from "../../../lib/validation";

export async function POST(request) {
  try {
    const body = await request.json();
    const { target_user_id, sender_name, sender_email, message } = body;

    if (!target_user_id) {
      return NextResponse.json(
        { success: false, message: "Missing required parameter: target_user_id." },
        { status: 400 }
      );
    }

    // Validate email, name, and message format constraints
    const validation = validateContactMessage(sender_name, sender_email, message);
    if (!validation.isValid) {
      return NextResponse.json({ success: false, message: validation.message }, { status: 400 });
    }

    // Prepare insert query
    const messagePayload = {
      user_id: target_user_id,
      sender_name: validation.cleanName,
      sender_email: validation.cleanEmail,
      message: validation.cleanMessage,
    };

    const { data: newMsg, error } = await supabase
      .from("contact_messages")
      .insert(messagePayload)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newMsg,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
