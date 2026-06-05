"use client";

import { useState } from "react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex">
      {/* Desktop Sidebar (Fixed) */}
      <div className="hidden lg:block w-64 shrink-0 border-r border-zinc-900 bg-zinc-950 fixed inset-y-0 left-0 z-20">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={[
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <DashboardSidebar
          isMobile
          onClose={() => setMobileMenuOpen(false)}
          className="w-full"
        />
      </div>

      {/* Right Column: Navbar + Main Content */}
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen w-full min-w-0">
        <DashboardNavbar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
