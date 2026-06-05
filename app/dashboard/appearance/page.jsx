"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AppearanceRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/tree?tab=design");
  }, [router]);

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-violet-500 mx-auto" />
        <p className="text-sm text-zinc-400">Redirecting to Blinko Tree workspace...</p>
      </div>
    </div>
  );
}
