import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(request) {
  const url = new URL(request.url);
  const isProtected =
    url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/billing");

  if (isProtected) {
    const accessToken = request.cookies.get("blinko-session-access-token")?.value;

    if (!accessToken) {
      // Missing token: redirect immediately to login
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("next", url.pathname); // Save target path
      return NextResponse.redirect(redirectUrl);
    }

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        // Fallback for unset keys in edge build
        return NextResponse.next();
      }

      // Check session validity with Supabase
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
      });

      const { data: { user }, error } = await supabase.auth.getUser(accessToken);

      if (error || !user) {
        // Expired/invalid token: clear cookies and redirect to login
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("blinko-session-access-token");
        response.cookies.delete("blinko-session-refresh-token");
        return response;
      }
    } catch (err) {
      console.error("Middleware Auth Verification Error:", err);
      // Fallback: let request pass to prevent service disruption, route will check client-side
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Optimization: Apply middleware only to protected dashboard subpaths
export const config = {
  matcher: ["/dashboard/:path*", "/billing/:path*"],
};
