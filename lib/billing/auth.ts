import { NextRequest } from "next/server";
import { getSupabaseUserClient } from "@/lib/supabase";
import { User, SupabaseClient } from "@supabase/supabase-js";

export async function getAuthenticatedUser(request: NextRequest): Promise<{
  user: User | null;
  supabaseClient: SupabaseClient;
  error: Error | null;
}> {
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
