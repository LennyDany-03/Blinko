import { NextRequest } from "next/server";
import { getSupabaseUserClient } from "@/lib/supabase";

export async function getAuthenticatedUser(request: NextRequest) {
  const supabaseClient = getSupabaseUserClient(request);
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();

  if (error || !user) {
    return { user: null, supabaseClient, error: error ?? new Error("Unauthorized") };
  }

  return { user, supabaseClient, error: null };
}
