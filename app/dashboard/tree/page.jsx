"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Globe, MapPin, Mail, Upload, CheckCircle2, Trash2, Loader2, 
  GitBranch, Eye, Save, Palette, Link2, Sparkles, User, Plus, Check, X,
  ArrowUp, ArrowDown, ExternalLink, Shield, BarChart3, Lock, Settings, HelpCircle,
  Play, FileText, Building, Briefcase, Music, Camera, ShoppingBag, Edit2, ChevronDown, CheckCircle,
  Code, BookOpen, Copy
} from "lucide-react";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/Button";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";
import ThemeCustomizer from "../../components/theme/ThemeCustomizer";
import AnimatedBackground from "../../components/theme/AnimatedBackground";
import ProUpgradeModal from "../../components/theme/ProUpgradeModal";
import { resolveIsLightBg, resolvePreviewBg } from "../../components/theme/BlinkoPhonePreview";
import { LINK_STYLE_PRESETS, BIO_CARD_STYLES } from "../../components/theme/themePresets";

// Lucide icon map for links
const iconMap = { Play, FileText, Globe, Music, Camera, ShoppingBag, Link2, Briefcase, Building, Code, BookOpen };

const GithubIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

const TwitterIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const SpotifyIcon = ({ className = "h-3.5 w-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 11.5c2.5-1.5 5.5-1.5 8 0M9 14c2-1 4-1 6 0M10 16.5c1.5-.7 2.5-.7 4 0" />
  </svg>
);

const socialIconMap = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  twitter: TwitterIcon,
  spotify: SpotifyIcon
};

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
  const [isActiveTreeFrozen, setIsActiveTreeFrozen] = useState(false);

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
  const [isVerified, setIsVerified] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
  const [previewBgState, setPreviewBgState] = useState("#09090b");

  // Theme Studio States
  const [linkStyle, setLinkStyle] = useState("minimal");
  const [animationStrength, setAnimationStrength] = useState(0.6);
  const [blurAmount, setBlurAmount] = useState(20);
  const [shadowIntensity, setShadowIntensity] = useState(0.5);
  const [cardTransparency, setCardTransparency] = useState(40);
  const [animatedBackground, setAnimatedBackground] = useState("none");
  const [titleColor, setTitleColor] = useState("accent");
  const [bioCardStyle, setBioCardStyle] = useState("transparent");

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
        setDisplayName(profileRow.display_name || user?.user_metadata?.full_name || user?.user_metadata?.name || "");
        setBio(profileRow.bio || "");
        setLocation(profileRow.location || "");
        setWebsite(profileRow.website || "");
        setAvatarUrl(profileRow.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "");
        setSelectedThemeId(profileRow.theme_id);
        setAccentColor(profileRow.accent_color || "#7c3aed");
        setFontStyle(profileRow.font_style || "font-sans");
        setButtonStyle(profileRow.button_style || "rounded-md");

        // Deserialize theme customizer configurations from the text field 'background_type'
        let bgVal = profileRow.background_type || "bg-zinc-950";
        let loadedLinkStyle = "minimal";
        let loadedAnimStrength = 0.6;
        let loadedBlurAmt = 20;
        let loadedShadowInt = 0.5;
        let loadedCardTrans = 40;
        let loadedAnimatedBg = "none";
        let loadedTitleColor = "accent";
        let loadedBioCardStyle = "transparent";

        try {
          const parsed = JSON.parse(bgVal);
          if (parsed && typeof parsed === "object") {
            bgVal = parsed.bg || "bg-zinc-950";
            loadedLinkStyle = parsed.linkStyle || "minimal";
            loadedAnimStrength = parsed.animationStrength ?? 0.6;
            loadedBlurAmt = parsed.blurAmount ?? 20;
            loadedShadowInt = parsed.shadowIntensity ?? 0.5;
            loadedCardTrans = parsed.cardTransparency ?? 40;
            loadedAnimatedBg = parsed.animatedBackground || "none";
            loadedTitleColor = parsed.titleColor || "accent";
            loadedBioCardStyle = parsed.bioCardStyle || "transparent";
          }
        } catch (e) {
          // Falls back to raw string (legacy layout)
        }

        setBackgroundType(bgVal);
        setLinkStyle(loadedLinkStyle);
        setAnimationStrength(loadedAnimStrength);
        setBlurAmount(loadedBlurAmt);
        setShadowIntensity(loadedShadowInt);
        setCardTransparency(loadedCardTrans);
        setAnimatedBackground(loadedAnimatedBg);
        setTitleColor(loadedTitleColor);
        setBioCardStyle(loadedBioCardStyle);
        setIsVerified(profileRow.is_verified || false);
      } else {
        // Clear forms if profile is missing, fallback to oauth values
        setDisplayName(user?.user_metadata?.full_name || user?.user_metadata?.name || "");
        setBio("");
        setLocation("");
        setWebsite("");
        setAvatarUrl(user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "");
        setIsVerified(false);
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

        const activeIndex = userTrees.findIndex(t => t.id === active.id);
        const activeTreeIsFrozen = !userIsPro && activeIndex >= 2;
        setIsActiveTreeFrozen(activeTreeIsFrozen);

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
      
      const activeIndex = updatedTrees.findIndex(t => t.id === active.id);
      const activeTreeIsFrozen = !isPro && activeIndex >= 2;
      setIsActiveTreeFrozen(activeTreeIsFrozen);

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

  const uploadAvatarFile = async (file) => {
    if (!user || !activeTree) return;
    
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
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setAvatarUrl(publicUrl);
      setToastMessage("Photo uploaded! Click 'Save Changes' to apply.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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

  const isUsingProFeatures = () => {
    const proBackgrounds = [
      "cyber-rain", "plasma-vortex", "hologram-grid", "void-nebula", "crystal-cave",
      "ember-storm", "quantum-field", "prism-aurora", "digital-rain", "cosmic-web",
      "sunbeam-rays", "sakura-petals", "cloud-drift", "pastel-waves", "morning-dew",
      "watercolor-wash", "cotton-candy", "golden-hour", "ocean-breeze", "lavender-mist"
    ];
    
    if (proBackgrounds.includes(animatedBackground)) {
      return { type: "background", name: animatedBackground };
    }

    const proThemes = [
      { name: "Neon Cyberpunk", accent: "#00f0ff", font: "font-mono", bg: "cyber-rain" },
      { name: "Midnight Amethyst", accent: "#bf5af2", font: "font-serif", bg: "void-nebula" },
      { name: "Plasma Fusion", accent: "#ff6ec7", font: "font-sans", bg: "plasma-vortex" },
      { name: "Arctic Frost", accent: "#7dd3fc", font: "font-sans", bg: "crystal-cave" },
      { name: "Inferno Dark", accent: "#ff4500", font: "font-sans", bg: "ember-storm" },
      { name: "Quantum Void", accent: "#22d3ee", font: "font-mono", bg: "quantum-field" },
      { name: "Holographic", accent: "#4f8eff", font: "font-mono", bg: "hologram-grid" },
      { name: "Rose Gold Luxe", accent: "#f4a4b8", font: "font-serif", bg: "prism-aurora" },
      { name: "Matrix Code", accent: "#00ff41", font: "font-mono", bg: "digital-rain" },
      { name: "Cosmic Architect", accent: "#a855f7", font: "font-mono", bg: "cosmic-web" },
      { name: "Sunrise Bloom", accent: "#f59e0b", font: "font-serif", bg: "sunbeam-rays" },
      { name: "Sakura Garden", accent: "#ec4899", font: "font-sans", bg: "sakura-petals" },
      { name: "Sky Canvas", accent: "#3b82f6", font: "font-sans", bg: "cloud-drift" },
      { name: "Pastel Dreams", accent: "#8b5cf6", font: "font-sans", bg: "pastel-waves" },
      { name: "Botanical Fresh", accent: "#10b981", font: "font-sans", bg: "morning-dew" },
      { name: "Watercolor Studio", accent: "#f43f5e", font: "font-serif", bg: "watercolor-wash" },
      { name: "Candy Pop", accent: "#d946ef", font: "font-sans", bg: "cotton-candy" },
      { name: "Golden Editorial", accent: "#b45309", font: "font-serif", bg: "golden-hour" },
      { name: "Ocean Calm", accent: "#0891b2", font: "font-sans", bg: "ocean-breeze" },
      { name: "Lavender Luxe", accent: "#7c3aed", font: "font-sans", bg: "lavender-mist" },
    ];

    const matchedTheme = proThemes.find(t => 
      accentColor === t.accent && 
      fontStyle === t.font && 
      animatedBackground === t.bg
    );

    if (matchedTheme) {
      return { type: "theme", name: matchedTheme.name };
    }

    return null;
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!user || !activeTree) return;

    if (isActiveTreeFrozen) {
      setShowUpgradeModal(true);
      return;
    }

    const proCheck = isUsingProFeatures();
    if (proCheck && !isPro) {
      setShowUpgradeModal(proCheck.name);
      return;
    }

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

      // Serialize advanced theme configuration into the background_type column as a JSON string
      const serializedConfig = JSON.stringify({
        bg: backgroundType,
        linkStyle,
        animationStrength,
        blurAmount,
        shadowIntensity,
        cardTransparency,
        animatedBackground,
        titleColor,
        bioCardStyle
      });

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
        background_type: serializedConfig,
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
      if (remaining.length > 0) {
        const switchTarget = remaining[0];
        await handleSwitchTree(switchTarget);
      } else {
        router.push("/dashboard/blinko-trees");
      }
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

    if (links.length >= 2 && !isPro) {
      setShowUpgradeModal(true);
      return;
    }

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
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-on-surface-variant">Loading Blinko Tree workspace...</p>
        </div>
      </div>
    );
  }

  // Active theme properties
  const activeThemeObj = themesList.find(t => t.id === selectedThemeId) || themesList[0] || {};
  const isLightBg = resolveIsLightBg(backgroundType, animatedBackground);
  
  const isGrad = backgroundType.includes("bg-gradient") || backgroundType.includes("from-");
  const previewBg = resolvePreviewBg({
    backgroundType,
    animatedBackground,
    previewBg: previewBgState || activeThemeObj?.config?.previewBg,
    isGrad,
  });
  
  const cardBgClass = isLightBg 
    ? "bg-black/5 border-black/10 text-zinc-900 shadow-sm" 
    : (activeThemeObj?.config?.previewCard || "bg-zinc-900 border-zinc-800 text-zinc-300");
  
  const btnShapeClass = 
    buttonStyle === "rounded-md" ? "rounded-10px" : 
    buttonStyle === "rounded-xl" ? "rounded-15px" : 
    buttonStyle;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Dynamic Stepper Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-black/5 pb-5 gap-4">
        <div>
          <div className="relative" style={{ display: "inline-block" }}>
            <button
              onClick={() => setSwitcherOpen(!switcherOpen)}
              className="flex items-center gap-2 rounded-lg bg-white/50 border border-black/10 px-4 py-2 text-sm font-extrabold text-on-surface hover:bg-white/80 hover:text-on-surface transition"
            >
              <GitBranch className="h-4 w-4 text-primary" />
              @{activeTree?.slug || "handle"}
              <ChevronDown className="h-3 w-3 text-on-surface-variant/80" />
            </button>

            {/* Tree Switcher Dropdown */}
            {switcherOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-xl border border-black/10 bg-white/95 p-1.5 shadow-xl backdrop-blur-md z-50 animate-in fade-in duration-200">
                <p className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest px-3 py-1.5 border-b border-black/5 mb-1">
                  Switch Active Tree
                </p>
                <div className="max-h-36 overflow-y-auto no-scrollbar space-y-0.5">
                  {trees.map(tree => (
                    <button
                      key={tree.id}
                      onClick={() => handleSwitchTree(tree)}
                      className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-left transition ${
                        tree.id === activeTree?.id
                          ? "bg-primary/10 border border-primary/15 text-primary font-bold"
                          : "text-on-surface-variant hover:bg-black/5 hover:text-on-surface border border-transparent"
                      }`}
                    >
                      <span className="truncate">@{tree.slug}</span>
                      {tree.id === activeTree?.id && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
                <div className="border-t border-black/5 my-1.5" />
                <button
                  onClick={handleCreateNewTree}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold text-primary hover:bg-primary/10 hover:text-primary transition text-left cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create New Tree
                  {!isPro && trees.length >= 2 && <Lock className="h-3 w-3 text-on-surface-variant/50" />}
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-on-surface-variant/85 mt-2 font-medium">Build, customize theme styles, and manage links for this public bio tree.</p>
        </div>

        {/* Global Action Controls */}
        <div className="flex gap-2">
          <a
            href={`/${activeTree?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white/50 px-3.5 py-1.5 text-xs font-semibold text-on-surface hover:bg-white/80 hover:text-on-surface transition"
          >
            <Eye className="h-3.5 w-3.5" />
            View Public Page
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primary/90 transition cursor-pointer disabled:opacity-50"
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
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-emerald-250 bg-white px-4 py-3 text-sm text-emerald-700 shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid: Editor + Simulator */}
      <div className="grid gap-8 lg:grid-cols-5 items-start">
        
        {/* Workspace Configurations (Left 3 cols) */}
        <div className="lg:col-span-3 space-y-6 relative">
          {/* Locked Blocker Overlay for Frozen Trees */}
          {isActiveTreeFrozen && (
            <div className="absolute inset-0 bg-[#fffcf7]/75 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center rounded-[32px] border border-white/60 shadow-lg animate-in fade-in duration-300">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/15 to-rose-600/10 text-rose-600 mb-5 relative shadow-sm border border-rose-500/10">
                <span className="absolute inset-0 rounded-full bg-rose-500/5 animate-pulse" />
                <Lock className="h-6 w-6 relative z-10 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-on-surface font-display-xl">🔒 Blinko Tree Frozen</h3>
              <p className="text-xs text-on-surface-variant/80 mt-3 max-w-sm mx-auto leading-relaxed font-body-md">
                This Blinko Tree is frozen because your current account has exceeded the free plan limit of 2 trees.
                Move to Pro plan to reactivate this page and resume custom edits.
              </p>
              <div className="mt-6 flex flex-col gap-2.5 w-full max-w-xs">
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-container text-sm font-bold text-white hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-md cursor-pointer"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          )}
          
          {/* Tab buttons switcher */}
          <div className="flex border-b border-black/5 pb-px gap-4 overflow-x-auto no-scrollbar">
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
                      ? "border-primary text-primary"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: Profile customization info (mockup redesign) */}
          {activeTab === "profile" && (
            <div className="relative overflow-hidden bg-gradient-to-br from-[#818cf8]/15 via-[#c084fc]/10 to-[#22d3ee]/15 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 space-y-6 animate-in fade-in duration-300">
              
              {/* Card 1: Avatar Upload Card */}
              <div className="bg-white/45 border border-white/60 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center gap-4.5 shadow-sm text-center">
                <div className="relative shrink-0">
                  {/* Avatar ring shadow glow */}
                  <div className="absolute -inset-0.5 rounded-full bg-white opacity-40 blur-sm" />
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
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
                
                {/* Upload action buttons row */}
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

              {/* Card 2: Content Details Card */}
              <div className="bg-white/45 border border-white/60 backdrop-blur-md rounded-2xl p-6 space-y-5 shadow-sm">
                
                {/* Display Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-xs font-semibold text-zinc-800 outline-none transition focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 shadow-sm"
                  />
                </div>

                {/* Personal Link (Username Slug) */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                    Personal Link
                  </label>
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 flex items-center rounded-xl border border-black/5 bg-white overflow-hidden shadow-sm">
                      <span className="pl-4 py-3 text-xs font-semibold text-zinc-400 select-none">
                        blinko.site/
                      </span>
                      <input
                        type="text"
                        value={treeSlug}
                        onChange={(e) => setTreeSlug(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                        className="w-full bg-transparent pr-4 py-3 text-xs font-bold text-violet-600 outline-none"
                      />
                    </div>
                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`blinko.site/${treeSlug}`);
                        alert("Link copied to clipboard!");
                      }}
                      className="p-3 bg-white border border-black/5 rounded-xl hover:bg-zinc-50 transition shadow-sm text-zinc-500 shrink-0 cursor-pointer"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {/* Generate Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const rand = Math.random().toString(36).substring(7);
                        setTreeSlug(rand);
                      }}
                      className="px-4 py-3 bg-violet-500/10 border border-violet-500/20 text-[#8b5cf6] font-bold rounded-xl text-xs hover:bg-violet-500/20 transition shrink-0 cursor-pointer shadow-sm"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                {/* Biography Section */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                      Bio
                    </label>
                    <span className={`text-[10px] font-semibold ${bio.length >= 160 ? 'text-rose-500 font-bold' : 'text-zinc-400'}`}>
                      {bio.length} / 160
                    </span>
                  </div>
                  <div className="relative w-full">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value.slice(0, 160))}
                      rows="3"
                      placeholder="Tell the world who you are."
                      className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 pb-12 text-xs font-medium text-zinc-700 outline-none transition focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 shadow-sm resize-none"
                    />
                    {/* AI Rewrite sparks badge */}
                    <button
                      type="button"
                      onClick={() => {
                        const rewrites = [
                          "Developer & designer crafting clean tools. Nice to meet you!",
                          "Passionate builder exploring UI design, code, and user experience.",
                          "Full-stack explorer creating functional web apps and digital portfolios."
                        ];
                        setBio(rewrites[Math.floor(Math.random() * rewrites.length)]);
                      }}
                      className="absolute bottom-3 right-3 flex items-center gap-1 px-3 py-1.5 bg-violet-50 text-[#8b5cf6] font-bold rounded-lg text-[9px] hover:bg-violet-100 transition cursor-pointer shadow-sm"
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      AI Rewrite
                    </button>
                  </div>
                </div>

                {/* Location and Website */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                      Location
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-xs font-medium text-zinc-800 outline-none transition focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                      Website
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="e.g. lenny.design"
                      className="w-full rounded-xl border border-black/5 bg-white px-4 py-3 text-xs font-medium text-zinc-800 outline-none transition focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 shadow-sm"
                    />
                  </div>
                </div>

              </div>
              
              {/* Visual spacer for Identity Tags */}
              <div className="text-center pt-2 select-none">
                <span className="text-[10px] font-bold tracking-widest text-zinc-500/70 uppercase">
                  Identity Tags
                </span>
              </div>

            </div>
          )}

          {/* TAB 2: Links setup & visibility options */}
          {activeTab === "links" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex justify-between items-center bg-white/50 p-4 border border-black/5 rounded-xl">
                <div>
                  <h3 className="text-sm font-semibold text-on-surface">Manage Links</h3>
                  <p className="text-xs text-on-surface-variant/70 mt-0.5">Customize redirect buttons on your profile page.</p>
                </div>
                <button
                  onClick={() => setIsAddingLink(!isAddingLink)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-extrabold bg-primary hover:bg-primary/95 text-white transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Link
                </button>
              </div>

              {/* Add New Link Drawer */}
              {isAddingLink && (
                <DashboardCard className="border-black/5 bg-white/60 animate-in slide-in-from-top-4 duration-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Configure New Link</h4>
                  
                  <form onSubmit={handleAddLink} className="space-y-4">
                    <div>
                      <label className="block text-xs text-on-surface-variant mb-1.5 font-medium">Link Preset Template</label>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar border border-black/5 rounded-lg p-2 bg-black/5">
                        {LINK_TYPES.map(type => (
                          <button
                            key={type.type}
                            type="button"
                            onClick={() => handleLinkTypeChange(type)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold transition border ${
                              selectedLinkType.type === type.type
                                ? "bg-primary/10 border-primary/20 text-primary"
                                : "border-transparent text-on-surface-variant hover:bg-black/5"
                            }`}
                          >
                            {type.type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <label className="block text-xs text-on-surface-variant mb-1.5 font-medium">Title</label>
                        <input
                          type="text"
                          value={newLinkTitle}
                          onChange={(e) => setNewLinkTitle(e.target.value)}
                          required
                          className="w-full rounded-lg border border-black/10 bg-white/45 px-3 py-1.5 text-xs text-on-surface outline-none focus:border-primary/50 focus:ring-primary/15"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-on-surface-variant mb-1.5 font-medium">Destination URL</label>
                        <input
                          type="url"
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          required
                          className="w-full rounded-lg border border-black/10 bg-white/45 px-3 py-1.5 text-xs text-on-surface outline-none focus:border-primary/50 focus:ring-primary/15"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4 items-end bg-black/5 p-3 rounded-lg border border-black/5">
                      <div>
                        <label className="block text-xs text-on-surface-variant mb-1 font-medium">Shape</label>
                        <select
                          value={newLinkButtonStyle}
                          onChange={(e) => setNewLinkButtonStyle(e.target.value)}
                          className="w-full rounded-lg border border-black/10 bg-white/45 px-2 py-1 text-xs text-on-surface outline-none"
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
                        <label htmlFor="featured_check_new" className="text-xs text-on-surface-variant font-medium">Featured</label>
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
                <div className="rounded-xl border border-black/5 bg-white/40 p-8 text-center text-on-surface-variant/80 text-xs italic">
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
                        className="rounded-xl border border-black/5 bg-white/40 p-4 space-y-3 hover:border-primary/20 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Order arrows */}
                            <div className="flex flex-col gap-1 pr-1 shrink-0">
                              <button
                                onClick={() => handleLinkReorder(index, "up")}
                                disabled={index === 0}
                                className="p-0.5 rounded bg-black/5 text-on-surface-variant/70 hover:bg-black/10 hover:text-on-surface disabled:opacity-30 transition"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleLinkReorder(index, "down")}
                                disabled={index === links.length - 1}
                                className="p-0.5 rounded bg-black/5 text-on-surface-variant/70 hover:bg-black/10 hover:text-on-surface disabled:opacity-30 transition"
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
                                  className="rounded border border-black/10 bg-white/45 px-2 py-1 text-xs text-on-surface"
                                />
                                <input
                                  type="url"
                                  value={editLinkUrl}
                                  onChange={(e) => setEditLinkUrl(e.target.value)}
                                  className="rounded border border-black/10 bg-white/45 px-2 py-1 text-xs text-on-surface"
                                />
                              </div>
                            ) : (
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="rounded bg-white/60 p-1 text-primary border border-black/5">
                                    <LinkIconComponent className="h-3.5 w-3.5" style={{ color: accentColor }} />
                                  </span>
                                  <span className="text-xs font-bold text-on-surface truncate max-w-[150px]">{link.title}</span>
                                  {link.featured && (
                                    <span className="text-[9px] font-bold text-primary bg-primary/10 px-1 rounded border border-primary/15">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-on-surface-variant/70 truncate max-w-[220px] mt-1 pl-7">{link.url}</p>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Click stats count */}
                            <span className="text-[10px] font-mono text-on-surface-variant/70 pr-1 select-none flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              {link.click_count || 0} clicks
                            </span>

                            {/* Visibility active status toggle */}
                            <button
                              onClick={() => handleToggleLinkActive(link)}
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold border transition ${
                                link.active
                                  ? "bg-emerald-55/70 border-emerald-100 text-emerald-700 hover:bg-emerald-55/90"
                                  : "bg-black/5 border-transparent text-on-surface-variant/80 hover:bg-black/10"
                              }`}
                            >
                              {link.active ? "Active" : "Hidden"}
                            </button>

                            {/* Edit/Delete controls */}
                            {isEditing ? (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleSaveEditLink(link.id)}
                                  className="rounded p-1 bg-emerald-55/70 text-emerald-700 hover:bg-emerald-55/95"
                                  disabled={saving}
                                >
                                  <Check className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => setEditingLinkId(null)}
                                  className="rounded p-1 bg-black/5 text-on-surface-variant hover:text-on-surface"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleStartEditLink(link)}
                                  className="rounded p-1 hover:bg-black/5 text-on-surface-variant hover:text-on-surface"
                                  title="Edit"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteLink(link.id)}
                                  className="rounded p-1 hover:bg-rose-50/10 text-on-surface-variant hover:text-rose-600"
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
            <ThemeCustomizer
              themesList={themesList}
              selectedThemeId={selectedThemeId}
              onChangeTheme={(theme) => setSelectedThemeId(theme ? theme.id : null)}
              accentColor={accentColor}
              setAccentColor={setAccentColor}
              buttonStyle={buttonStyle}
              setButtonStyle={setButtonStyle}
              fontStyle={fontStyle}
              setFontStyle={setFontStyle}
              backgroundType={backgroundType}
              setBackgroundType={setBackgroundType}
              setPreviewBg={setPreviewBgState}
              isPro={isPro}
              setShowUpgradeModal={setShowUpgradeModal}
              linkStyle={linkStyle}
              setLinkStyle={setLinkStyle}
              animationStrength={animationStrength}
              setAnimationStrength={setAnimationStrength}
              blurAmount={blurAmount}
              setBlurAmount={setBlurAmount}
              shadowIntensity={shadowIntensity}
              setShadowIntensity={setShadowIntensity}
              cardTransparency={cardTransparency}
              setCardTransparency={setCardTransparency}
              animatedBackground={animatedBackground}
              setAnimatedBackground={setAnimatedBackground}
              titleColor={titleColor}
              setTitleColor={setTitleColor}
              bioCardStyle={bioCardStyle}
              setBioCardStyle={setBioCardStyle}
            />
          )}

          {/* TAB 4: Social connections list */}
          {activeTab === "socials" && (
            <DashboardCard className="space-y-4">
              <h3 className="text-base font-semibold text-on-surface">Social Integrations</h3>
              <p className="text-xs text-on-surface-variant/75 mb-2">Connect social channels URLs to display them directly above links.</p>
              
              {Object.keys(socials).map((platform) => (
                <div key={platform}>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 capitalize">
                    {platform} URL
                  </label>
                  <input
                    type="url"
                    placeholder={`https://${platform}.com/username`}
                    value={socials[platform]}
                    onChange={(e) => setSocials(prev => ({ ...prev, [platform]: e.target.value }))}
                    className="w-full rounded-lg border border-black/10 bg-white/45 px-3.5 py-2 text-xs text-on-surface outline-none focus:border-primary/50 focus:ring-primary/15"
                  />
                </div>
              ))}
            </DashboardCard>
          )}

          {/* TAB 5: Settings, Custom Domain, Deletion */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <DashboardCard className="space-y-4">
                <h3 className="text-base font-semibold text-on-surface">Tree Metadata Settings</h3>
                
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Tree Name (Internal reference)</label>
                  <input
                    type="text"
                    value={treeName}
                    onChange={(e) => setTreeName(e.target.value)}
                    required
                    placeholder="e.g. My Developer page"
                    className="w-full rounded-lg border border-black/10 bg-white/45 px-3.5 py-2 text-xs text-on-surface outline-none focus:border-primary/50 focus:ring-primary/15"
                  />
                </div>

                {/* Custom Domains - Locked feature */}
                <div onClick={() => !isPro && setShowUpgradeModal(true)}>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-medium text-on-surface-variant flex items-center gap-1.5">
                      Custom Domain
                      {!isPro && <Lock className="h-3 w-3 text-on-surface-variant/50" />}
                    </label>
                    {!isPro && <span className="text-[9px] font-bold text-primary tracking-wider">PRO ONLY</span>}
                  </div>
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => isPro && setCustomDomain(e.target.value)}
                    disabled={!isPro}
                    placeholder={isPro ? "e.g. yourname.com" : "🔒 yourname.com (Upgrade to customize)"}
                    className={`w-full rounded-lg border border-black/10 bg-white/45 px-3.5 py-2 text-xs outline-none ${
                      !isPro ? "cursor-not-allowed select-none opacity-60 text-on-surface-variant/50 bg-black/5 border-black/5" : "text-on-surface focus:border-primary/50 focus:ring-primary/15"
                    }`}
                  />
                </div>
              </DashboardCard>

              {/* Danger Zone */}
              <DashboardCard className="border-rose-200 bg-rose-55/40 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-rose-700">Danger Zone</h3>
                <p className="text-xs text-rose-600 leading-relaxed">
                  Deleting this Blinko Tree will permanently remove it from the platform along with all customized links and visitor analytics logs. 
                  This action is irreversible.
                </p>
                <button
                  type="button"
                  onClick={handleDeleteTree}
                  className="rounded-lg bg-rose-700 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-800 transition cursor-pointer"
                >
                  Delete Blinko Tree
                </button>
              </DashboardCard>
            </div>
          )}

        </div>

        {/* Live Simulator Panel (Right 2 cols) */}
        <div className="lg:col-span-2 flex flex-col items-center lg:sticky lg:top-24 h-fit pt-6">
          {/* Ambient Dynamic Backglow Container */}
          <div className="relative w-full max-w-[310px] group">
            {/* Floating Live Simulator Badge */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1.5 bg-white/85 backdrop-blur-md border border-white/60 shadow-sm rounded-full text-[10px] font-bold text-on-surface-variant/95 tracking-wide select-none z-30 shadow-black/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
              LIVE PREVIEW
            </div>

            {/* Physical Hardware Buttons Simulation */}
            <div className="absolute top-14 -left-[2px] w-[3px] h-4 bg-zinc-800 border-l border-y border-zinc-700/80 rounded-l-xs z-0" />
            <div className="absolute top-22 -left-[2px] w-[3px] h-8 bg-zinc-800 border-l border-y border-zinc-700/80 rounded-l-xs z-0" />
            <div className="absolute top-32 -left-[2px] w-[3px] h-8 bg-zinc-800 border-l border-y border-zinc-700/80 rounded-l-xs z-0" />
            <div className="absolute top-26 -right-[2px] w-[3px] h-12 bg-zinc-800 border-r border-y border-zinc-700/80 rounded-r-xs z-0" />

            {/* Dynamic shadow wrapper representing ambient glow */}
            <div 
              className="relative w-full aspect-[9/18] rounded-[44px] border-[10px] border-zinc-950 bg-zinc-950 p-[3px] ring-1 ring-zinc-800/85 flex flex-col justify-between overflow-hidden transition-all duration-500 z-10 shadow-2xl shadow-violet-950/20"
              style={{ 
                boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 35px ${accentColor}1c`
              }}
            >
              {/* Dynamic Island pill notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-5 w-24 rounded-full bg-black border border-white/5 z-20 flex items-center justify-between px-2.5 shadow-md">
                <div className="w-1.5 h-1.5 rounded-full bg-[#070b19] border border-white/5 relative flex items-center justify-center">
                  <span className="absolute w-[3px] h-[3px] rounded-full bg-cyan-400/40 blur-[0.5px]" />
                </div>
                <div className="w-8 h-1 rounded-full bg-zinc-900/40" />
              </div>

              {/* Simulated Screen Body */}
              <div 
                className={`h-full flex flex-col justify-between transition-colors duration-500 overflow-hidden rounded-[38px] ${backgroundType !== "animated" ? backgroundType : ""} ${fontStyle} relative`}
                style={{ backgroundColor: animatedBackground && animatedBackground !== "none" ? "transparent" : previewBg }}
              >
                {/* Visual Locked Screen inside Simulator */}
                {isActiveTreeFrozen && (
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center p-4 text-center select-none text-white animate-in fade-in duration-200">
                    <div className="h-10 w-10 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-3 shadow-md relative">
                      <span className="absolute inset-0 rounded-full bg-rose-500/5 animate-pulse" />
                      <Lock className="h-4 w-4 relative z-10" />
                    </div>
                    <h4 className="text-[11px] font-extrabold tracking-tight">Blinko Tree Frozen</h4>
                    <p className="text-[9px] text-zinc-400 mt-1 max-w-[170px] leading-relaxed">
                      Move to Pro plan to unlock your Blinko Tree.
                    </p>
                  </div>
                )}
                {/* Animated Background in Preview */}
                {animatedBackground && animatedBackground !== "none" && (
                  <AnimatedBackground 
                    backgroundId={animatedBackground} 
                    animationStrength={animationStrength}
                    className="rounded-[38px]"
                  />
                )}
                {/* Top Status Bar */}
                <div className={`h-8 pt-3 px-6 flex items-center justify-between text-[9px] font-bold z-15 w-full select-none ${
                  isLightBg ? "text-zinc-800" : "text-zinc-200"
                }`}>
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-end gap-[1.5px] h-1.5">
                      <span className={`w-[1.5px] h-[3px] rounded-2xs ${isLightBg ? "bg-zinc-800" : "bg-white"}`}></span>
                      <span className={`w-[1.5px] h-[4.5px] rounded-2xs ${isLightBg ? "bg-zinc-800" : "bg-white"}`}></span>
                      <span className={`w-[1.5px] h-[6px] rounded-2xs ${isLightBg ? "bg-zinc-800" : "bg-white"}`}></span>
                      <span className={`w-[1.5px] h-[7.5px] rounded-2xs opacity-40 ${isLightBg ? "bg-zinc-800" : "bg-white"}`}></span>
                    </div>
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M12 20h.01M8.5 16.5a5 5 0 017 0M5 13a10 10 0 0114 0M1.5 9.5a15 15 0 0121 0" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex items-center gap-[0.5px]">
                      <div className={`w-[15px] h-2 rounded-[3px] border p-[0.7px] flex ${isLightBg ? "border-zinc-800" : "border-white/80"}`}>
                        <div className={`h-full w-4/5 rounded-[1px] ${isLightBg ? "bg-zinc-800" : "bg-white"}`}></div>
                      </div>
                      <div className={`w-[1px] h-1 rounded-r-xs ${isLightBg ? "bg-zinc-800" : "bg-white/80"}`}></div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Viewport Section */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-1 flex flex-col items-center animate-in fade-in duration-300">
                  {/* User Avatar with outer ring */}
                  <div 
                    className="relative p-1 rounded-full border border-dashed transition-all duration-300 mb-3 mt-1 scale-95" 
                    style={{ borderColor: `${accentColor}40` }}
                  >
                    <div className="p-0.5 rounded-full border transition-all duration-300" style={{ borderColor: accentColor }}>
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="h-14 w-14 rounded-full object-cover shadow-sm"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-md shadow-violet-500/20 flex items-center justify-center text-base font-bold text-white">
                          {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Display Name with verified badge */}
                  <div className="flex items-center justify-center gap-1 mt-0.5 relative z-10">
                    <h4 
                      className="text-sm font-bold leading-none"
                      style={{ color: titleColor === "accent" ? accentColor : titleColor || (isLightBg ? "#18181b" : "#ffffff") }}
                    >
                      {displayName || "Display Name"}
                    </h4>
                    <svg className="w-3.5 h-3.5 text-violet-500 fill-current inline-block flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <p className="text-[9px] font-mono mt-1 relative z-10" style={{ color: accentColor }}>
                    blinko.site/{treeSlug || "handle"}
                  </p>

                  {/* Bio Paragraph */}
                  {bio && (
                    (() => {
                      const activeBioPreset = BIO_CARD_STYLES.find(s => s.id === bioCardStyle);
                      const bioCardClass = (bioCardStyle && bioCardStyle !== "transparent")
                        ? (activeBioPreset ? (isLightBg ? activeBioPreset.lightClass : activeBioPreset.darkClass) : cardBgClass)
                        : "bg-transparent border-none p-0 text-center relative z-10";

                      return (
                        <p 
                          className={`text-[10px] leading-relaxed max-w-[210px] mt-3 transition-all duration-300 relative z-10 ${
                            bioCardStyle && bioCardStyle !== "transparent" ? "p-2.5 border rounded-xl" : ""
                          } ${bioCardClass}`}
                          style={{
                            backdropFilter: bioCardStyle === "glass" && blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
                            boxShadow: bioCardStyle === "glass" && shadowIntensity > 0 ? `0 4px ${16 * shadowIntensity}px rgba(0,0,0,${shadowIntensity * 0.25})` : undefined,
                            opacity: (bioCardStyle && bioCardStyle !== "transparent" && cardTransparency) ? (0.5 + (cardTransparency / 200)) : 1,
                            color: bioCardStyle === "transparent" ? (isLightBg ? "#52525b" : "#a1a1aa") : undefined
                          }}
                        >
                          {bio}
                        </p>
                      );
                    })()
                  )}

                  {/* Badges details (Location, website) */}
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5 max-w-[220px] relative z-10">
                    {location && (
                      <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[8px] border transition-colors duration-300 ${
                        isLightBg ? "bg-black/5 text-zinc-700 border-black/10" : "bg-white/5 text-zinc-300 border-white/10"
                      }`}>
                        <MapPin className="h-2 w-2" />
                        {location}
                      </span>
                    )}
                    {website && (
                      <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[8px] border transition-colors duration-300 ${
                        isLightBg ? "bg-black/5 text-zinc-700 border-black/10" : "bg-white/5 text-zinc-300 border-white/10"
                      }`}>
                        <Globe className="h-2 w-2" />
                        Website
                      </span>
                    )}
                  </div>

                  {/* Social icons connection if configured */}
                  {Object.entries(socials).filter(([_, url]) => url && url.trim().length > 0).length > 0 && (
                    <div className="mt-3.5 flex flex-wrap justify-center gap-2 select-none relative z-10">
                      {Object.entries(socials)
                        .filter(([_, url]) => url && url.trim().length > 0)
                        .map(([platform, url]) => {
                          const SocIcon = socialIconMap[platform] || Globe;
                          return (
                            <div
                              key={platform}
                              className="h-7 w-7 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition-all duration-300"
                              style={{ color: accentColor }}
                            >
                              <SocIcon className="h-3.5 w-3.5" />
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Prepopulated links list */}
                  <div className="mt-5 w-full space-y-2 px-1 relative z-10">
                    {links.filter(l => l.active).map((link) => {
                      const LinkIcon = iconMap[link.icon] || Link2;
                      // Apply link style preset
                      const activeLinkPreset = LINK_STYLE_PRESETS.find(s => s.id === linkStyle);
                      const linkCardClass = activeLinkPreset 
                        ? (isLightBg ? activeLinkPreset.lightClass : activeLinkPreset.darkClass)
                        : cardBgClass;
                      return (
                        <div 
                          key={link.id}
                          className={`w-full flex items-center justify-between p-2.5 text-[10px] font-semibold hover:translate-y-[-1px] transition-all duration-300 ${btnShapeClass} ${linkCardClass}`}
                          style={{
                            backdropFilter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
                            boxShadow: shadowIntensity > 0 ? `0 4px ${20 * shadowIntensity}px rgba(0,0,0,${shadowIntensity * 0.3})` : undefined,
                            opacity: cardTransparency ? (0.5 + (cardTransparency / 200)) : 1
                          }}
                        >
                          <span className="flex items-center gap-2 truncate pr-2">
                            <LinkIcon className="h-3.5 w-3.5" style={{ color: accentColor }} />
                            {link.title || "Link Title"}
                          </span>
                          <span className="text-[8px]" style={{ color: accentColor }}>→</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulator footer branding & iOS Home Indicator */}
                <div className="pt-4 pb-2 flex flex-col items-center gap-2 w-full mt-auto">
                  <div className="flex items-center justify-center gap-1 opacity-70">
                    <span className={`text-[8px] ${isLightBg ? "text-zinc-500" : "text-zinc-400"}`}>powered by</span>
                    <span className={`text-[8px] font-bold tracking-wider px-1 py-0.5 rounded border ${
                      isLightBg ? "text-zinc-900 bg-black/5 border-black/10" : "text-white bg-black/40 border-zinc-800"
                    }`}>
                      BLINKO
                    </span>
                  </div>
                  <div className={`w-20 h-1 rounded-full ${isLightBg ? "bg-zinc-800/20" : "bg-white/20"}`} />
                </div>
              </div>
            </div>
          </div>
        </div>

      <ProUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          router.push("/billing/checkout");
        }}
        previewProps={{
          accentColor,
          fontStyle,
          buttonStyle,
          backgroundType,
          previewBg,
          animatedBackground,
          animationStrength,
          blurAmount,
          shadowIntensity,
          cardTransparency,
          titleColor,
          bioCardStyle,
          linkStyle,
          displayName,
          bio,
          location,
          website,
          avatarUrl,
          handle: treeSlug,
          links,
          cardBgClass,
          iconMap,
        }}
      />

      </div>
    </div>
  );
}
