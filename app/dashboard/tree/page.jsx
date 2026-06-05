"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Globe, MapPin, Mail, Upload, CheckCircle2, Trash2, Loader2, 
  GitBranch, Eye, Save, Palette, Link2, Sparkles, User, Plus, Check, X,
  ArrowUp, ArrowDown, ExternalLink, Shield, BarChart3, Lock, Settings, HelpCircle,
  Play, FileText, Building, Briefcase, Music, Camera, ShoppingBag, Edit2, ChevronDown, CheckCircle
} from "lucide-react";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/Button";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

// Lucide icon map for links
const iconMap = { Play, FileText, Globe, Music, Camera, ShoppingBag, Link2, Briefcase, Building };

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

const LINK_TYPES = [
  { type: "Website", icon: "Globe", defaultTitle: "My Website" },
  { type: "GitHub", icon: "Link2", defaultTitle: "GitHub Profile" },
  { type: "LinkedIn", icon: "Link2", defaultTitle: "LinkedIn Network" },
  { type: "Instagram", icon: "Link2", defaultTitle: "Instagram Page" },
  { type: "Twitter/X", icon: "Link2", defaultTitle: "Follow on Twitter/X" },
  { type: "YouTube", icon: "Play", defaultTitle: "YouTube Channel" },
  { type: "Resume", icon: "FileText", defaultTitle: "Download Resume" },
  { type: "Portfolio", icon: "Globe", defaultTitle: "My Portfolio" },
  { type: "Spotify", icon: "Music", defaultTitle: "Listen on Spotify" },
  { type: "Custom Link", icon: "Link2", defaultTitle: "Custom Link" },
];

export default function TreeBuilder() {
  const { user } = useAuth();
  const router = useRouter();

  // Loading & Action states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  // Plan info
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Trees list & switcher state
  const [trees, setTrees] = useState([]);
  const [activeTree, setActiveTree] = useState(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  // Profile Form States
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Links List States
  const [links, setLinks] = useState([]);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [selectedLinkType, setSelectedLinkType] = useState(LINK_TYPES[0]);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkIcon, setNewLinkIcon] = useState("Globe");
  const [newLinkFeatured, setNewLinkFeatured] = useState(false);
  const [newLinkButtonStyle, setNewLinkButtonStyle] = useState("rounded-md");
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editLinkTitle, setEditLinkTitle] = useState("");
  const [editLinkUrl, setEditLinkUrl] = useState("");
  const [editLinkIcon, setEditLinkIcon] = useState("Globe");
  const [editLinkFeatured, setEditLinkFeatured] = useState(false);
  const [editLinkButtonStyle, setEditLinkButtonStyle] = useState("rounded-md");

  // Design Styling States
  const [themesList, setThemesList] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [accentColor, setAccentColor] = useState("#7c3aed");
  const [fontStyle, setFontStyle] = useState("font-sans");
  const [buttonStyle, setButtonStyle] = useState("rounded-md");
  const [backgroundType, setBackgroundType] = useState("bg-zinc-950");

  // Social Links States
  const [socials, setSocials] = useState({
    github: "", linkedin: "", instagram: "", youtube: "",
    twitter: "", tiktok: "", discord: "", spotify: ""
  });

  // Settings Tab States
  const [treeName, setTreeName] = useState("");
  const [treeSlug, setTreeSlug] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  const loadTreeData = async (tree, allTrees) => {
    setActiveTree(tree);
    setTreeName(tree.name || "");
    setTreeSlug(tree.slug || "");
    setCustomDomain(""); // Placeholders for domains

    // Set other trees to inactive, active tree to active local-first
    if (allTrees) {
      setTrees(allTrees.map(t => ({ ...t, is_active: t.id === tree.id })));
    }

    try {
      // 1. Load profile for this tree
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("*")
        .eq("tree_id", tree.id)
        .maybeSingle();

      if (profileRow) {
        setDisplayName(profileRow.display_name || "");
        setBio(profileRow.bio || "");
        setLocation(profileRow.location || "");
        setWebsite(profileRow.website || "");
        setAvatarUrl(profileRow.avatar_url || "");
        setSelectedThemeId(profileRow.theme_id);
        setAccentColor(profileRow.accent_color || "#7c3aed");
        setFontStyle(profileRow.font_style || "font-sans");
        setButtonStyle(profileRow.button_style || "rounded-md");
        setBackgroundType(profileRow.background_type || "bg-zinc-950");
      } else {
        // Clear forms if profile is missing
        setDisplayName("");
        setBio("");
        setLocation("");
        setWebsite("");
        setAvatarUrl("");
      }

      // 2. Load links
      const { data: linksRows } = await supabase
        .from("links")
        .select("*")
        .eq("tree_id", tree.id)
        .order("position", { ascending: true });

      setLinks(linksRows || []);

      // 3. Load socials
      const { data: socialRows } = await supabase
        .from("social_links")
        .select("*")
        .eq("tree_id", tree.id);

      const newSocials = {
        github: "", linkedin: "", instagram: "", youtube: "",
        twitter: "", tiktok: "", discord: "", spotify: ""
      };
      if (socialRows) {
        socialRows.forEach(row => {
          if (row.platform in newSocials) {
            newSocials[row.platform] = row.url;
          }
        });
      }
      setSocials(newSocials);
    } catch (err) {
      console.error("Load Tree Data Error:", err);
    }
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Subscription status
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      const userIsPro = sub?.status === "active";
      setIsPro(userIsPro);

      // 2. Fetch Themes presets
      const { data: themes } = await supabase.from("themes").select("*");
      if (themes) setThemesList(themes);

      // 3. Fetch all trees owned by this user
      const { data: userTrees } = await supabase
        .from("trees")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (userTrees && userTrees.length > 0) {
        setTrees(userTrees);

        // Check for specific tree id in query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const treeIdParam = urlParams.get("id");

        let active = null;
        if (treeIdParam) {
          active = userTrees.find(t => t.id === treeIdParam);
        }
        if (!active) {
          active = userTrees.find(t => t.is_active) || userTrees[0];
        }

        await loadTreeData(active, userTrees);
      } else {
        // Redirect to onboarding if they have no trees
        router.push("/dashboard/blinko-tree/setup");
      }
    } catch (err) {
      console.error("Load Initial Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscription & trees on mount
  useEffect(() => {
    if (!user) return;
    Promise.resolve().then(() => {
      loadInitialData();
    });

    // Check for query parameters for initial tab
    const tabParam = new URLSearchParams(window.location.search).get("tab");
    if (tabParam) {
      Promise.resolve().then(() => {
        setActiveTab(tabParam);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSwitchTree = async (tree) => {
    setSwitcherOpen(false);
    setLoading(true);

    try {
      // 1. Set chosen tree is_active = true, others false in DB
      await supabase
        .from("trees")
        .update({ is_active: false })
        .eq("user_id", user.id);

      await supabase
        .from("trees")
        .update({ is_active: true })
        .eq("id", tree.id);

      // Refresh data
      const { data: updatedTrees } = await supabase
        .from("trees")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      setTrees(updatedTrees);
      const active = updatedTrees.find(t => t.id === tree.id);
      await loadTreeData(active, updatedTrees);

      // Notify sidebar of change
      window.dispatchEvent(new Event("activeTreeChanged"));
    } catch (err) {
      console.error("Switch active tree error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewTree = async () => {
    setSwitcherOpen(false);
    
    // Count user trees
    const treeCount = trees.length;
    if (treeCount >= 2 && !isPro) {
      setShowUpgradeModal(true);
      return;
    }

    // Redirect to onboarding setup wizard to guide creation of another tree
    router.push("/dashboard/blinko-tree/setup");
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!user || !activeTree) return;

    setSaving(true);
    try {
      // 1. Update trees table name and slug
      const slugClean = treeSlug.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      if (slugClean.length < 3) {
        throw new Error("Slug must be at least 3 characters.");
      }

      const { error: treeError } = await supabase
        .from("trees")
        .update({
          name: treeName.trim() || `${displayName}'s Blinko Tree`,
          slug: slugClean,
          theme_id: selectedThemeId
        })
        .eq("id", activeTree.id);

      if (treeError) throw treeError;

      // 2. Update Profiles details
      const profilePayload = {
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
        username: slugClean
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .update(profilePayload)
        .eq("tree_id", activeTree.id);

      if (profileError) throw profileError;

      // 3. Update Social connections (clear and write new ones)
      const { error: deleteSocialsError } = await supabase
        .from("social_links")
        .delete()
        .eq("tree_id", activeTree.id);

      if (deleteSocialsError) throw deleteSocialsError;

      const activeSocials = Object.entries(socials)
        .filter(([_, url]) => url && url.trim().length > 0)
        .map(([platform, url]) => ({
          tree_id: activeTree.id,
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

      // Refresh active tree fields
      const updatedTree = { ...activeTree, name: treeName.trim(), slug: slugClean, theme_id: selectedThemeId };
      setActiveTree(updatedTree);
      setTrees(prev => prev.map(t => t.id === activeTree.id ? updatedTree : t));

      // Dispatch custom sidebar trigger
      window.dispatchEvent(new Event("activeTreeChanged"));

      setToastMessage("Blinko Tree configuration saved successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Save updates failed:", err);
      alert(err.message || "Failed to save updates. Verify handle is unique.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTree = async () => {
    if (trees.length <= 1) {
      alert("You must keep at least one Blinko Tree page active.");
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete the Blinko Tree @${activeTree.slug}? All links, customizations, and analytics views will be lost forever.`)) {
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("trees")
        .delete()
        .eq("id", activeTree.id);

      if (error) throw error;

      // Select another tree to switch to
      const remaining = trees.filter(t => t.id !== activeTree.id);
      const switchTarget = remaining[0];
      
      await handleSwitchTree(switchTarget);
      alert("Blinko Tree deleted successfully.");
    } catch (err) {
      console.error("Delete tree error:", err);
    } finally {
      setSaving(false);
    }
  };

  // --- Links Tab Actions ---
  const handleToggleLinkActive = async (link) => {
    try {
      const updatedStatus = !link.active;
      const { error } = await supabase
        .from("links")
        .update({ active: updatedStatus })
        .eq("id", link.id);

      if (error) throw error;

      setLinks(prev => prev.map(l => l.id === link.id ? { ...l, active: updatedStatus } : l));
    } catch (err) {
      console.error("Toggle Link status error:", err);
    }
  };

  const handleLinkTypeChange = (typeObj) => {
    setSelectedLinkType(typeObj);
    setNewLinkTitle(typeObj.defaultTitle);
    setNewLinkIcon(typeObj.icon);
  };

  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl || !activeTree) return;

    setSaving(true);
    try {
      const position = links.length;
      const payload = {
        tree_id: activeTree.id,
        title: newLinkTitle.trim(),
        url: newLinkUrl.trim(),
        icon: newLinkIcon,
        position,
        featured: newLinkFeatured,
        active: true,
        button_style: newLinkButtonStyle,
        open_in_new_tab: true,
        click_count: 0
      };

      const { data, error } = await supabase
        .from("links")
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      setLinks(prev => [...prev, data]);
      setNewLinkTitle("");
      setNewLinkUrl("");
      setIsAddingLink(false);
    } catch (err) {
      console.error("Add Link Error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleStartEditLink = (link) => {
    setEditingLinkId(link.id);
    setEditLinkTitle(link.title);
    setEditLinkUrl(link.url);
    setEditLinkIcon(link.icon || "Globe");
    setEditLinkFeatured(link.featured === true);
    setEditLinkButtonStyle(link.button_style || "rounded-md");
  };

  const handleSaveEditLink = async (id) => {
    setSaving(true);
    try {
      const payload = {
        title: editLinkTitle.trim(),
        url: editLinkUrl.trim(),
        icon: editLinkIcon,
        button_style: editLinkButtonStyle,
        featured: editLinkFeatured
      };

      const { error } = await supabase
        .from("links")
        .update(payload)
        .eq("id", id);

      if (error) throw error;

      setLinks(prev => prev.map(l => l.id === id ? { ...l, ...payload } : l));
      setEditingLinkId(null);
    } catch (err) {
      console.error("Edit link error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async (id) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      const { error } = await supabase
        .from("links")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setLinks(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error("Delete Link Error:", err);
    }
  };

  const handleLinkReorder = async (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === links.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const reorderedLinks = [...links];

    // Swap elements
    const temp = reorderedLinks[index];
    reorderedLinks[index] = reorderedLinks[newIndex];
    reorderedLinks[newIndex] = temp;

    // Update state local first
    const updated = reorderedLinks.map((link, idx) => ({ ...link, position: idx }));
    setLinks(updated);

    try {
      const updates = updated.map(link => 
        supabase
          .from("links")
          .update({ position: link.position })
          .eq("id", link.id)
      );
      await Promise.all(updates);
    } catch (err) {
      console.error("Reorder Database Error:", err);
    }
  };

  // Theme lock check
  const handleSelectThemeLocal = (theme) => {
    const isPremiumTheme = ["Glassmorphism", "Gradient Neon", "Cyberpunk"].includes(theme.name);
    if (isPremiumTheme && !isPro) {
      setShowUpgradeModal(true);
      return;
    }

    setSelectedThemeId(theme.id);
    setAccentColor(theme.config?.accentColor || "#7c3aed");
    setFontStyle(theme.config?.fontFamily || "font-sans");
    setButtonStyle(theme.config?.buttonStyle || "rounded-md");
    setBackgroundType(theme.config?.bgClass || "bg-zinc-950");
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-violet-500 mx-auto" />
          <p className="text-sm text-zinc-400">Loading Blinko Tree workspace...</p>
        </div>
      </div>
    );
  }

  // Active theme properties
  const activeThemeObj = themesList.find(t => t.id === selectedThemeId) || themesList[0] || {};
  const currentCardBg = activeThemeObj?.config?.previewCard || "bg-zinc-900 border-zinc-800 text-zinc-300";
  const currentPreviewBg = activeThemeObj?.config?.previewBg || "#0A0A0A";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Dynamic Stepper Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 gap-4">
        <div>
          <div className="relative" style={{ display: "inline-block" }}>
            <button
              onClick={() => setSwitcherOpen(!switcherOpen)}
              className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-850 px-4 py-2 text-sm font-extrabold text-white hover:bg-zinc-800 hover:text-white transition"
            >
              <GitBranch className="h-4 w-4 text-violet-400" />
              @{activeTree?.slug || "handle"}
              <ChevronDown className="h-3 w-3 text-zinc-550" />
            </button>

            {/* Tree Switcher Dropdown */}
            {switcherOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-xl border border-zinc-900 bg-zinc-950 p-1.5 shadow-2xl shadow-black z-50 animate-in fade-in duration-200">
                <p className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest px-3 py-1.5 border-b border-zinc-900 mb-1">
                  Switch Active Tree
                </p>
                <div className="max-h-36 overflow-y-auto no-scrollbar space-y-0.5">
                  {trees.map(tree => (
                    <button
                      key={tree.id}
                      onClick={() => handleSwitchTree(tree)}
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-left transition ${
                        tree.id === activeTree?.id
                          ? "bg-violet-600/15 border border-violet-500/10 text-violet-300 font-bold"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                      }`}
                    >
                      <span className="truncate">@{tree.slug}</span>
                      {tree.id === activeTree?.id && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
                <div className="border-t border-zinc-900 my-1.5" />
                <button
                  onClick={handleCreateNewTree}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold text-violet-400 hover:bg-violet-650/15 hover:text-violet-300 transition text-left cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create New Tree
                  {!isPro && trees.length >= 2 && <Lock className="h-3 w-3 text-zinc-500" />}
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-2 font-medium">Build, customize theme styles, and manage links for this public bio tree.</p>
        </div>

        {/* Global Action Controls */}
        <div className="flex gap-2">
          <a
            href={`/${activeTree?.slug}`}
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-violet-500 transition cursor-pointer disabled:opacity-50"
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
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-zinc-950 px-4 py-3 text-sm text-emerald-400 shadow-xl shadow-black/50 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid: Editor + Simulator */}
      <div className="grid gap-8 lg:grid-cols-5 items-start">
        
        {/* Workspace Configurations (Left 3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Tab buttons switcher */}
          <div className="flex border-b border-zinc-900 pb-px gap-4 overflow-x-auto no-scrollbar">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "links", label: "Links", icon: Link2 },
              { id: "design", label: "Design", icon: Palette },
              { id: "socials", label: "Socials", icon: Mail },
              { id: "settings", label: "Settings", icon: Settings },
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-3 text-sm font-semibold transition border-b-2 -mb-px cursor-pointer shrink-0 ${
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

          {/* TAB 1: Profile customization info */}
          {activeTab === "profile" && (
            <DashboardCard className="space-y-5">
              <h3 className="text-base font-semibold text-white">Profile Customizations</h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-2xl font-bold text-white shadow-lg relative border border-zinc-850">
                  {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-500">Avatar Image URL</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or picture link"
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-white outline-none transition focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Username (Slug Handle)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-mono text-zinc-650">blinko.site/</span>
                    <input
                      type="text"
                      value={treeSlug}
                      onChange={(e) => setTreeSlug(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                      className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 py-2 pl-[80px] pr-3.5 text-xs text-zinc-200 outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Biography Description</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="3"
                  className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-white outline-none transition focus:border-violet-500/50 resize-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-white outline-none transition focus:border-violet-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://"
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-white outline-none transition focus:border-violet-500/50"
                  />
                </div>
              </div>
            </DashboardCard>
          )}

          {/* TAB 2: Links setup & visibility options */}
          {activeTab === "links" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center bg-zinc-950 p-4 border border-zinc-900 rounded-xl">
                <div>
                  <h3 className="text-sm font-semibold text-white">Manage Links</h3>
                  <p className="text-xs text-zinc-550 mt-0.5">Customize redirect buttons on your profile page.</p>
                </div>
                <button
                  onClick={() => setIsAddingLink(!isAddingLink)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-violet-600 hover:bg-violet-500 text-white transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Link
                </button>
              </div>

              {/* Add New Link Drawer */}
              {isAddingLink && (
                <DashboardCard className="border-zinc-900 bg-zinc-950/80 animate-in slide-in-from-top-4 duration-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">Configure New Link</h4>
                  
                  <form onSubmit={handleAddLink} className="space-y-4">
                    <div>
                      <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Link Preset Template</label>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar border border-zinc-900 rounded-lg p-2 bg-black/20">
                        {LINK_TYPES.map(type => (
                          <button
                            key={type.type}
                            type="button"
                            onClick={() => handleLinkTypeChange(type)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition border ${
                              selectedLinkType.type === type.type
                                ? "bg-violet-600/15 border-violet-500/30 text-violet-300"
                                : "border-transparent text-zinc-400 hover:bg-zinc-900"
                            }`}
                          >
                            {type.type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Title</label>
                        <input
                          type="text"
                          value={newLinkTitle}
                          onChange={(e) => setNewLinkTitle(e.target.value)}
                          required
                          className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-violet-500/50"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Destination URL</label>
                        <input
                          type="url"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          required
                          className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-violet-500/50"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4 items-end bg-black/10 p-3 rounded-lg border border-zinc-900">
                      <div>
                        <label className="block text-xs text-zinc-400 mb-1 font-medium">Shape</label>
                        <select
                          value={newLinkButtonStyle}
                          onChange={(e) => setNewLinkButtonStyle(e.target.value)}
                          className="w-full rounded-lg border border-zinc-900 bg-zinc-900/45 px-2 py-1 text-xs text-zinc-300 outline-none"
                        >
                          <option value="rounded-none">Sharp</option>
                          <option value="rounded-md">Soft</option>
                          <option value="rounded-full">Pill</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5 h-8">
                        <input
                          id="featured_check_new"
                          type="checkbox"
                          checked={newLinkFeatured}
                          onChange={(e) => setNewLinkFeatured(e.target.checked)}
                          className="h-3.5 w-3.5"
                        />
                        <label htmlFor="featured_check_new" className="text-xs text-zinc-400 font-medium">Featured</label>
                      </div>

                      <div className="sm:col-span-2 flex justify-end">
                        <Button type="submit" variant="primary" className="h-8 w-full text-xs font-bold" disabled={saving}>
                          Create Link
                        </Button>
                      </div>
                    </div>
                  </form>
                </DashboardCard>
              )}

              {/* Links List items */}
              {links.length === 0 ? (
                <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-8 text-center text-zinc-550 text-xs italic">
                  No links created for this tree yet. Click &quot;Add Link&quot; above to setup button actions.
                </div>
              ) : (
                <div className="space-y-3">
                  {links.map((link, index) => {
                    const isEditing = editingLinkId === link.id;
                    const LinkIconComponent = iconMap[link.icon] || Globe;

                    return (
                      <div
                        key={link.id}
                        className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 space-y-3 hover:border-violet-500/20 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Order arrows */}
                            <div className="flex flex-col gap-1 pr-1 shrink-0">
                              <button
                                onClick={() => handleLinkReorder(index, "up")}
                                disabled={index === 0}
                                className="p-0.5 rounded bg-zinc-900 text-zinc-500 hover:text-white disabled:opacity-30 transition"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleLinkReorder(index, "down")}
                                disabled={index === links.length - 1}
                                className="p-0.5 rounded bg-zinc-900 text-zinc-500 hover:text-white disabled:opacity-30 transition"
                              >
                                <ArrowDown className="h-3 w-3" />
                              </button>
                            </div>
                            
                            {isEditing ? (
                              <div className="grid gap-2 sm:grid-cols-2">
                                <input
                                  type="text"
                                  value={editLinkTitle}
                                  onChange={(e) => setEditLinkTitle(e.target.value)}
                                  className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-white"
                                />
                                <input
                                  type="url"
                                  value={editLinkUrl}
                                  onChange={(e) => setEditLinkUrl(e.target.value)}
                                  className="rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-white"
                                />
                              </div>
                            ) : (
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="rounded bg-zinc-900 p-1 text-violet-400 border border-zinc-850">
                                    <LinkIconComponent className="h-3.5 w-3.5" style={{ color: accentColor }} />
                                  </span>
                                  <span className="text-xs font-bold text-white truncate max-w-[150px]">{link.title}</span>
                                  {link.featured && (
                                    <span className="text-[9px] font-bold text-violet-400 bg-violet-500/10 px-1 rounded border border-violet-500/15">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-zinc-500 truncate max-w-[220px] mt-1 pl-7">{link.url}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Click stats count */}
                            <span className="text-[10px] font-mono text-zinc-500 pr-1 select-none flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              {link.click_count || 0} clicks
                            </span>

                            {/* Visibility active status toggle */}
                            <button
                              onClick={() => handleToggleLinkActive(link)}
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold border transition ${
                                link.active
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                  : "bg-zinc-800 border-zinc-800 text-zinc-500 hover:bg-zinc-800/80"
                              }`}
                            >
                              {link.active ? "Active" : "Hidden"}
                            </button>

                            {/* Edit/Delete controls */}
                            {isEditing ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleSaveEditLink(link.id)}
                                  className="rounded p-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                  disabled={saving}
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => setEditingLinkId(null)}
                                  className="rounded p-1 bg-zinc-900 text-zinc-400 hover:text-white"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleStartEditLink(link)}
                                  className="rounded p-1 hover:bg-zinc-900 text-zinc-450 hover:text-white"
                                  title="Edit"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLink(link.id)}
                                  className="rounded p-1 hover:bg-rose-500/10 text-zinc-450 hover:text-rose-400"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Design configuration selector */}
          {activeTab === "design" && (
            <div className="space-y-6">
              <DashboardCard>
                <h3 className="text-base font-semibold text-white mb-4">Choose a Theme</h3>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                  {themesList.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    const isPremium = ["Glassmorphism", "Gradient Neon", "Cyberpunk"].includes(theme.name);

                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleSelectThemeLocal(theme)}
                        className={`group flex flex-col gap-2 rounded-xl border p-3.5 text-left transition duration-300 ${
                          isSelected 
                            ? "border-violet-500 bg-violet-650/5 ring-1 ring-violet-500/30"
                            : "border-zinc-900 bg-zinc-950 hover:border-zinc-850 hover:bg-zinc-900/40"
                        }`}
                      >
                        {/* Theme Miniature Preview Block */}
                        <div
                          className="aspect-video w-full rounded-lg flex flex-col justify-between p-2 border border-zinc-800 relative"
                          style={{ backgroundColor: theme.config?.previewBg }}
                        >
                          <div className="flex items-center gap-1">
                            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.config?.accentColor }} />
                            <div className="h-1 w-6 rounded bg-zinc-700/60" />
                          </div>
                          
                          {isPremium && !isPro && (
                            <span className="absolute top-2 right-2 rounded bg-black/60 border border-zinc-800 p-0.5 text-zinc-400">
                              <Lock className="h-2.5 w-2.5" />
                            </span>
                          )}

                          <div className="space-y-1">
                            <div className="h-1.5 w-full rounded bg-zinc-700/60" />
                            <div className="h-1.5 w-2/3 rounded bg-zinc-700/60" />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition flex items-center gap-1">
                            {theme.name}
                            {isPremium && <span className="text-[8px] font-bold text-violet-400 tracking-wider">PRO</span>}
                          </span>
                          {isSelected && (
                            <span className="rounded bg-violet-500/10 p-0.5 text-violet-400 border border-violet-500/20">
                              <Check className="h-3 w-3" />
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
                <h3 className="text-base font-semibold text-white mb-1">Accent Color</h3>
                <p className="text-xs text-zinc-550 mb-4">Select custom highlight coloring for links and tags.</p>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map((color) => {
                    const isSelected = accentColor.toLowerCase() === color.toLowerCase();
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAccentColor(color)}
                        style={{ backgroundColor: color }}
                        className={`relative flex h-8 w-8 items-center justify-center rounded-full border border-zinc-950 shadow transition hover:scale-110 focus:outline-none ${
                          isSelected ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-950" : ""
                        }`}
                      />
                    );
                  })}
                </div>
              </DashboardCard>

              {/* Typography Font picker */}
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
                        className={`rounded-lg border p-3 text-center text-xs font-semibold transition ${
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
                        className={`rounded-lg border p-3 text-center text-xs font-semibold transition flex flex-col items-center gap-2 ${
                          isSelected
                            ? "border-violet-500 bg-violet-950/15 text-violet-300"
                            : "border-zinc-900 bg-zinc-950 text-zinc-400 hover:bg-zinc-900/60"
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

          {/* TAB 4: Social connections list */}
          {activeTab === "socials" && (
            <DashboardCard className="space-y-4">
              <h3 className="text-base font-semibold text-white">Social Integrations</h3>
              <p className="text-xs text-zinc-550 mb-2">Connect social channels URLs to display them directly above links.</p>
              
              {Object.keys(socials).map((platform) => (
                <div key={platform}>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 capitalize">
                    {platform} URL
                  </label>
                  <input
                    type="url"
                    placeholder={`https://${platform}.com/username`}
                    value={socials[platform]}
                    onChange={(e) => setSocials(prev => ({ ...prev, [platform]: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-white outline-none focus:border-violet-500/50"
                  />
                </div>
              ))}
            </DashboardCard>
          )}

          {/* TAB 5: Settings, Custom Domain, Deletion */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <DashboardCard className="space-y-4">
                <h3 className="text-base font-semibold text-white">Tree Metadata Settings</h3>
                
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tree Name (Internal reference)</label>
                  <input
                    type="text"
                    value={treeName}
                    onChange={(e) => setTreeName(e.target.value)}
                    required
                    placeholder="e.g. My Developer page"
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-white outline-none focus:border-violet-500/50"
                  />
                </div>

                {/* Custom Domains - Locked feature */}
                <div onClick={() => !isPro && setShowUpgradeModal(true)}>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                      Custom Domain
                      {!isPro && <Lock className="h-3 w-3 text-zinc-500" />}
                    </label>
                    {!isPro && <span className="text-[9px] font-bold text-violet-400 tracking-wider">PRO ONLY</span>}
                  </div>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => isPro && setCustomDomain(e.target.value)}
                    disabled={!isPro}
                    placeholder={isPro ? "e.g. yourname.com" : "🔒 yourname.com (Upgrade to customize)"}
                    className={`w-full rounded-lg border border-zinc-900 bg-zinc-900/40 px-3.5 py-2 text-xs text-white outline-none focus:border-violet-500/50 ${
                      !isPro ? "cursor-pointer select-none opacity-60 text-zinc-500" : ""
                    }`}
                  />
                </div>
              </DashboardCard>

              {/* Danger Zone */}
              <DashboardCard className="border-rose-500/10 bg-rose-500/[0.02] p-5 space-y-4">
                <h3 className="text-sm font-semibold text-rose-400">Danger Zone</h3>
                <p className="text-xs text-zinc-550 leading-relaxed">
                  Deleting this Blinko Tree will permanently remove it from the platform along with all customized links and visitor analytics logs. 
                  This action is irreversible.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteTree}
                  className="rounded-lg bg-rose-600/15 border border-rose-500/25 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                >
                  Delete Blinko Tree
                </button>
              </DashboardCard>
            </div>
          )}

        </div>

        {/* Live Simulator Panel (Right 2 cols) */}
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
              style={{ backgroundColor: currentPreviewBg }}
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
                  blinko.site/{treeSlug || "handle"}
                </p>

                {/* Bio */}
                {bio && (
                  <p className={`text-[10px] leading-relaxed max-w-[220px] mt-2.5 p-2.5 border transition duration-300 ${currentCardBg}`}>
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
                  {socials.github && <Check className="h-3.5 w-3.5" style={{ color: accentColor }} />}
                  {socials.linkedin && <Check className="h-3.5 w-3.5" style={{ color: accentColor }} />}
                  {socials.instagram && <Check className="h-3.5 w-3.5" style={{ color: accentColor }} />}
                </div>

                {/* Live Link Buttons list */}
                <div className="mt-6 w-full space-y-2 px-1">
                  {links.filter(l => l.active).map(link => {
                    const LinkIconComponent = iconMap[link.icon] || Globe;
                    return (
                      <div
                        key={link.id}
                        className={`w-full flex items-center justify-between p-2.5 text-[10px] text-zinc-100 font-medium border ${buttonStyle} ${currentCardBg}`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <LinkIconComponent className="h-3.5 w-3.5" style={{ color: accentColor }} />
                          {link.title || "Link Title"}
                        </span>
                        <span className="text-[8px]" style={{ color: accentColor }}>→</span>
                      </div>
                    );
                  })}
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

      {/* FREEMIUM UPGRADE MODAL POPUP */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4 select-none">
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#111111]/95 p-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-650/15 text-violet-400 mb-4">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="text-xl font-extrabold text-white">🚀 Unlock Unlimited Blinko Trees</h3>
            <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
              You&apos;ve reached a locked feature or the free plan limit of 2 Blinko Trees. Upgrade to Pro to customize limitlessly.
            </p>

            {/* Benefits cards grid */}
            <div className="mt-6 grid gap-2.5 text-left max-h-52 overflow-y-auto pr-1">
              {[
                { title: "Unlimited Blinko Trees", desc: "Create as many public pages as you want." },
                { title: "Advanced Analytics", desc: "Track Views, Clicks, CTR, Top Links, Traffic Sources, Device stats." },
                { title: "Premium Themes", desc: "Access all premium designs (Neon, Cyberpunk, Glassmorphism)." },
                { title: "Custom Domains", desc: "Use yourname.com instead of blinko.site/username." },
                { title: "Remove Blinko Branding", desc: "Remove all platform watermarks." },
                { title: "Priority Support", desc: "Faster support response." },
                { title: "AI Optimization Tools", desc: "AI Bio Generator, AI profile enhancers, and suggestion tools." }
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-2.5 rounded-lg border border-zinc-900 bg-zinc-950 p-2.5 text-xs">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">{benefit.title}</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal actions buttons */}
            <div className="mt-8 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  router.push("/dashboard/billing");
                }}
                className="w-full flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-500 text-xs font-bold text-white hover:from-violet-500 hover:to-fuchsia-400 transition cursor-pointer"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full text-zinc-500 hover:text-zinc-350 text-xs font-semibold py-2 transition"
              >
                Not Right Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
