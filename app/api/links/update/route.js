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
    const { id, title, url, icon, position, is_active } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing required parameter: id." },
        { status: 400 }
      );
    }

    // Read current link to validate ownership/existence
    const { data: currentLink, error: fetchError } = await supabaseClient
      .from("links")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !currentLink) {
      return NextResponse.json(
        { success: false, message: "Link not found or permission denied." },
        { status: 404 }
      );
    }

    // Build update object
    const updatePayload = {};
    
    if (title !== undefined || url !== undefined) {
      const targetTitle = title !== undefined ? title : currentLink.title;
      const targetUrl = url !== undefined ? url : currentLink.url;
      
      const validation = validateLink(targetTitle, targetUrl);
      if (!validation.isValid) {
        return NextResponse.json({ success: false, message: validation.message }, { status: 400 });
      }
      
      updatePayload.title = validation.cleanTitle;
      updatePayload.url = validation.cleanUrl;
    }

    if (icon !== undefined) updatePayload.icon = icon;
    if (position !== undefined) updatePayload.position = typeof position === "number" ? position : currentLink.position;
    if (is_active !== undefined) updatePayload.is_active = !!is_active;

    // Execute update
    const { data: updatedLink, error: updateError } = await supabaseClient
      .from("links")
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, message: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedLink,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
