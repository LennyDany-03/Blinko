import { NextResponse } from "next/server";
import { getSupabaseUserClient } from "../../../../lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing required parameter: prompt." },
        { status: 400 }
      );
    }

    // Determine mock suggestion values based on prompt keywords
    const lowerPrompt = prompt.toLowerCase();
    let sections = ["Resume", "Portfolio", "Contact"];
    let theme = "Developer";
    
    if (lowerPrompt.includes("design") || lowerPrompt.includes("art")) {
      sections = ["Gallery", "Services", "Socials", "Inquiry"];
      theme = "Minimal";
    } else if (lowerPrompt.includes("video") || lowerPrompt.includes("youtube") || lowerPrompt.includes("creator")) {
      sections = ["Latest Video", "Collabs", "Merch Store", "Community Links"];
      theme = "Creator";
    }

    const mockLayoutResponse = {
      sections,
      theme,
    };

    // If an authorization token is present, record the generation in the ai_generations table
    const supabaseClient = getSupabaseUserClient(request);
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (user) {
      const generationPayload = {
        user_id: user.id,
        prompt: prompt.trim(),
        generated_layout: mockLayoutResponse,
        theme_suggestion: theme,
      };

      // RLS allows authenticated users to insert
      await supabaseClient.from("ai_generations").insert(generationPayload);
    }

    return NextResponse.json({
      success: true,
      data: mockLayoutResponse,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message || "Internal server error." },
      { status: 500 }
    );
  }
}
