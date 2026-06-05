"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Bell, Menu, ChevronDown, User, CreditCard, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const routeTitles = {
  "/dashboard": "Dashboard Overview",
  "/dashboard/profile": "Profile Settings",
  "/dashboard/links": "Manage Links",
  "/dashboard/ai-builder": "AI Page Builder",
  "/dashboard/appearance": "Design & Themes",
  "/dashboard/billing": "Billing & Subscription",
};

export default function DashboardNavbar({ onMenuClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const title = routeTitles[pathname] || "Dashboard";

  const { user, profile, signOut } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-900 bg-zinc-950/80 px-6 backdrop-blur-md">
      {/* Mobile Drawer Trigger & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:outline-none lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          {title}
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Search Input Placeholder */}
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 py-1.5 pl-9 pr-4 text-sm text-zinc-200 placeholder-zinc-500 outline-none transition duration-200 focus:border-violet-500/50 focus:bg-zinc-900/80"
          />
        </div>

        {/* Notifications Tray */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={[
              "relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:outline-none transition-colors",
              notificationsOpen ? "bg-zinc-900 text-white" : "",
            ].join(" ")}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-violet-500 shadow-md shadow-violet-500/50 animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-900 bg-zinc-950 p-4 shadow-xl shadow-black/80">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              <div className="mt-3 space-y-3">
                <div className="rounded-lg bg-zinc-900/40 p-2.5 text-xs text-zinc-400 border border-zinc-900">
                  <div className="flex justify-between font-semibold text-zinc-300">
                    <span>New Profile Visit</span>
                    <span className="text-[10px] text-zinc-500">2m ago</span>
                  </div>
                  <p className="mt-1">Someone from Google visited your link-in-bio page.</p>
                </div>
                <div className="rounded-lg bg-zinc-900/40 p-2.5 text-xs text-zinc-400 border border-zinc-900">
                  <div className="flex justify-between font-semibold text-zinc-300">
                    <span>System Alert</span>
                    <span className="text-[10px] text-zinc-500">1h ago</span>
                  </div>
                  <p className="mt-1">AI builder suggests refining your bio for a developer audience.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-zinc-900 bg-zinc-900/30 p-1.5 pr-3 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:outline-none transition-colors"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-xs font-semibold text-white flex items-center justify-center">
                {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "?")}
              </div>
            )}
            <span className="hidden text-xs font-medium text-zinc-300 md:inline">
              {profile?.display_name || user?.email?.split("@")[0] || "User"}
            </span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-900 bg-zinc-950 p-1.5 shadow-xl shadow-black/80">
              <div className="px-3 py-2 text-xs border-b border-zinc-900 mb-1">
                <p className="font-semibold text-white truncate">{profile?.display_name || user?.email?.split("@")[0] || "User"}</p>
                <p className="text-zinc-500 mt-0.5 truncate">{user?.email || ""}</p>
              </div>
              <Link
                href="/dashboard/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white"
              >
                <User className="h-3.5 w-3.5" />
                Profile Settings
              </Link>
              <Link
                href="/dashboard/billing"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-white"
              >
                <CreditCard className="h-3.5 w-3.5" />
                Billing & Plan
              </Link>
              <div className="border-t border-zinc-900 my-1" />
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  signOut();
                  router.push("/");
                }}
                className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-350 transition text-left cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
