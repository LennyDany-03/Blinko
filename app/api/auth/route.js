import { NextResponse } from "next/server";
import { getSupabaseUserClient } from "../../../lib/supabase";

export async function GET(request) {
  try {
    const supabaseClient = getSupabaseUserClient(request);
    
    // Retrieve logged in user details using request Authorization header
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or missing session token." },
        { status: 401 }
      );
    }

    // Retrieve profile details for the user
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        profile: profile || null,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
