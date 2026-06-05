import { NextResponse } from "next/server";
import { getSupabaseUserClient } from "../../../lib/supabase";

// GET: Retrieve the visual theme for the authenticated user
export async function GET(request) {
  try {
    const supabaseClient = getSupabaseUserClient(request);
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { data: theme, error } = await supabaseClient
      .from("themes")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: theme || null });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST: Upsert the visual theme specifications
export async function POST(request) {
  try {
    const supabaseClient = getSupabaseUserClient(request);
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { theme_name, primary_color, font, button_style } = body;

    const allowedThemes = ["minimal", "creator", "developer", "artist", "startup", "dark-pro"];
    if (!theme_name || !allowedThemes.includes(theme_name.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: `Theme name must be one of: ${allowedThemes.join(", ")}` },
        { status: 400 }
      );
    }

    const themePayload = {
      user_id: user.id,
      theme_name: theme_name.toLowerCase(),
      primary_color: primary_color || "#7C3AED",
      font: font || "font-sans",
      button_style: button_style || "rounded-md",
    };

    const { data: theme, error } = await supabaseClient
      .from("themes")
      .upsert(themePayload, { onConflict: "user_id" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: theme });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
