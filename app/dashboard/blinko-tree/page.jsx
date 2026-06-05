"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Globe, MapPin, Mail, Upload, CheckCircle2, Trash2, Loader2, 
  GitBranch, Eye, Save, Palette, Link2, Sparkles, User 
} from "lucide-react";
import { Github, Linkedin, Instagram, Twitter } from "../../components/dashboard/BrandIcons";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/Button";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

const colors = ["#7c3aed", "#10b981", "#38bdf8", "#f43f5e", "#f59e0b", "#ec4899", "#ffffff"];
const fonts = [
  { id: "font-sans", name: "Inter (Sans-serif)" },
  { id: "font-serif", name: "Playfair Display (Serif)" },
  { id: "font-mono", name: "JetBrains Mono (Monospace)" },
];
const buttonStyles = [
  { id: "rounded-none", name: "Sharp (Square)" },
  { id: "rounded-md", name: "Soft (Medium)" },
  { id: "rounded-full", name: "Pill (Rounded)" },
];

export default function BlinkoTreeBuilder() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Tab control: "profile" | "socials" | "themes"
  const [activeTab, setActiveTab] = useState("profile");

  // Database lists
  const [themesList, setThemesList] = useState([]);
  const [activeTree, setActiveTree] = useState(null);

  // Profile Form states
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // Theme styling states
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [accentColor, setAccentColor] = useState("#7c3aed");
  const [fontStyle, setFontStyle] = useState("font-sans");
  const [buttonStyle, setButtonStyle] = useState("rounded-md");
  const [backgroundType, setBackgroundType] = useState("bg-zinc-950");

  // Social Links state (GitHub, LinkedIn, Instagram, YouTube, Twitter/X, TikTok, Discord, Spotify)
  const [socials, setSocials] = useState({
    github: "",
    linkedin: "",
    instagram: "",
    youtube: "",
    twitter: "",
    tiktok: "",
    discord: "",
    spotify: ""
  });

  // Fetch initial profile & tree settings
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        setLoading(true);

        // 1. Fetch user's tree
        const { data: tree, error: treeError } = await supabase
          .from("trees")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (treeError) throw treeError;

        if (!tree) {
          // If no tree, redirect to setup wizard
          router.push("/dashboard/blinko-tree/setup");
          return;
        }
        setActiveTree(tree);

        // 2. Fetch theme presets
        const { data: themes } = await supabase.from("themes").select("*");
        if (themes) setThemesList(themes);

        // 3. Fetch social connections
        const { data: socialRows } = await supabase
          .from("social_links")
          .select("*")
          .eq("user_id", user.id);

        if (socialRows && socialRows.length > 0) {
          const newSocials = {
            github: "", linkedin: "", instagram: "", youtube: "",
            twitter: "", tiktok: "", discord: "", spotify: ""
          };
          socialRows.forEach(row => {
            if (row.platform in newSocials) {
              newSocials[row.platform] = row.url;
            }
          });
          setSocials(newSocials);
        }

        // 4. Set Form states from current user profile
        if (profile) {
          setDisplayName(profile.display_name || "");
          setBio(profile.bio || "");
          setLocation(profile.location || "");
          setWebsite(profile.website || "");
          setAvatarUrl(profile.avatar_url || "");
          setSelectedThemeId(profile.theme_id);
          setAccentColor(profile.accent_color || "#7c3aed");
          setFontStyle(profile.font_style || "font-sans");
          setButtonStyle(profile.button_style || "rounded-md");
          setBackgroundType(profile.background_type || "bg-zinc-950");
        }

      } catch (err) {
        console.error("Builder Loading Error:", err.message || JSON.stringify(err) || err);
        console.warn("Hint: Make sure the Supabase database is initialized by running the SQL in schema.sql in the Supabase SQL editor.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, profile]);

  const handleSelectTheme = (theme) => {
    setSelectedThemeId(theme.id);
    setAccentColor(theme.config?.accentColor || "#7c3aed");
    setFontStyle(theme.config?.fontFamily || "font-sans");
    setButtonStyle(theme.config?.buttonStyle || "rounded-md");
    setBackgroundType(theme.config?.bgClass || "bg-zinc-950");
  };

  const handleSocialChange = (platform, val) => {
    setSocials(prev => ({ ...prev, [platform]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user || !activeTree) return;

    setSaving(true);
    try {
      // 1. Update Profiles table
      const profilePayload = {
        user_id: user.id,
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        location: location.trim() || null,
        website: website.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        theme_id: selectedThemeId || null,
        accent_color: accentColor,
        button_style: buttonStyle,
        font_style: fontStyle,
        background_type: backgroundType,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .update(profilePayload)
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // 2. Clear old social links and write new ones
      const { error: deleteSocialsError } = await supabase
        .from("social_links")
        .delete()
        .eq("user_id", user.id);

      if (deleteSocialsError) throw deleteSocialsError;

      const activeSocials = Object.entries(socials)
        .filter(([_, url]) => url && url.trim().length > 0)
        .map(([platform, url]) => ({
          user_id: user.id,
          platform: platform,
          url: url.trim()
        }));

      if (activeSocials.length > 0) {
        const { error: socialWriteError } = await supabase
          .from("social_links")
          .insert(activeSocials);

        if (socialWriteError) throw socialWriteError;
      }

      setToastMessage("Blinko Tree updated successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Save Builder Error:", err);
      alert(err.message || "Failed to save updates.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500 mx-auto" />
          <p className="text-sm text-zinc-400">Loading Blinko Tree settings...</p>
        </div>
      </div>
    );
  }

  // Find theme name for preview styling card bg
  const currentTheme = themesList.find(t => t.id === selectedThemeId);
  const cardBgClass = currentTheme?.config?.previewCard || "bg-zinc-900 border-zinc-800 text-zinc-300";
  const previewBg = currentTheme?.config?.previewBg || "#0A0A0A";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SectionHeader
        title="Blinko Tree"
        description="Build and style your Linktree-like public profile page. View preview in real time."
      >
        <div className="flex gap-2">
          <a
            href={`/${profile?.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-850 bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition"
          >
            <Eye className="h-3.5 w-3.5" />
            View Public Page
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-violet-500 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </SectionHeader>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-zinc-950 px-4 py-3 text-sm text-emerald-400 shadow-xl shadow-black/50 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        
        {/* Style Editors (Left 3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Menu tab selection row */}
          <div className="flex border-b border-zinc-900 pb-px gap-4">
            {[
              { id: "profile", label: "Profile Info", icon: User },
              { id: "socials", label: "Social Integrations", icon: Link2 },
              { id: "themes", label: "Theme Customizer", icon: Palette },
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-3 text-sm font-semibold transition border-b-2 -mb-px cursor-pointer ${
                    activeTab === tab.id 
                      ? "border-violet-500 text-violet-400"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: Profile Info form */}
          {activeTab === "profile" && (
            <DashboardCard className="space-y-5">
              <h3 className="text-base font-semibold text-white">Basic Information</h3>
              
              {/* Profile Image Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-2xl font-bold text-white shadow-lg shadow-violet-950/20">
                  {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-xs font-semibold text-zinc-500">Avatar Image Link</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or profile image link"
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              {/* Display Name & Handle display */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-zinc-205 outline-none transition focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Username Handle (Read-only)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-mono text-zinc-650">blinko.site/</span>
                    <input
                      type="text"
                      value={profile?.username || ""}
                      readOnly
                      disabled
                      className="w-full rounded-lg border border-zinc-900 bg-zinc-900/10 py-2 pl-[80px] pr-3.5 text-xs text-zinc-500 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Biography details */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="3"
                  className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-zinc-205 outline-none transition focus:border-violet-500/50 resize-none"
                />
              </div>

              {/* Location and website link */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-zinc-205 outline-none transition focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Personal Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-zinc-205 outline-none transition focus:border-violet-500/50"
                  />
                </div>
              </div>
            </DashboardCard>
          )}

          {/* TAB 2: Social accounts mapping */}
          {activeTab === "socials" && (
            <DashboardCard className="space-y-4">
              <h3 className="text-base font-semibold text-white">Social Integrations</h3>
              <p className="text-xs text-zinc-500 mb-2">Provide your profile URLs. Only filled platforms will appear on your public page.</p>
              
              {Object.keys(socials).map((platform) => (
                <div key={platform}>
                  <label className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1.5 capitalize">
                    <span className="rounded bg-zinc-900 border border-zinc-850 p-1 text-zinc-500">
                      <Link2 className="h-3 w-3" />
                    </span>
                    {platform} URL
                  </label>
                  <input
                    type="url"
                    placeholder={`https://${platform}.com/username`}
                    value={socials[platform]}
                    onChange={(e) => handleSocialChange(platform, e.target.value)}
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-zinc-205 outline-none transition focus:border-violet-500/50"
                  />
                </div>
              ))}
            </DashboardCard>
          )}

          {/* TAB 3: Theme customizers */}
          {activeTab === "themes" && (
            <div className="space-y-6">
              {/* Presets Gallery */}
              <DashboardCard>
                <h3 className="text-base font-semibold text-white mb-4">Choose Theme Preset</h3>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                  {themesList.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleSelectTheme(theme)}
                        className={`group flex flex-col gap-2 rounded-xl border p-3.5 text-left transition duration-300 ${
                          isSelected 
                            ? "border-violet-500 bg-violet-650/5 ring-1 ring-violet-500/30"
                            : "border-zinc-900 bg-zinc-950 hover:border-zinc-850 hover:bg-zinc-900/40"
                        }`}
                      >
                        {/* Miniature graphic */}
                        <div
                          className="aspect-video w-full rounded-lg flex flex-col justify-between p-2 border border-zinc-800"
                          style={{ backgroundColor: theme.config?.previewBg }}
                        >
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.config?.accentColor }} />
                            <div className="h-1 w-6 rounded bg-zinc-700/60" />
                          </div>
                          <div className="space-y-1">
                            <div className="h-1.5 w-full rounded bg-zinc-700/60" />
                            <div className="h-1.5 w-2/3 rounded bg-zinc-700/60" />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition">
                            {theme.name}
                          </span>
                          {isSelected && (
                            <span className="rounded bg-violet-500/10 p-0.5 text-violet-400 border border-violet-500/20">
                              <CheckCircle2 className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </DashboardCard>

              {/* Accent Color picker */}
              <DashboardCard>
                <h3 className="text-base font-semibold text-white mb-1.5">Accent Color</h3>
                <p className="text-xs text-zinc-500 mb-4 font-normal">Choose visual color highlight for social buttons and lines.</p>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => {
                    const isSelected = accentColor.toLowerCase() === color.toLowerCase();
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAccentColor(color)}
                        style={{ backgroundColor: color }}
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full border border-zinc-950 shadow-md transition hover:scale-110 focus:outline-none ${
                          isSelected ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-950" : ""
                        }`}
                      />
                    );
                  })}
                </div>
              </DashboardCard>

              {/* Fonts typography */}
              <DashboardCard>
                <h3 className="text-base font-semibold text-white mb-4">Typography Fonts</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {fonts.map((font) => {
                    const isSelected = fontStyle === font.id;
                    return (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => setFontStyle(font.id)}
                        className={`rounded-lg border p-3 text-center text-xs font-semibold transition duration-200 ${
                          isSelected
                            ? "border-violet-500 bg-violet-950/15 text-violet-300"
                            : "border-zinc-900 bg-zinc-950 text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                        } ${font.id}`}
                      >
                        {font.name}
                      </button>
                    );
                  })}
                </div>
              </DashboardCard>

              {/* Button Shape customization */}
              <DashboardCard>
                <h3 className="text-base font-semibold text-white mb-4">Button Shape</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {buttonStyles.map((style) => {
                    const isSelected = buttonStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setButtonStyle(style.id)}
                        className={`rounded-lg border p-3 text-center text-xs font-semibold transition duration-200 flex flex-col items-center gap-2 ${
                          isSelected
                            ? "border-violet-500 bg-violet-950/15 text-violet-300"
                            : "border-zinc-900 bg-zinc-950 text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                        }`}
                      >
                        <span>{style.name}</span>
                        <span className={`h-5 w-16 border border-zinc-800 bg-zinc-900 block ${style.id}`} />
                      </button>
                    );
                  })}
                </div>
              </DashboardCard>
            </div>
          )}
        </div>

        {/* Live Simulator Preview (Right 2 cols) */}
        <div className="lg:col-span-2 flex justify-center lg:justify-start lg:sticky lg:top-24 h-fit">
          <div className="relative w-full max-w-[310px] aspect-[9/18] rounded-[36px] border-[8px] border-zinc-900 bg-zinc-950 p-4 shadow-2xl shadow-violet-950/20 ring-1 ring-zinc-800 flex flex-col justify-between overflow-hidden">
            
            {/* Top notched notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-24 rounded-full bg-zinc-900 z-10 flex items-center justify-between px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <span className="w-10 h-1 rounded-full bg-zinc-800" />
            </div>

            {/* Inner Live Screen */}
            <div 
              className={`h-full p-4 flex flex-col justify-between pt-6 transition-colors duration-500 overflow-y-auto no-scrollbar ${backgroundType} ${fontStyle}`}
              style={{ backgroundColor: previewBg }}
            >
              <div className="w-full flex flex-col items-center text-center">
                
                {/* User avatar mockup */}
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-16 w-16 rounded-full object-cover shadow-md mb-3 mt-4"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-md flex items-center justify-center text-lg font-bold text-white mb-3 mt-4">
                    {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                  </div>
                )}

                {/* Name */}
                <h4 className="text-sm font-bold text-zinc-100 leading-tight">
                  {displayName || "Display Name"}
                </h4>
                <p className="text-[10px] font-mono mt-0.5" style={{ color: accentColor }}>
                  @{profile?.username || "handle"}
                </p>

                {/* Bio */}
                {bio && (
                  <p className={`text-[10px] leading-relaxed max-w-[220px] mt-2.5 p-2.5 border transition duration-300 ${cardBgClass}`}>
                    {bio}
                  </p>
                )}

                {/* Location row */}
                <div className="mt-3 flex flex-wrap justify-center gap-1.5 max-w-[240px]">
                  {location && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-black/40 px-2 py-0.5 text-[8px] text-zinc-400 border border-zinc-900">
                      <MapPin className="h-2 w-2" />
                      {location}
                    </span>
                  )}
                  {website && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-black/40 px-2 py-0.5 text-[8px] text-zinc-400 border border-zinc-900">
                      <Globe className="h-2 w-2" />
                      Website
                    </span>
                  )}
                </div>

                {/* Social icons connection */}
                <div className="mt-4 flex gap-2.5 text-zinc-400 justify-center">
                  {socials.github && <Github className="h-3.5 w-3.5" style={{ color: accentColor }} />}
                  {socials.linkedin && <Linkedin className="h-3.5 w-3.5" style={{ color: accentColor }} />}
                  {socials.instagram && <Instagram className="h-3.5 w-3.5" style={{ color: accentColor }} />}
                </div>

                {/* Demo Mockup Buttons for link previews */}
                <div className="mt-6 w-full space-y-2 px-1">
                  <div className={`w-full flex items-center justify-between p-2.5 text-[10px] text-zinc-100 font-medium border ${buttonStyle} ${cardBgClass}`}>
                    <span className="flex items-center gap-1.5 truncate">
                      <Link2 className="h-3.5 w-3.5" style={{ color: accentColor }} />
                      Demo Link Item 1
                    </span>
                    <span className="text-[8px]" style={{ color: accentColor }}>→</span>
                  </div>
                  <div className={`w-full flex items-center justify-between p-2.5 text-[10px] text-zinc-100 font-medium border ${buttonStyle} ${cardBgClass}`}>
                    <span className="flex items-center gap-1.5 truncate">
                      <Globe className="h-3.5 w-3.5" style={{ color: accentColor }} />
                      Demo Link Item 2
                    </span>
                    <span className="text-[8px]" style={{ color: accentColor }}>→</span>
                  </div>
                </div>
              </div>

              {/* simulator footer branding */}
              <div className="mt-8 mb-2 flex items-center justify-center gap-1 opacity-45">
                <span className="text-[8px] text-zinc-650">powered by</span>
                <span className="text-[8px] font-bold text-white tracking-wider bg-black/40 px-1 py-0.5 rounded border border-zinc-900">
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
