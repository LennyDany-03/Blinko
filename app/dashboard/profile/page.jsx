"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Upload, Trash2, Loader2, CheckCircle2, 
  GitBranch, Link2, Eye, MousePointerClick, Camera, ArrowRight
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/Button";

export default function UserProfileSettings() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Loading and action states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Form states
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [toast, setToast] = useState({ show: false, message: "" });

  // Track History Stats
  const [stats, setStats] = useState({
    trees: 0,
    links: 0,
    views: 0,
    clicks: 0
  });

  useEffect(() => {
    if (!user) return;

    // Initialize form inputs from user metadata
    setDisplayName(user.user_metadata?.full_name || "");
    setAvatarUrl(user.user_metadata?.avatar_url || user.user_metadata?.picture || "");

    const loadProfileStats = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch user's trees count
        const { data: userTrees, error: treesError } = await supabase
          .from("trees")
          .select("id")
          .eq("user_id", user.id);

        if (treesError) throw treesError;

        const treesCount = userTrees?.length || 0;

        if (treesCount === 0) {
          setStats({ trees: 0, links: 0, views: 0, clicks: 0 });
          return;
        }

        const treeIds = userTrees.map(t => t.id);

        // 2. Fetch total links across all user trees
        const { count: totalLinks, error: linksError } = await supabase
          .from("links")
          .select("id", { count: "exact", head: true })
          .in("tree_id", treeIds);

        if (linksError) throw linksError;

        // 3. Fetch analytics aggregate logs
        const { data: analyticsData, error: analyticsError } = await supabase
          .from("analytics")
          .select("views, clicks")
          .in("tree_id", treeIds);

        if (analyticsError) throw analyticsError;

        const totalViews = analyticsData?.reduce((sum, row) => sum + (row.views || 0), 0) || 0;
        const totalClicks = analyticsData?.reduce((sum, row) => sum + (row.clicks || 0), 0) || 0;

        setStats({
          trees: treesCount,
          links: totalLinks || 0,
          views: totalViews,
          clicks: totalClicks
        });

      } catch (err) {
        console.error("Load Profile Stats Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfileStats();
  }, [user]);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: "" }), 3000);
  };

  const uploadAvatarFile = async (file) => {
    if (!user) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max size is 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop() || "png";
      const fileName = `${user.id}/account-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl);
      showNotification("Account photo uploaded! Click Save to apply.");
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert(`Avatar upload failed: ${err.message || "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadAvatarFile(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      // Update User Metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: { 
          full_name: displayName.trim(),
          avatar_url: avatarUrl.trim()
        }
      });

      if (error) throw error;

      showNotification("Account Profile updated successfully!");
      
      // Reload page state or fire trigger so navbar re-syncs
      router.refresh();
    } catch (err) {
      console.error("Save Account Profile Error:", err);
      alert(err.message || "Failed to update profile settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-on-surface-variant">Loading profile settings...</p>
        </div>
      </div>
    );
  }

  const hasAvatar = !!avatarUrl;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <SectionHeader 
        title="Profile Settings" 
        description="Manage your main user account profile picture and display name."
      />

      <div className="grid gap-8 lg:grid-cols-5 items-start">
        
        {/* Left Side: Edit forms (3 cols) */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-3 space-y-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#818cf8]/15 via-[#c084fc]/10 to-[#22d3ee]/15 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 space-y-6">
            
            {/* Card 1: Avatar Upload Card */}
            <div className="bg-white/45 border border-white/60 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center gap-4.5 shadow-sm text-center">
              <div className="relative shrink-0">
                <div className="absolute -inset-0.5 rounded-full bg-white opacity-40 blur-sm" />
                {hasAvatar ? (
                  <img
                    src={avatarUrl}
                    alt={displayName || "User Avatar"}
                    className={`relative h-24 w-24 rounded-full object-cover shadow-md border-4 border-white transition-all duration-300 hover:scale-105 ${uploading ? 'opacity-50' : ''}`}
                  />
                ) : (
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary-container text-4xl font-bold text-white shadow-lg border-4 border-white transition-all duration-300 hover:scale-105">
                    {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 border-4 border-white">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              {/* Upload controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                <label className="flex items-center justify-center gap-1.5 px-6 py-3 bg-white border border-black/5 text-zinc-700 font-extrabold rounded-xl text-xs hover:bg-zinc-50 transition cursor-pointer shadow-sm select-none">
                  <Upload className="h-3.5 w-3.5 text-zinc-650" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        await uploadAvatarFile(file);
                      }
                    }}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`px-6 py-3 rounded-xl border-2 border-dashed text-[10px] font-bold select-none tracking-wide transition-all ${
                    isDragging 
                      ? 'border-violet-500 bg-violet-500/10 text-violet-600 scale-105' 
                      : 'border-zinc-400/40 text-zinc-500 hover:border-zinc-450 hover:bg-black/5'
                  }`}
                >
                  {isDragging ? "Drop your photo here!" : "or drag & drop here"}
                </div>
              </div>
            </div>

            {/* Card 2: Display Name Input */}
            <div className="bg-white/45 border border-white/60 backdrop-blur-md rounded-2xl p-6 space-y-5 shadow-sm">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  placeholder="e.g. Lenny Dany Derek D"
                  className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-xs font-semibold text-zinc-800 outline-none transition focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 shadow-sm"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="luminous" className="font-bold text-xs px-6 py-2.5" disabled={saving}>
                {saving ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving Changes...
                  </span>
                ) : (
                  "Save Profile Changes"
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Right Side: Account Track History Stats (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/40 border border-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-on-surface">Profile Track History</h3>
              <p className="text-[11px] text-on-surface-variant/80 mt-0.5">Aggregated metrics and content statistics across all bio-pages.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Stat 1: Blinko Trees */}
              <div className="bg-white/50 border border-black/5 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Blinko Trees</span>
                  <span className="rounded bg-violet-500/10 p-1 text-[#8b5cf6] border border-violet-500/15">
                    <GitBranch className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="text-2xl font-black text-on-surface mt-4">{stats.trees}</p>
                <p className="text-[9px] text-on-surface-variant/70 mt-1">Bio link pages created</p>
              </div>

              {/* Stat 2: Total Links */}
              <div className="bg-white/50 border border-black/5 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Total Links</span>
                  <span className="rounded bg-violet-500/10 p-1 text-[#8b5cf6] border border-violet-500/15">
                    <Link2 className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="text-2xl font-black text-on-surface mt-4">{stats.links}</p>
                <p className="text-[9px] text-on-surface-variant/70 mt-1">Button actions defined</p>
              </div>

              {/* Stat 3: Views */}
              <div className="bg-white/50 border border-black/5 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Total Views</span>
                  <span className="rounded bg-violet-500/10 p-1 text-[#8b5cf6] border border-violet-500/15">
                    <Eye className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="text-2xl font-black text-on-surface mt-4">{stats.views.toLocaleString()}</p>
                <p className="text-[9px] text-on-surface-variant/70 mt-1">Visitor page views logged</p>
              </div>

              {/* Stat 4: Clicks */}
              <div className="bg-white/50 border border-black/5 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">Total Clicks</span>
                  <span className="rounded bg-violet-500/10 p-1 text-[#8b5cf6] border border-violet-500/15">
                    <MousePointerClick className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="text-2xl font-black text-on-surface mt-4">{stats.clicks.toLocaleString()}</p>
                <p className="text-[9px] text-on-surface-variant/70 mt-1">Outbound redirect interactions</p>
              </div>
            </div>

            {/* Helpful redirect button */}
            <button
              onClick={() => router.push("/dashboard/blinko-trees")}
              className="w-full flex h-10 items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-white/60 text-xs font-bold text-on-surface hover:bg-white/95 transition cursor-pointer"
            >
              <span>Manage Blinko Tree Pages</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Success Toast */}
      {toast.show && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-600 shadow-xl shadow-black/10 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
