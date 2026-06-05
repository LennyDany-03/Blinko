"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Link2,
  Sparkles,
  Palette,
  CreditCard,
  X,
  BarChart3,
  GitBranch,
} from "lucide-react";
import BlinkoLogo from "../BlinkoLogo";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";

export default function DashboardSidebar({ className = "", isMobile = false, onClose }) {
  const pathname = usePathname();
  const { user, profile } = useAuth();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { 
      name: "Blinko Trees", 
      href: "/dashboard/blinko-trees", 
      icon: GitBranch 
    },
  ];

  return (
    <aside
      className={[
        "flex h-full flex-col border-r border-zinc-900 bg-zinc-950 px-4 py-6 text-white",
        className,
      ].join(" ")}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-2">
        <BlinkoLogo href="/dashboard" />
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:outline-none"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="mt-8 flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={[
                "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-violet-600/15 text-violet-300 border border-violet-500/20"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent",
              ].join(" ")}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={[
                    "h-4 w-4 transition-colors duration-200",
                    isActive ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300",
                  ].join(" ")}
                  aria-hidden="true"
                />
                {item.name}
              </span>
              {item.badge && (
                <span className="rounded bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-medium text-violet-400 border border-violet-500/20">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer User Details */}
      <div className="mt-auto border-t border-zinc-900 pt-4 px-2">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          {profile?.avatar_url ? (
            <div className="relative shrink-0">
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="h-10 w-10 rounded-full object-cover shadow-md"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-500" />
            </div>
          ) : (
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-sm font-bold text-white shadow-md shadow-violet-950/20">
              {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "?")}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-emerald-500" />
            </div>
          )}

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{profile?.display_name || user?.email?.split("@")[0] || "User"}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-zinc-400 truncate">{user?.email || ""}</span>
              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-violet-300">
                Free
              </span>
            </div>
          </div>
        </div>
      </div>

    </aside>
  );
}
