"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Menu, X, ChevronDown, User, CreditCard, LogOut, LayoutDashboard, BarChart3, GitBranch } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import BlinkoLogo from "../BlinkoLogo";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Blinko Trees", href: "/dashboard/blinko-trees", icon: GitBranch },
];

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
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

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 50) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resolvedAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || profile?.avatar_url;
  const resolvedDisplayName = user?.user_metadata?.full_name || profile?.display_name || user?.email?.split("@")[0] || "User";

  return (
    <header 
      className="fixed top-6 left-1/2 w-[95%] max-w-7xl z-50 transition-transform duration-300 ease-out"
      style={{ transform: `translate(-50%, ${visible ? '0px' : '-120px'})` }}
    >
      <nav className="rounded-full border border-black/5 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex justify-between items-center py-3 px-6 transition-all duration-300">
        
        {/* Left Side: Logo */}
        <BlinkoLogo href="/dashboard" />

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                className={[
                  "font-medium hover:text-primary transition-colors duration-300 font-body-md text-body-md scale-95 active:scale-90 transition-transform",
                  isActive ? "text-primary font-semibold" : "text-on-surface-variant"
                ].join(" ")}
                href={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-4">
          
          {/* Notifications Tray */}
          <div className="relative flex items-center" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={[
                "relative rounded-full p-2 text-on-surface-variant hover:bg-white/40 hover:text-primary border border-transparent hover:border-white/60 transition-all shadow-sm flex items-center justify-center scale-95 active:scale-90",
                notificationsOpen ? "bg-white/60 text-primary border-white/80" : "",
              ].join(" ")}
              aria-label="Open notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-primary shadow-sm animate-pulse" />
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-14 w-80 rounded-3xl border border-black/10 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <h3 className="text-sm font-semibold text-on-surface">Notifications</h3>
                <div className="mt-3 space-y-3">
                  <div className="rounded-2xl bg-white/50 p-3 text-xs text-on-surface-variant border border-black/5 shadow-inner">
                    <div className="flex justify-between font-semibold text-on-surface">
                      <span>New Profile Visit</span>
                      <span className="text-[10px] text-on-surface-variant/50">2m ago</span>
                    </div>
                    <p className="mt-1">Someone from Google visited your link-in-bio page.</p>
                  </div>
                  <div className="rounded-2xl bg-white/50 p-3 text-xs text-on-surface-variant border border-black/5 shadow-inner">
                    <div className="flex justify-between font-semibold text-on-surface">
                      <span>System Alert</span>
                      <span className="text-[10px] text-on-surface-variant/50">1h ago</span>
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
              className="flex items-center gap-2 rounded-full border border-black/5 bg-white p-1.5 pr-3 text-on-surface-variant hover:bg-zinc-55 focus:outline-none transition-colors duration-300 font-medium scale-95 active:scale-90 cursor-pointer shadow-sm"
            >
              {resolvedAvatarUrl ? (
                <img
                  src={resolvedAvatarUrl}
                  alt={resolvedDisplayName}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-primary to-primary-container text-xs font-semibold text-white flex items-center justify-center">
                  {resolvedDisplayName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden text-xs font-semibold text-on-surface md:inline max-w-[120px] truncate">
                {resolvedDisplayName}
              </span>
              <ChevronDown className="h-3 w-3 text-on-surface-variant/60" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 text-xs border-b border-black/5 mb-1">
                  <p className="font-bold text-on-surface truncate">{resolvedDisplayName}</p>
                  <p className="text-on-surface-variant mt-0.5 truncate text-[11px]">{user?.email || ""}</p>
                </div>
                
                <Link
                  href="/dashboard/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-on-surface-variant hover:bg-white/60 hover:text-primary transition-colors duration-200"
                >
                  <User className="h-3.5 w-3.5" />
                  Profile Settings
                </Link>
                
                <Link
                  href="/dashboard/billing"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-on-surface-variant hover:bg-white/60 hover:text-primary transition-colors duration-200"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Billing & Plan
                </Link>

                <div className="border-t border-black/5 my-1" />
                
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    signOut();
                    router.push("/");
                  }}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-colors text-left cursor-pointer duration-200 font-semibold"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className="md:hidden text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="mt-3 w-full rounded-3xl border border-black/10 bg-white shadow-lg p-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-350">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                className="text-on-surface-variant font-semibold hover:text-primary transition-colors py-2 text-lg border-b border-black/5 flex items-center gap-3"
                href={item.href}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className="h-5 w-5 text-primary" />
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                signOut();
                router.push("/");
              }}
              className="w-full bg-rose-500/10 text-rose-500 text-center font-bold py-3 rounded-full hover:bg-rose-500 hover:text-white transition-colors mt-2"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
