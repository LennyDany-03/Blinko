import { NextResponse } from "next/server";
import { getSupabaseUserClient } from "../../../../lib/supabase";
import { validateLink } from "../../../../lib/validation";

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
    const { title, url, icon, position, is_active } = body;

    // Validate link parameters
    const validation = validateLink(title, url);
    if (!validation.isValid) {
      return NextResponse.json({ success: false, message: validation.message }, { status: 400 });
    }

    // Insert payload
    const linkPayload = {
      user_id: user.id,
      title: validation.cleanTitle,
      url: validation.cleanUrl,
      icon: icon || null,
      position: typeof position === "number" ? position : 0,
      is_active: is_active !== false,
      click_count: 0,
    };

    const { data: newLink, error } = await supabaseClient
      .from("links")
      .insert(linkPayload)
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
      data: newLink,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
