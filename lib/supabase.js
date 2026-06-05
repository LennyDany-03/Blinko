import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 1. Standard Public Client (for public reads, client-side, or unauthenticated contexts)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. Service Role Admin Client (for administrative operations like Razorpay webhooks, checking usernames)
export function getSupabaseService() {
  if (!supabaseServiceKey) {
    console.warn("Warning: SUPABASE_SERVICE_ROLE_KEY env is missing. Falling back to anon key.");
    return supabase;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// 3. User JWT Scoped Client (reads authorization header from route request parameters)
export function getSupabaseUserClient(request) {
  if (!request || typeof request.headers?.get !== "function") {
    return supabase;
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return supabase;
  }

  const token = authHeader.substring(7); // Extract raw JWT token
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
