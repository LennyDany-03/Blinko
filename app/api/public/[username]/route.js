import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const username = resolvedParams?.username;

    if (!username) {
      return NextResponse.json(
        { success: false, message: "Missing required parameter: username." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    // 1. Fetch profile matching username
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ success: false, message: profileError.message }, { status: 400 });
    }

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Creator profile not found." },
        { status: 404 }
      );
    }

    const userId = profile.user_id;

    // 2. Query other linked tables concurrently
    const [
      { data: theme },
      { data: links },
      { data: socials },
      { data: projects },
      { data: products }
    ] = await Promise.all([
      supabase.from("themes").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("links").select("*").eq("user_id", userId).eq("is_active", true).order("position", { ascending: true }),
      supabase.from("social_links").select("*").eq("user_id", userId),
      supabase.from("portfolio_projects").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("digital_products").select("*").eq("user_id", userId).order("created_at", { ascending: false })
    ]);

    // 3. Respond with aggregated bundle
    return NextResponse.json({
      success: true,
      data: {
        profile,
        theme: theme || {
          theme_name: "minimal",
          primary_color: "#7C3AED",
          font: "font-sans",
          button_style: "rounded-md"
        },
        links: links || [],
        socials: socials || [],
        projects: projects || [],
        products: products || []
      }
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
