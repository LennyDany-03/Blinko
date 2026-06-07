"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  profile: null,
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Sync access & refresh tokens to client cookies for Next.js middleware protection
  const syncSessionCookies = (currentSession) => {
    if (currentSession) {
      const maxAge = 60 * 60 * 24 * 7; // 7 days expiration
      document.cookie = `blinko-session-access-token=${currentSession.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
      document.cookie = `blinko-session-refresh-token=${currentSession.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
    } else {
      document.cookie = `blinko-session-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `blinko-session-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  };

  // Google/OAuth Auto Profile Creator checking logic
  const ensureProfileExists = async (authUser) => {
    if (!authUser) return null;

    try {
      // 1. Query profiles table
      const { data: existingProfiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: true })
        .limit(1);

      if (error) {
        console.error("Error reading profile details in AuthContext:", error.message);
        return null;
      }

      if (existingProfiles && existingProfiles.length > 0) {
        const firstProfile = existingProfiles[0];
        setProfile(firstProfile);
        if (typeof window !== "undefined") {
          localStorage.removeItem("blinko_auth_mode");
        }
        return firstProfile;
      }

      // 2. If no profile exists, we do not auto-create one here anymore.
      // In V2, profiles require a tree_id and are created during onboarding setup wizard.
      setProfile(null);

      // Check if they initiated from login but are actually a new user
      if (typeof window !== "undefined") {
        const authMode = localStorage.getItem("blinko_auth_mode");
        if (authMode === "login") {
          const createdAt = new Date(authUser.created_at).getTime();
          
          // If the account was created less than 2 minutes ago relative to now, it is a brand new account.
          // This avoids issues where last_sign_in_at is null or identical to created_at for older users who haven't signed in recently.
          const isBrandNewAccount = Math.abs(Date.now() - createdAt) < 120000;
          
          if (isBrandNewAccount) {
            localStorage.removeItem("blinko_auth_mode");
            // Clear session cookies and log out
            document.cookie = `blinko-session-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            document.cookie = `blinko-session-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
            await supabase.auth.signOut();
            window.location.href = "/login?new_user=true";
            return null;
          } else {
            // It's an existing auth user who hasn't completed onboarding/setup yet.
            // Let them pass to `/dashboard` so they can complete setup.
            localStorage.removeItem("blinko_auth_mode");
          }
        } else if (authMode === "signup") {
          localStorage.removeItem("blinko_auth_mode");
        }
      }

      return null;
    } catch (err) {
      console.error("Failed to run profile existence check:", err);
      return null;
    }
  };

  useEffect(() => {
    // Fetch initial active session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      syncSessionCookies(initialSession);
      
      if (initialSession?.user) {
        ensureProfileExists(initialSession.user);
      }
      setLoading(false);
    });

    // Listen for authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      syncSessionCookies(currentSession);

      if (currentSession?.user) {
        ensureProfileExists(currentSession.user);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    syncSessionCookies(null);
    setUser(null);
    setSession(null);
    setProfile(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, profile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
