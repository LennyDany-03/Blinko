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
      const { data: existingProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (error) {
        console.error("Error reading profile details in AuthContext:", error.message);
        return null;
      }

      if (existingProfile) {
        setProfile(existingProfile);
        return existingProfile;
      }

      // 2. If profile is missing, initiate auto-creation
      const displayName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || "Blinko Creator";
      const avatarUrl = authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null;
      const email = authUser.email || "";

      // Formulate default username prefix from email handle
      let baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
      if (baseUsername.length < 3) baseUsername = "creator";
      if (baseUsername.length > 12) baseUsername = baseUsername.slice(0, 12);

      let finalUsername = baseUsername;
      let isUnique = false;
      let attempts = 0;

      // Loop checks username uniqueness up to 5 times
      while (!isUnique && attempts < 5) {
        const { count, error: countError } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("username", finalUsername);

        if (countError) {
          console.error("Error checking username uniqueness:", countError.message);
          break;
        }

        if (count === 0) {
          isUnique = true;
        } else {
          // Append random 2-digit number
          const randomSuffix = Math.floor(Math.random() * 90) + 10;
          finalUsername = `${baseUsername}${randomSuffix}`;
          attempts++;
        }
      }

      // 3. Write profile record
      const newProfile = {
        user_id: authUser.id,
        username: finalUsername,
        display_name: displayName,
        avatar_url: avatarUrl,
        is_verified: false,
      };

      const { data: insertedProfile, error: insertError } = await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single();

      if (insertError) {
        console.error("Error writing auto-created profile details:", insertError.message);
        return null;
      } else {
        console.log(`Auto-created profile successfully for username: @${finalUsername}`);
        setProfile(insertedProfile);
        return insertedProfile;
      }
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
