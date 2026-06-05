"use client";

import { useState } from "react";
import {
  Globe,
  MapPin,
  Mail,
  Upload,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Github, Linkedin, Instagram, Twitter } from "../../components/dashboard/BrandIcons";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/Button";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    displayName: "Lenny",
    username: "lenny",
    bio: "Creator & designer. Building beautiful AI mini websites in seconds at Blinko. 🚀",
    email: "lenny@blinko.dev",
    location: "San Francisco, CA",
    website: "https://lenny.dev",
    github: "https://github.com/lenny",
    linkedin: "https://linkedin.com/in/lenny",
    instagram: "https://instagram.com/lenny",
    twitter: "https://twitter.com/lenny",
  });

  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  const handleCancel = () => {
    // Reset to defaults
    setProfile({
      displayName: "Lenny",
      username: "lenny",
      bio: "Creator & designer. Building beautiful AI mini websites in seconds at Blinko. 🚀",
      email: "lenny@blinko.dev",
      location: "San Francisco, CA",
      website: "https://lenny.dev",
      github: "https://github.com/lenny",
      linkedin: "https://linkedin.com/in/lenny",
      instagram: "https://instagram.com/lenny",
      twitter: "https://twitter.com/lenny",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SectionHeader
        title="Profile Settings"
        description="Manage your public-facing card and social details."
      />

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-zinc-950 px-4 py-3 text-sm text-emerald-400 shadow-xl shadow-black/50 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-4 w-4" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form Inputs (Left side) */}
        <form onSubmit={handleSave} className="space-y-6 lg:col-span-3">
          {/* Section 1: Profile Info */}
          <DashboardCard>
            <h3 className="text-base font-semibold text-white mb-4">Basic Information</h3>
            <div className="space-y-5">
              {/* Profile Image Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-2xl font-bold text-white shadow-lg shadow-violet-950/20">
                  L
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 transition"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload Image
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Display Name & Username */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.displayName}
                    onChange={(e) => handleChange("displayName", e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-sm text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Username
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-medium text-zinc-600">
                      blinko.site/
                    </span>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      required
                      className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 py-2 pl-[80px] pr-3.5 text-sm text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/80"
                    />
                  </div>
                </div>
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Bio
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows="3"
                  className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-sm text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/80 resize-none"
                />
              </div>

              {/* Email & Location */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-sm text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/80"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-sm text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/80"
                  />
                </div>
              </div>

              {/* Personal Website */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Personal Website
                </label>
                <input
                  type="text"
                  value={profile.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-sm text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/80"
                />
              </div>
            </div>
          </DashboardCard>

          {/* Section 2: Social Links */}
          <DashboardCard>
            <h3 className="text-base font-semibold text-white mb-4">Social Accounts</h3>
            <div className="space-y-4">
              {/* GitHub */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1.5">
                  <Github className="h-3.5 w-3.5" />
                  GitHub URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={profile.github}
                  onChange={(e) => handleChange("github", e.target.value)}
                  className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-sm text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/80"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1.5">
                  <Linkedin className="h-3.5 w-3.5" />
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={profile.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                  className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-sm text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/80"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1.5">
                  <Instagram className="h-3.5 w-3.5" />
                  Instagram URL
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/username"
                  value={profile.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-sm text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/80"
                />
              </div>

              {/* Twitter */}
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1.5">
                  <Twitter className="h-3.5 w-3.5" />
                  Twitter URL
                </label>
                <input
                  type="url"
                  placeholder="https://twitter.com/username"
                  value={profile.twitter}
                  onChange={(e) => handleChange("twitter", e.target.value)}
                  className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-sm text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/80"
                />
              </div>
            </div>
          </DashboardCard>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              type="button"
              onClick={handleCancel}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>

        {/* Real-time Phone Mockup Preview (Right side) */}
        <div className="lg:col-span-2 flex justify-center lg:justify-start lg:sticky lg:top-24 h-fit">
          <div className="relative w-full max-w-[310px] aspect-[9/18] rounded-[36px] border-[8px] border-zinc-900 bg-zinc-950 p-4 shadow-2xl shadow-violet-950/20 ring-1 ring-zinc-800 flex flex-col justify-between overflow-hidden">
            {/* Phone Top Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-24 rounded-full bg-zinc-900 z-10 flex items-center justify-between px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <span className="w-10 h-1 rounded-full bg-zinc-800" />
            </div>

            {/* Inner Live Screen */}
            <div className="h-full flex flex-col items-center justify-between pt-6 overflow-y-auto no-scrollbar">
              <div className="w-full flex flex-col items-center text-center">
                {/* User avatar mockup */}
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-md shadow-violet-500/20 flex items-center justify-center text-lg font-bold text-white mb-3 mt-4">
                  {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : "?"}
                </div>

                {/* Name & Handle */}
                <h4 className="text-sm font-semibold text-zinc-100 leading-tight">
                  {profile.displayName || "Your Name"}
                </h4>
                <p className="text-[10px] text-violet-400 font-mono mt-0.5">
                  @{profile.username || "handle"}
                </p>

                {/* Custom bio */}
                {profile.bio && (
                  <p className="text-[10px] text-zinc-400 leading-relaxed max-w-[220px] mt-2.5 bg-zinc-900/50 p-2.5 rounded-xl border border-zinc-900">
                    {profile.bio}
                  </p>
                )}

                {/* Tags Row */}
                <div className="mt-3 flex flex-wrap justify-center gap-1.5 max-w-[240px]">
                  {profile.location && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-zinc-900 px-2 py-0.5 text-[8px] text-zinc-500 border border-zinc-800">
                      <MapPin className="h-2 w-2" />
                      {profile.location}
                    </span>
                  )}
                  {profile.website && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-zinc-900 px-2 py-0.5 text-[8px] text-zinc-500 border border-zinc-800">
                      <Globe className="h-2 w-2" />
                      Website
                    </span>
                  )}
                </div>

                {/* Social icons row */}
                <div className="mt-4 flex gap-2.5">
                  {profile.github && (
                    <span className="rounded-full bg-zinc-900 p-1.5 text-zinc-400 border border-zinc-850 hover:text-white transition">
                      <Github className="h-3 w-3" />
                    </span>
                  )}
                  {profile.linkedin && (
                    <span className="rounded-full bg-zinc-900 p-1.5 text-zinc-400 border border-zinc-850 hover:text-white transition">
                      <Linkedin className="h-3 w-3" />
                    </span>
                  )}
                  {profile.instagram && (
                    <span className="rounded-full bg-zinc-900 p-1.5 text-zinc-400 border border-zinc-850 hover:text-white transition">
                      <Instagram className="h-3 w-3" />
                    </span>
                  )}
                  {profile.twitter && (
                    <span className="rounded-full bg-zinc-900 p-1.5 text-zinc-400 border border-zinc-850 hover:text-white transition">
                      <Twitter className="h-3 w-3" />
                    </span>
                  )}
                </div>

                {/* Sample Buttons (Simulating actual Link-in-Bio pages) */}
                <div className="mt-6 w-full space-y-2 px-1">
                  <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 p-2.5">
                    <span className="text-[10px] text-zinc-300 font-medium flex items-center gap-1.5">
                      <Github className="h-3.5 w-3.5 text-violet-400" />
                      GitHub Profile
                    </span>
                    <span className="text-[9px] text-zinc-600">→</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 p-2.5">
                    <span className="text-[10px] text-zinc-300 font-medium flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-violet-400" />
                      My Portfolio
                    </span>
                    <span className="text-[9px] text-zinc-600">→</span>
                  </div>
                </div>
              </div>

              {/* Phone Footer Branding */}
              <div className="mt-8 mb-2 flex items-center gap-1 opacity-45">
                <span className="text-[8px] text-zinc-600">powered by</span>
                <span className="text-[8px] font-bold text-white tracking-wider bg-zinc-900 px-1 py-0.5 rounded border border-zinc-850">
                  BLINKO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
