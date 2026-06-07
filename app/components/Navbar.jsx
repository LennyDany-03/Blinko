"use client";

import Link from "next/link";
import { Menu, X, ChevronDown, User, CreditCard, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Product", href: "/" },
  { label: "Features", href: "/#features" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const resolvedAvatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || profile?.avatar_url;
  const resolvedDisplayName = user?.user_metadata?.full_name || profile?.display_name || user?.email?.split("@")[0] || "User";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
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

  return (
    <header 
      className="fixed top-6 left-1/2 w-[95%] max-w-7xl z-50 transition-transform duration-300 ease-out"
      style={{ transform: `translate(-50%, ${visible ? '0px' : '-120px'})` }}
    >
      <nav className="rounded-full border border-black/5 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.06)] flex justify-between items-center py-3 px-6 transition-all duration-300">
        <Link
          className="font-display-xl text-headline-md tracking-tighter text-primary flex items-center gap-2 scale-95 active:scale-90 transition-transform"
          href="/"
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2"></circle>
            <path
              d="M11 9h5.5a3.5 3.5 0 0 1 0 7h-5.5h5.5a3.5 3.5 0 0 1 0 7h-5.5V9z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            ></path>
          </svg>
          <span className="font-bold font-display-xl text-headline-md">Blinko</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 font-body-md text-body-md scale-95 active:scale-90 transition-transform"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
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
                <span className="hidden text-xs font-medium text-on-surface md:inline max-w-[120px] truncate">
                  {resolvedDisplayName}
                </span>
                <ChevronDown className="h-3 w-3 text-on-surface-variant" />
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

                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-on-surface-variant hover:bg-white/60 hover:text-primary transition-colors duration-200"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                    </svg>
                    Dashboard Home
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
          ) : (
            <>
              <Link
                href="/login"
                className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300 font-body-md text-body-md scale-95 active:scale-90 transition-transform mr-2"
              >
                Login
              </Link>
              
              <Link
                className="hidden sm:inline-block bg-white/45 text-on-surface border border-white/60 shadow-sm backdrop-blur-md font-body-md text-body-md font-medium px-6 py-2 rounded-full hover:bg-white/60 transition-all duration-300 scale-95 active:scale-90 text-center"
                href="/signup"
              >
                Start Building
              </Link>
            </>
          )}

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
                className="text-on-surface-variant font-semibold hover:text-primary transition-colors py-2 text-lg border-b border-black/5"
                href={item.href}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Link
                className="w-full bg-primary text-white text-center font-bold py-3 rounded-full hover:bg-primary/95 transition-colors mt-2"
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                className="w-full bg-primary text-white text-center font-bold py-3 rounded-full hover:bg-primary/95 transition-colors mt-2"
                href="/signup"
                onClick={() => setMobileOpen(false)}
              >
                Start Building
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
