import { NextResponse } from "next/server";
import { getSupabaseUserClient } from "../../../lib/supabase";

export async function GET(request) {
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

    // Query profiles table for matching user_id
    const { data: profile, error } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 means no rows found
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile || null,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
