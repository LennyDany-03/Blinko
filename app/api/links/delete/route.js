import { NextResponse } from "next/server";
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
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing required parameter: id." },
        { status: 400 }
      );
    }

    // Execute deletion mapping
    const { error } = await supabaseClient
      .from("links")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
