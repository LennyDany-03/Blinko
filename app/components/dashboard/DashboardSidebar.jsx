"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  CreditCard,
  GitBranch,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  ChevronRight,
  Crown
} from "lucide-react";
import BlinkoLogo from "../BlinkoLogo";
import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const isCollapsed = !isHovered && !dropdownOpen;

  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", "80px");
  }, []);

  // Close drop-up on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch subscription tier
  useEffect(() => {
    let active = true;
    async function checkSubscription() {
      if (!user) return;
      try {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (active) {
          setIsPro(sub?.status === "active");
        }
      } catch (err) {
        console.error("Error loading subscription in sidebar:", err);
      }
    }
    checkSubscription();
    return () => {
      active = false;
    };
  }, [user]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Blinko Trees", href: "/dashboard/blinko-trees", icon: GitBranch },
  ];

  const resolvedAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || profile?.avatar_url;
  const resolvedDisplayName = user?.user_metadata?.full_name || profile?.display_name || user?.email?.split("@")[0] || "User";

  const renderNavLinks = (compact, onClose) => {
    return (
      <nav className="space-y-1.5 flex-1 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={[
                "group flex items-center rounded-xl transition-all duration-300 scale-98 active:scale-95 border cursor-pointer w-full overflow-hidden text-xs font-bold",
                isActive
                  ? "bg-primary/10 text-primary border-primary/15 shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-black/5 border-transparent",
                compact ? "px-3 py-3 justify-center" : "px-4 py-3 justify-between"
              ].join(" ")}
              title={compact ? item.name : undefined}
            >
              <div className="flex items-center min-w-0">
                <Icon
                  className={[
                    "h-4 w-4 transition-colors duration-300 shrink-0",
                    isActive ? "text-primary" : "text-on-surface-variant/70 group-hover:text-primary",
                  ].join(" ")}
                />
                <span
                  className={[
                    "transition-all duration-300 truncate",
                    compact ? "max-w-0 opacity-0 pointer-events-none ml-0" : "max-w-40 opacity-100 ml-3"
                  ].join(" ")}
                >
                  {item.name}
                </span>
              </div>
              <ChevronRight
                className={[
                  "h-3.5 w-3.5 transition-all duration-300 shrink-0",
                  compact ? "max-w-0 opacity-0 scale-0 ml-0" : "group-hover:opacity-100 opacity-0 ml-2",
                  isActive ? "text-primary/70 translate-x-0.5 opacity-50" : "text-on-surface-variant/40",
                ].join(" ")}
              />
            </Link>
          );
        })}
      </nav>
    );
  };

  const renderUserCard = (compact) => {
    return (
      <div className="relative mt-auto border-t border-black/5 pt-4 px-1 w-full" ref={dropdownRef}>
        {/* Drop-up Menu */}
        {dropdownOpen && (
          <div className={[
            "absolute bottom-16 w-52 rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] z-50 animate-in fade-in slide-in-from-bottom-2 duration-200",
            compact ? "left-0" : "left-0 right-0 w-full"
          ].join(" ")}>
            <div className="px-3 py-2 text-xs border-b border-black/5 mb-1">
              <p className="font-bold text-on-surface truncate">{resolvedDisplayName}</p>
              <p className="text-on-surface-variant mt-0.5 truncate text-[10px]">{user?.email || ""}</p>
            </div>
            
            <Link
              href="/dashboard/profile"
              onClick={() => {
                setDropdownOpen(false);
                setMobileOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-on-surface-variant hover:bg-black/5 hover:text-primary transition-colors duration-200 font-bold"
            >
              <User className="h-3.5 w-3.5" />
              Profile Settings
            </Link>
            
            <Link
              href="/dashboard/billing"
              onClick={() => {
                setDropdownOpen(false);
                setMobileOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-on-surface-variant hover:bg-black/5 hover:text-primary transition-colors duration-200 font-bold"
            >
              <CreditCard className="h-3.5 w-3.5" />
              Billing & Plan
            </Link>

            <div className="border-t border-black/5 my-1" />
            
            <button
              onClick={() => {
                setDropdownOpen(false);
                setMobileOpen(false);
                signOut();
                router.push("/");
              }}
              className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-colors text-left cursor-pointer duration-200 font-bold"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log Out
            </button>
          </div>
        )}

        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={[
            "w-full flex items-center rounded-2xl border border-black/5 bg-white/50 text-on-surface-variant hover:bg-white transition-all duration-300 font-medium scale-98 active:scale-95 cursor-pointer shadow-xs overflow-hidden",
            compact ? "justify-center p-2" : "p-2 pr-3 justify-start"
          ].join(" ")}
          title={compact ? resolvedDisplayName : undefined}
        >
          {resolvedAvatarUrl ? (
            <img
              src={resolvedAvatarUrl}
              alt={resolvedDisplayName}
              className="h-9 w-9 rounded-full object-cover shadow-xs border border-white shrink-0"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-primary-container text-xs font-extrabold text-white flex items-center justify-center border border-white shrink-0">
              {resolvedDisplayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div
            className={[
              "flex-1 min-w-0 text-left transition-all duration-300 flex items-center justify-between",
              compact ? "max-w-0 opacity-0 pointer-events-none ml-0" : "max-w-[160px] opacity-100 ml-3"
            ].join(" ")}
          >
            <div className="flex-1 min-w-0 mr-2">
              <h4 className="text-xs font-bold text-on-surface truncate">{resolvedDisplayName}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-on-surface-variant/70 truncate max-w-[85px]">{user?.email || ""}</span>
                {isPro ? (
                  <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.2 text-[8px] font-extrabold text-amber-600 flex items-center gap-0.5 shrink-0">
                    <Crown className="h-2 w-2" />
                    Pro
                  </span>
                ) : (
                  <span className="rounded-full border border-black/10 bg-black/5 px-1.5 py-0.2 text-[8px] font-bold text-on-surface-variant/70 shrink-0">
                    Free
                  </span>
                )}
              </div>
            </div>
            <ChevronDown 
              className="h-3.5 w-3.5 text-on-surface-variant/50 transition-transform duration-300 shrink-0" 
              style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }} 
            />
          </div>
        </button>
      </div>
    );
  };

  return (
    <>
      {/* ─── Desktop Left Sidebar ─── */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={[
          "hidden md:flex fixed left-0 top-0 bottom-0 z-40 border-r border-black/5 backdrop-blur-xl flex-col p-5 transition-all duration-300 items-center",
          isCollapsed 
            ? "w-20 bg-[#fffcf7]/50 shadow-xs" 
            : "w-64 bg-[#fffcf7]/95 shadow-[10px_0_30px_-5px_rgba(0,0,0,0.12)]"
        ].join(" ")}
      >
        {/* Logo Row */}
        <div className={[
          "flex w-full mb-8 px-1 items-center transition-all duration-300",
          isCollapsed ? "justify-center" : "justify-start"
        ].join(" ")}>
          <BlinkoLogo href="/dashboard" compact={isCollapsed} />
        </div>

        {/* Navigation Items */}
        {renderNavLinks(isCollapsed, () => {})}

        {/* User profile details & Drop-up */}
        {renderUserCard(isCollapsed)}
      </aside>

      {/* ─── Mobile Top Bar Header ─── */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#fffcf7]/75 backdrop-blur-xl border-b border-black/5 flex items-center justify-between px-4 z-45 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-black/5 transition flex items-center justify-center"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <BlinkoLogo href="/dashboard" />
        </div>

        {resolvedAvatarUrl ? (
          <img
            src={resolvedAvatarUrl}
            alt={resolvedDisplayName}
            className="h-8 w-8 rounded-full object-cover border border-white shadow-xs"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary-container text-xs font-extrabold text-white flex items-center justify-center border border-white">
            {resolvedDisplayName.charAt(0).toUpperCase()}
          </div>
        )}
      </header>

      {/* ─── Mobile Slide-out Drawer Panel ─── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop mask */}
          <div
            onClick={() => setMobileOpen(false)}
            className="flex-1 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
          />

          {/* Drawer menu */}
          <div className="w-64 bg-[#fffcf7] border-r border-black/5 h-full p-6 flex flex-col relative animate-in slide-in-from-left duration-300">
            {/* Drawer Header with Close Button */}
            <div className="flex items-center justify-between pb-6 mb-2 border-b border-black/5">
              <BlinkoLogo href="/dashboard" />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-xl text-on-surface-variant hover:text-primary hover:bg-black/5 transition flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation links inside drawer */}
            {renderNavLinks(false, () => setMobileOpen(false))}

            {/* User profile drawer footer */}
            {renderUserCard(false)}
          </div>
        </div>
      )}
    </>
  );
}
