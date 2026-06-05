import { NextResponse } from "next/server";
import { getSupabaseUserClient } from "../../../lib/supabase";
import { validateDisplayName, validateUrl } from "../../../lib/validation";

// GET: Fetch all portfolio projects for the authenticated user
export async function GET(request) {
  try {
    const supabaseClient = getSupabaseUserClient(request);
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { data: projects, error } = await supabaseClient
      .from("portfolio_projects")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: projects || [] });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST: Create or Update a portfolio project
export async function POST(request) {
  try {
    const supabaseClient = getSupabaseUserClient(request);
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, description, image_url, project_url } = body;

    // Validate inputs
    const nameVal = validateDisplayName(title);
    if (!nameVal.isValid) {
      return NextResponse.json({ success: false, message: nameVal.message }, { status: 400 });
    }

    if (description && description.length > 500) {
      return NextResponse.json({ success: false, message: "Description cannot exceed 500 characters." }, { status: 400 });
    }

    let cleanProjectUrl = "";
    if (project_url) {
      const urlVal = validateUrl(project_url);
      if (!urlVal.isValid) {
        return NextResponse.json({ success: false, message: `Project Link: ${urlVal.message}` }, { status: 400 });
      }
      cleanProjectUrl = urlVal.cleanValue;
    }

    let cleanImageUrl = "";
    if (image_url) {
      const urlVal = validateUrl(image_url);
      if (!urlVal.isValid) {
        return NextResponse.json({ success: false, message: `Image Link: ${urlVal.message}` }, { status: 400 });
      }
      cleanImageUrl = urlVal.cleanValue;
    }

    const projectPayload = {
      user_id: user.id,
      title: nameVal.cleanValue,
      description: description ? description.trim() : null,
      image_url: cleanImageUrl || null,
      project_url: cleanProjectUrl || null,
    };

    let responseData;

    if (id) {
      // Update existing project
      const { data, error } = await supabaseClient
        .from("portfolio_projects")
        .update(projectPayload)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
      }
      responseData = data;
    } else {
      // Create new project
      const { data, error } = await supabaseClient
        .from("portfolio_projects")
        .insert(projectPayload)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
      }
      responseData = data;
    }

    return NextResponse.json({ success: true, data: responseData });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// DELETE: Delete a project
export async function DELETE(request) {
  try {
    const supabaseClient = getSupabaseUserClient(request);
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing parameter: id." }, { status: 400 });
    }

    const { error } = await supabaseClient
      .from("portfolio_projects")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: { id } });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
