import { NextResponse } from "next/server";
import { getSupabaseUserClient, getSupabaseService } from "../../../../lib/supabase";
import {
  validateUsername,
  validateDisplayName,
  validateBio,
  validateUrl,
} from "../../../../lib/validation";

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
    const { username, display_name, bio, avatar_url, location, website } = body;

    // Validate inputs
    const userVal = validateUsername(username);
    if (!userVal.isValid) {
      return NextResponse.json({ success: false, message: userVal.message }, { status: 400 });
    }

    const nameVal = validateDisplayName(display_name);
    if (!nameVal.isValid) {
      return NextResponse.json({ success: false, message: nameVal.message }, { status: 400 });
    }

    const bioVal = validateBio(bio);
    if (!bioVal.isValid) {
      return NextResponse.json({ success: false, message: bioVal.message }, { status: 400 });
    }

    let cleanWebsite = "";
    if (website) {
      const urlVal = validateUrl(website);
      if (!urlVal.isValid) {
        return NextResponse.json({ success: false, message: urlVal.message }, { status: 400 });
      }
      cleanWebsite = urlVal.cleanValue;
    }

    // Check if username is already taken by another user (using Service Client to bypass RLS for validation check)
    const adminSupabase = getSupabaseService();
    const { data: existingUser, error: checkError } = await adminSupabase
      .from("profiles")
      .select("user_id")
      .eq("username", userVal.cleanValue)
      .single();

    if (existingUser && existingUser.user_id !== user.id) {
      return NextResponse.json(
        { success: false, message: "Username is already taken by another creator." },
        { status: 400 }
      );
    }

    // Prepare profile payload
    const profilePayload = {
      user_id: user.id,
      username: userVal.cleanValue,
      display_name: nameVal.cleanValue,
      bio: bioVal.cleanValue,
      avatar_url: avatar_url || null,
      location: location ? location.trim() : null,
      website: cleanWebsite || null,
    };

    // Upsert profile record
    const { data: updatedProfile, error: upsertError } = await supabaseClient
      .from("profiles")
      .upsert(profilePayload, { onConflict: "user_id" })
      .select()
      .single();

    if (upsertError) {
      return NextResponse.json(
        { success: false, message: upsertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
