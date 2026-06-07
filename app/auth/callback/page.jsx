"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function AuthCallbackPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Session successfully resolved and cookies synchronized.
        router.push("/dashboard");
      } else {
        // No session resolved (e.g. if the user was signed out by AuthContext new user interceptor).
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-transparent text-on-surface flex flex-col items-center justify-center select-none">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        <h2 className="text-xl font-bold font-display-xl text-on-surface">Completing secure authentication...</h2>
        <p className="text-xs text-on-surface-variant/80 font-body-md">Syncing session cookies to your browser.</p>
      </div>
    </div>
  );
}
