import { NextResponse } from "next/server";
import { getSupabaseUserClient } from "../../../lib/supabase";
import { validateUrl } from "../../../lib/validation";

// GET: Fetch all social links for the authenticated user
export async function GET(request) {
  try {
    const supabaseClient = getSupabaseUserClient(request);
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { data: socials, error } = await supabaseClient
      .from("social_links")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: socials || [] });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST: Upsert a social link
export async function POST(request) {
  try {
    const supabaseClient = getSupabaseUserClient(request);
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { platform, url } = body;

    const allowedPlatforms = ["github", "linkedin", "instagram", "youtube", "twitter"];
    if (!platform || !allowedPlatforms.includes(platform.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: `Platform must be one of: ${allowedPlatforms.join(", ")}` },
        { status: 400 }
      );
    }

    const urlVal = validateUrl(url);
    if (!urlVal.isValid) {
      return NextResponse.json({ success: false, message: urlVal.message }, { status: 400 });
    }

    const socialPayload = {
      user_id: user.id,
      platform: platform.toLowerCase(),
      url: urlVal.cleanValue,
    };

    const { data: social, error } = await supabaseClient
      .from("social_links")
      .upsert(socialPayload, { onConflict: "user_id,platform" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: social });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE: Remove a social link
export async function DELETE(request) {
  try {
    const supabaseClient = getSupabaseUserClient(request);
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");

    if (!platform) {
      return NextResponse.json({ success: false, message: "Missing parameter: platform." }, { status: 400 });
    }

    const { error } = await supabaseClient
      .from("social_links")
      .delete()
      .eq("user_id", user.id)
      .eq("platform", platform.toLowerCase());

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: { platform } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
