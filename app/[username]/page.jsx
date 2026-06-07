"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Check, Eye, MousePointerClick, Link2, Globe, FileText, Mail,
  MapPin, ArrowUpRight, ArrowRight, Play, BookOpen, Sparkles, ChevronRight,
  Share2, Copy, CheckCircle2, Loader2, MessageSquare, DollarSign,
  TrendingUp, AlertCircle,
  Briefcase, Building, Music, Camera, ShoppingBag, Code
} from "lucide-react";
import { Github, Linkedin, Instagram, Youtube, Twitter } from "../components/dashboard/BrandIcons";
import { supabase } from "../../lib/supabase";
import AnimatedBackground from "../components/theme/AnimatedBackground";
import { LINK_STYLE_PRESETS, BIO_CARD_STYLES } from "../components/theme/themePresets";

// Brand icon SVGs defined locally
const GithubIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9" />
  </svg>
);

const TwitterIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const socialIconMap = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  twitter: TwitterIcon
};

const publicIconMap = {
  Play,
  FileText,
  Globe,
  Code,
  BookOpen,
  Building,
  Briefcase,
  Music,
  Camera,
  ShoppingBag,
  Link2,
  Youtube,
  Instagram,
  Github,
  Linkedin,
  Twitter,
  Mail
};

const platformColors = {
  Youtube: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  Play: "bg-rose-500/10 border-rose-500/20 text-rose-400",
  Instagram: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400",
  Camera: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400",
  Github: "bg-zinc-500/10 border-zinc-500/20 text-zinc-400",
  Code: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  Linkedin: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  Briefcase: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  Globe: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  Mail: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  Music: "bg-green-500/10 border-green-500/20 text-green-400",
  ShoppingBag: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  Link2: "bg-purple-500/10 border-purple-500/20 text-purple-400"
};

export default function PublicProfilePage({ params }) {
  const resolvedParams = use(params);
  const rawUsername = resolvedParams?.username || "";
  const username = rawUsername.toLowerCase();

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(true);

  // Loaded database states
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [activeTree, setActiveTree] = useState(null);
  const [links, setLinks] = useState([]);
  const [socials, setSocials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [viewsCount, setViewsCount] = useState(0);
  const [clicksCount, setClicksCount] = useState(0);
  const [theme, setTheme] = useState(null);

  // Theme Studio fields
  const [linkStyle, setLinkStyle] = useState("minimal");
  const [animatedBg, setAnimatedBg] = useState("none");
  const [animStrength, setAnimStrength] = useState(0.6);
  const [blurAmt, setBlurAmt] = useState(20);
  const [shadowInt, setShadowInt] = useState(0.5);
  const [cardTrans, setCardTrans] = useState(40);
  const [titleColor, setTitleColor] = useState("accent");
  const [bioCardStyle, setBioCardStyle] = useState("transparent");
  const [backgroundType, setBackgroundType] = useState("bg-[#0A0A0A]");

  // Action feedback states
  const [copyToast, setCopyToast] = useState(false);
  const [buyingId, setBuyingId] = useState(null);
  const [storeToast, setStoreToast] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState("");

  // Contact Form states
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle, sending, success

  useEffect(() => {
    if (!username) return;

    const loadCreatorData = async () => {
      try {
        setLoading(true);

        // 1. Fetch tree matching username as slug
        const { data: treeRow, error: treeError } = await supabase
          .from("trees")
          .select("*")
          .eq("slug", username)
          .maybeSingle();

        if (treeError || !treeRow) {
          setProfileExists(false);
          setLoading(false);
          return;
        }
        setActiveTree(treeRow);

        // 2. Fetch profile matching tree_id
        const { data: profileRow, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("tree_id", treeRow.id)
          .maybeSingle();

        if (profileError || !profileRow) {
          setProfileExists(false);
          setLoading(false);
          return;
        }
        setCreatorProfile(profileRow);

        // Load Theme Studio fields by parsing background_type column as a serialized JSON configuration
        let bgVal = profileRow.background_type || "bg-[#0A0A0A]";
        let loadedLinkStyle = "minimal";
        let loadedAnimBg = "none";
        let loadedAnimStrength = 0.6;
        let loadedBlurAmt = 20;
        let loadedShadowInt = 0.5;
        let loadedCardTrans = 40;
        let loadedTitleColor = "accent";
        let loadedBioCardStyle = "transparent";

        try {
          const parsed = JSON.parse(bgVal);
          if (parsed && typeof parsed === "object") {
            bgVal = parsed.bg || "bg-[#0A0A0A]";
            loadedLinkStyle = parsed.linkStyle || "minimal";
            loadedAnimBg = parsed.animatedBackground || "none";
            loadedAnimStrength = parsed.animationStrength ?? 0.6;
            loadedBlurAmt = parsed.blurAmount ?? 20;
            loadedShadowInt = parsed.shadowIntensity ?? 0.5;
            loadedCardTrans = parsed.cardTransparency ?? 40;
            loadedTitleColor = parsed.titleColor || "accent";
            loadedBioCardStyle = parsed.bioCardStyle || "transparent";
          }
        } catch (e) {
          // Fallback if background_type is a legacy plain string
        }

        setBackgroundType(bgVal);
        setLinkStyle(loadedLinkStyle);
        setAnimatedBg(loadedAnimBg);
        setAnimStrength(loadedAnimStrength);
        setBlurAmt(loadedBlurAmt);
        setShadowInt(loadedShadowInt);
        setCardTrans(loadedCardTrans);
        setTitleColor(loadedTitleColor);
        setBioCardStyle(loadedBioCardStyle);

        // 3. Fetch theme configuration if profileRow has theme_id
        if (profileRow.theme_id) {
          const { data: themeRow } = await supabase
            .from("themes")
            .select("*")
            .eq("id", profileRow.theme_id)
            .maybeSingle();
          setTheme(themeRow);
        }

        // Increment Views in analytics
        const { data: analRows } = await supabase
          .from("analytics")
          .select("id, views, clicks")
          .eq("tree_id", treeRow.id);

        let currentViews = 0;
        let currentClicks = 0;

        if (analRows && analRows.length > 0) {
          currentViews = analRows.reduce((sum, row) => sum + (row.views || 0), 0) + 1;
          currentClicks = analRows.reduce((sum, row) => sum + (row.clicks || 0), 0);
          
          const firstRow = analRows[0];
          await supabase
            .from("analytics")
            .update({ views: (firstRow.views || 0) + 1 })
            .eq("id", firstRow.id);
        } else {
          currentViews = 1;
          await supabase
            .from("analytics")
            .insert({ tree_id: treeRow.id, views: 1, clicks: 0 });
        }

        setViewsCount(currentViews);
        setClicksCount(currentClicks);

        // Fetch active links ordered by position index
        const { data: linksRows } = await supabase
          .from("links")
          .select("*")
          .eq("tree_id", treeRow.id)
          .eq("active", true)
          .order("position", { ascending: true });

        setLinks(linksRows || []);

        // Fetch socials, projects, and products in parallel
        const [
          { data: socialRows },
          { data: projectsRows },
          { data: productsRows }
        ] = await Promise.all([
          supabase.from("social_links").select("*").eq("tree_id", treeRow.id),
          supabase.from("portfolio_projects").select("*").eq("user_id", treeRow.user_id).order("created_at", { ascending: false }),
          supabase.from("digital_products").select("*").eq("user_id", treeRow.user_id).order("created_at", { ascending: false })
        ]);

        setSocials(socialRows || []);
        setProjects(projectsRows || []);
        setProducts(productsRows || []);

      } catch (err) {
        console.error("Public Page Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCreatorData();
  }, [username]);

  // Handle link click analytics increment
  const handleLinkClick = async (link) => {
    try {
      // 1. Increment click_count on links table row
      await supabase
        .from("links")
        .update({ click_count: (link.click_count || 0) + 1 })
        .eq("id", link.id);

      // 2. Increment clicks count in analytics table
      if (activeTree) {
        const { data: analRows } = await supabase
          .from("analytics")
          .select("id, clicks")
          .eq("tree_id", activeTree.id);

        if (analRows && analRows.length > 0) {
          const totalClicks = analRows.reduce((sum, row) => sum + (row.clicks || 0), 0) + 1;
          
          const firstRow = analRows[0];
          await supabase
            .from("analytics")
            .update({ clicks: (firstRow.clicks || 0) + 1 })
            .eq("id", firstRow.id);
          
          setClicksCount(totalClicks);
        } else {
          await supabase
            .from("analytics")
            .insert({ tree_id: activeTree.id, views: 0, clicks: 1 });
          setClicksCount(1);
        }
      }
    } catch (err) {
      console.error("Increment Clicks Error:", err);
    }
  };

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://blinko.site/${username}`;
    navigator.clipboard.writeText(url);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  const handleBuy = (id, title) => {
    setBuyingId(id);
    setTimeout(() => {
      setBuyingId(null);
      setPurchasedItem(title);
      setStoreToast(true);
      setTimeout(() => setStoreToast(false), 3000);
    }, 1200);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message || !creatorProfile) return;
    
    setFormStatus("sending");
    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert({
          user_id: creatorProfile.user_id,
          sender_name: formState.name,
          sender_email: formState.email,
          message: formState.message
        });

      if (error) throw error;
      setFormStatus("success");
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (err) {
      console.error("Submit Message Error:", err);
      setFormStatus("idle");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-violet-500 mx-auto" />
          <p className="text-xs text-zinc-400 font-medium">Resolving Blinko Tree credentials...</p>
        </div>
      </div>
    );
  }

  if (!profileExists || !creatorProfile) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col items-center justify-center px-4 py-12">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white mt-6 sm:text-2xl">Profile Not Found</h1>
        <p className="text-xs text-zinc-455 mt-2 text-center max-w-sm leading-relaxed">
          The Blinko Tree handle <span className="font-mono text-violet-400">@{username}</span> is not registered. Double check the address or sign up to claim it!
        </p>
        <Link href="/signup" className="mt-8 inline-flex items-center gap-1.5 rounded-lg bg-violet-650 px-4 py-2 text-xs font-bold text-white hover:bg-violet-600 transition">
          Claim Handle
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  // Visual Theme mapping
  const bgClass = backgroundType || "bg-[#0A0A0A]";
  const accentColor = creatorProfile.accent_color || "#7C3AED";
  const fontFamilyClass = creatorProfile.font_style || "font-sans";
  const buttonStyle = creatorProfile.button_style || "rounded-md";

  // Check if current background type matches a light theme sand/parchment style or light animated background
  const isLightBg = 
    bgClass.includes("#fff9ee") || 
    bgClass.includes("bg-surface") || 
    bgClass.includes("bg-background") || 
    bgClass.includes("pink-200") ||
    (bgClass === "animated" && (
      animatedBg === "glass-bubbles" || 
      ["sunbeam-rays", "sakura-petals", "cloud-drift", "pastel-waves", "morning-dew", "watercolor-wash", "cotton-candy", "golden-hour", "ocean-breeze", "lavender-mist"].includes(animatedBg)
    ));
  
  // Predefined or fallback cardBg
  const cardBgClass = isLightBg
    ? "bg-white/40 border border-white/60 text-zinc-900 shadow-sm backdrop-blur-md hover:bg-white/60 transition"
    : (theme?.config?.previewCard || "bg-zinc-950/60 border border-zinc-900 hover:border-violet-500/35 hover:bg-zinc-900/10 text-white");

  return (
    <div className={`min-h-screen ${bgClass} ${fontFamilyClass} ${isLightBg ? "text-zinc-800" : "text-zinc-100"} flex flex-col items-center pb-16 pt-16 px-4 relative overflow-hidden select-none`}>
      {/* Background Glows */}
      {!isLightBg && animatedBg === "none" && (
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.12),transparent_50%)] pointer-events-none" />
      )}

      {/* Animated Background */}
      {animatedBg && animatedBg !== "none" && (
        <AnimatedBackground 
          backgroundId={animatedBg} 
          animationStrength={animStrength} 
        />
      )}

      {/* Main Container */}
      <main className="w-full max-w-2xl z-10 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
        
        {/* Profile Header Block */}
        <section className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-6 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Verified Creator
          </div>

          {/* Profile Image */}
          <div className="relative mb-4">
            {!isLightBg && (
              theme?.config?.neonAvatarGlow ? (
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-90 blur-[3px] -z-10" />
              ) : (
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-indigo-500 opacity-80 blur-sm animate-spin [animation-duration:8s] -z-10" />
              )
            )}
            {creatorProfile.avatar_url ? (
              <img
                src={creatorProfile.avatar_url}
                alt={creatorProfile.display_name}
                className={`h-24 w-24 rounded-full object-cover relative ${
                  theme?.config?.neonAvatarGlow
                    ? "border-2 border-white/80 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    : isLightBg 
                      ? "border-4 border-white shadow-[0_0_15px_rgba(191,219,254,0.6)]" 
                      : "border border-zinc-800 shadow-lg"
                }`}
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 font-extrabold text-white text-3xl flex items-center justify-center relative shadow-lg shadow-violet-955/20">
                {creatorProfile.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User names */}
          <div className="flex items-center gap-1.5">
            <h1 
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: titleColor === "accent" ? accentColor : titleColor || (isLightBg ? "#18181b" : "#ffffff") }}
            >
              {creatorProfile.display_name}
            </h1>
          </div>
          <p className="text-xs font-mono font-semibold mt-1" style={{ color: accentColor }}>
            @{username}
          </p>

          {/* Bio info */}
          {creatorProfile.bio && (
            (bioCardStyle && bioCardStyle !== "transparent") ? (
              (() => {
                const activeBioPreset = BIO_CARD_STYLES.find(s => s.id === bioCardStyle);
                const bioCardClass = activeBioPreset 
                  ? (isLightBg ? activeBioPreset.lightClass : activeBioPreset.darkClass)
                  : "";
                
                return (
                  <div className={`mt-6 w-full text-left p-5 border rounded-2xl shadow-sm ${bioCardClass}`}
                       style={{
                         backdropFilter: bioCardStyle === "glass" && blurAmt > 0 ? `blur(${blurAmt}px)` : undefined,
                         boxShadow: bioCardStyle === "glass" && shadowInt > 0 ? `0 4px ${20 * shadowInt}px rgba(0,0,0,${shadowInt * 0.15})` : undefined
                       }}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2.5 opacity-80"
                         style={{ color: titleColor === "accent" ? accentColor : titleColor || undefined }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: accentColor }}>
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                      </svg>
                      About Me
                    </div>
                    <p className="text-xs leading-relaxed font-medium">
                      {creatorProfile.bio}
                    </p>
                  </div>
                );
              })()
            ) : (
              <p className={`mt-3 text-sm leading-relaxed max-w-md ${isLightBg ? "text-zinc-600 font-medium" : "text-zinc-400"}`}>
                {creatorProfile.bio}
              </p>
            )
          )}

          {/* Location */}
          {creatorProfile.location && (
            <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${isLightBg ? "text-zinc-500" : "text-zinc-400"}`}>
              <MapPin className="h-3.5 w-3.5" style={{ color: accentColor }} />
              {creatorProfile.location}
            </div>
          )}

          {/* Views & Clicks Stats */}
          <div className={`mt-8 grid grid-cols-3 gap-3 w-full sm:max-w-md border rounded-xl p-3 ${
            isLightBg ? "bg-black/5 border-black/10" : "bg-zinc-900/40 border-zinc-800"
          }`}>
            <div className="text-center">
              <span className={`flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isLightBg ? "text-zinc-500" : "text-zinc-400"}`}>
                <Eye className="h-3 w-3" style={{ color: accentColor }} />
                Views
              </span>
              <p className={`text-base font-semibold mt-1 ${isLightBg ? "text-zinc-900" : "text-zinc-250"}`}>{viewsCount.toLocaleString()}</p>
            </div>
            <div className={`text-center border-x ${isLightBg ? "border-black/10" : "border-zinc-800"}`}>
              <span className={`flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isLightBg ? "text-zinc-500" : "text-zinc-400"}`}>
                <MousePointerClick className="h-3 w-3" style={{ color: accentColor }} />
                Clicks
              </span>
              <p className={`text-base font-semibold mt-1 ${isLightBg ? "text-zinc-900" : "text-zinc-250"}`}>{clicksCount.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <span className={`flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isLightBg ? "text-zinc-500" : "text-zinc-400"}`}>
                <Link2 className="h-3 w-3" style={{ color: accentColor }} />
                Links
              </span>
              <p className={`text-base font-semibold mt-1 ${isLightBg ? "text-zinc-900" : "text-zinc-250"}`}>{links.length}</p>
            </div>
          </div>
        </section>

        {/* Social connections Row */}
        {socials.length > 0 && (
          <section className="flex justify-center gap-3">
            {socials.map((soc) => {
              const SocIcon = socialIconMap[soc.platform] || Link2;
              return (
                <a
                  key={soc.platform}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center bg-zinc-900/50 border border-zinc-800/80 rounded-full text-zinc-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-950/15 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                  aria-label={soc.platform}
                >
                  <SocIcon className="h-4.5 w-4.5" />
                </a>
              );
            })}
          </section>
        )}

        {/* Links tree list */}
        {links.length > 0 ? (
          <section className="space-y-3.5">
            {links.map((link) => {
              const target = link.open_in_new_tab !== false ? "_blank" : "_self";
              const LinkIcon = publicIconMap[link.icon] || Link2;
              // Apply link style preset
              const activeLinkPreset = LINK_STYLE_PRESETS.find(s => s.id === linkStyle);
              const linkCardStyle = activeLinkPreset 
                ? (isLightBg ? activeLinkPreset.lightClass : activeLinkPreset.darkClass)
                : cardBgClass;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={target}
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link)}
                  className={`group flex items-center gap-4 p-4 hover:shadow-lg hover:-translate-y-0.5 transition duration-300 relative overflow-hidden ${buttonStyle} ${linkCardStyle}`}
                  style={{
                    backdropFilter: blurAmt > 0 ? `blur(${blurAmt}px)` : undefined,
                    boxShadow: shadowInt > 0 ? `0 4px ${20 * shadowInt}px rgba(0,0,0,${shadowInt * 0.3})` : undefined
                  }}
                >
                  {/* Left accent color strip */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: accentColor }} />
                  
                  <div className={
                    theme?.config?.usePlatformIconColors
                      ? `rounded-full p-2 border ${platformColors[link.icon] || "bg-purple-500/10 border-purple-500/20 text-purple-400"}`
                      : `rounded-lg p-2 transition-colors ${
                          isLightBg ? "bg-black/5 border border-black/10" : "bg-zinc-900 border border-zinc-800"
                        }`
                  }>
                    <LinkIcon className="h-5 w-5" style={{ color: theme?.config?.usePlatformIconColors ? undefined : accentColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-semibold transition-colors ${isLightBg ? "text-zinc-900 group-hover:text-zinc-700" : "text-white group-hover:text-violet-300"}`}>
                      {link.title}
                    </h3>
                    <p className={`text-xs mt-0.5 leading-relaxed truncate pr-4 ${isLightBg ? "text-zinc-600" : "text-zinc-400"}`}>{link.url}</p>
                  </div>
                  {theme?.config?.usePlatformIconColors ? (
                    <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 transition duration-300 shrink-0" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-violet-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300 shrink-0" />
                  )}
                </a>
              );
            })}
          </section>
        ) : (
          <div className={`rounded-xl border p-8 text-center text-xs italic ${
            isLightBg ? "border-black/10 bg-white/40 text-zinc-500" : "border-zinc-900 bg-zinc-950/45 text-zinc-400"
          }`}>
            This Blinko Tree has no active links published yet.
          </div>
        )}

        {/* Portfolio Showcase Grid */}
        {projects.length > 0 && (
          <section className="space-y-4">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isLightBg ? "text-zinc-600" : "text-zinc-400"}`}>Featured Projects</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className={`group flex flex-col justify-between rounded-xl border p-4 transition duration-300 ${
                    isLightBg 
                      ? "bg-white/40 border-white/60 hover:border-black/20 hover:shadow-md" 
                      : "border-zinc-900 bg-zinc-900 p-4 hover:border-violet-500/25 hover:shadow-lg"
                  }`}
                >
                  <div>
                    {/* Project preview header */}
                    <div className="h-24 w-full rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 mb-3 flex items-center justify-center border border-zinc-900 shadow-inner relative overflow-hidden group-hover:opacity-90 transition">
                      <Sparkles className="h-7 w-7 text-white/40 drop-shadow" />
                    </div>
                    <h3 className={`text-sm font-semibold ${isLightBg ? "text-zinc-900" : "text-white"}`}>{proj.title}</h3>
                    <p className={`text-xs mt-1 leading-normal ${isLightBg ? "text-zinc-600" : "text-zinc-500"}`}>{proj.description}</p>
                  </div>
                  
                  {proj.project_url && (
                    <div className="mt-4">
                      <a
                        href={proj.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold hover:underline"
                        style={{ color: accentColor }}
                      >
                        Visit Project
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Digital Products Store */}
        {products.length > 0 && (
          <section className="space-y-4">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${isLightBg ? "text-zinc-600" : "text-zinc-400"}`}>Digital Store</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {products.map((prod) => {
                const isBuying = buyingId === prod.id;
                return (
                  <div
                    key={prod.id}
                    className={`flex flex-col justify-between rounded-xl border p-4 transition duration-300 ${
                      isLightBg 
                        ? "bg-white/40 border-white/60 hover:border-black/20" 
                        : "border-zinc-900 bg-zinc-900 hover:border-violet-500/20"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="rounded bg-violet-500/10 border px-1.5 py-0.5 text-[10px] font-bold font-mono" style={{ color: accentColor, borderColor: `${accentColor}33` }}>
                          ${prod.price || "5"}
                        </span>
                      </div>
                      <h3 className={`text-xs font-semibold ${isLightBg ? "text-zinc-900" : "text-white"}`}>{prod.title}</h3>
                      <p className={`text-[10px] mt-1 leading-normal ${isLightBg ? "text-zinc-600" : "text-zinc-500"}`}>{prod.description}</p>
                    </div>
                    
                    <div className="mt-4">
                      <button
                        onClick={() => handleBuy(prod.id, prod.title)}
                        disabled={buyingId !== null}
                        className={`w-full rounded-lg py-1.5 text-[10px] font-bold transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 border ${
                          isLightBg
                            ? "border-black/10 bg-black/5 text-zinc-700 hover:bg-black/10 hover:text-zinc-900"
                            : "border-zinc-800 bg-zinc-900 text-zinc-350 hover:border-violet-500/50 hover:bg-violet-950/10 hover:text-violet-300"
                        }`}
                      >
                        {isBuying ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Checkout...
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-3 w-3" />
                            Buy Product
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Contact Form Section */}
        <section className={`rounded-xl border p-6 space-y-4 ${
          isLightBg ? "bg-white/40 border-white/60 shadow-sm" : "border-zinc-900 bg-zinc-900"
        }`}>
          <div>
            <h3 className={`text-sm font-semibold flex items-center gap-2 ${isLightBg ? "text-zinc-900" : "text-white"}`}>
              <MessageSquare className="h-4 w-4" style={{ color: accentColor }} />
              Get in Touch
            </h3>
            <p className={`text-xs mt-0.5 ${isLightBg ? "text-zinc-500" : "text-zinc-400"}`}>Send a message directly to my creator inbox.</p>
          </div>

          {formStatus === "success" ? (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-center text-xs text-emerald-400 animate-in fade-in duration-300">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-emerald-400 animate-bounce" />
              <p className="font-semibold">Thank you for your message!</p>
              <p className={`${isLightBg ? "text-zinc-600" : "text-zinc-500"} mt-1`}>Your message has been delivered to my private owner inbox.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className={`w-full rounded-lg px-3.5 py-2 text-xs outline-none transition border ${
                    isLightBg
                      ? "border-black/10 bg-white/50 text-zinc-900 focus:border-zinc-400 focus:bg-white"
                      : "border-zinc-900 bg-zinc-900/20 text-zinc-200 focus:border-violet-500/50 focus:bg-zinc-900/40"
                  }`}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className={`w-full rounded-lg px-3.5 py-2 text-xs outline-none transition border ${
                    isLightBg
                      ? "border-black/10 bg-white/50 text-zinc-900 focus:border-zinc-400 focus:bg-white"
                      : "border-zinc-900 bg-zinc-900/20 text-zinc-200 focus:border-violet-500/50 focus:bg-zinc-900/40"
                  }`}
                />
              </div>
              <textarea
                placeholder="Write your message..."
                required
                rows="3"
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className={`w-full rounded-lg px-3.5 py-2 text-xs outline-none transition resize-none border ${
                  isLightBg
                    ? "border-black/10 bg-white/50 text-zinc-900 focus:border-zinc-400 focus:bg-white"
                    : "border-zinc-900 bg-zinc-900/20 text-zinc-200 focus:border-violet-500/50 focus:bg-zinc-900/40"
                }`}
              />
              <button
                type="submit"
                disabled={formStatus === "sending"}
                className="w-full rounded-lg py-2.5 text-xs font-bold text-white hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-1.5"
                style={{ backgroundColor: accentColor }}
              >
                {formStatus === "sending" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Delivering...
                  </>
                ) : (
                  <>
                    <Mail className="h-3.5 w-3.5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* CTA Banner Section */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 text-center text-white shadow-xl shadow-violet-955/20">
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <h3 className="text-lg font-bold tracking-tight">Create your own Blinko page</h3>
          <p className="mt-1 text-xs text-violet-100 max-w-sm mx-auto">
            Design dynamic visual link trees, portfolio showcases, and AI bio drafts in seconds.
          </p>
          <div className="mt-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-50 transition"
            >
              Get Started Free
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className={`text-center pt-8 border-t space-y-4 ${isLightBg ? "border-black/5" : "border-zinc-900/75"}`}>
          <div className="flex items-center justify-center gap-1.5 opacity-70">
            <span className={`text-[10px] ${isLightBg ? "text-zinc-500" : "text-zinc-400"}`}>powered by</span>
            <Link
              href="/"
              className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded border transition ${
                isLightBg 
                  ? "text-zinc-900 bg-black/5 border-black/10 hover:bg-black/10" 
                  : "text-white bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700"
              }`}
            >
              BLINKO
            </Link>
          </div>
        </footer>

      </main>

      {/* Floating Share Control Bar */}
      <div className={`fixed bottom-6 z-40 flex items-center gap-2 rounded-full border p-1.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-12 duration-500 ${
        isLightBg ? "border-black/10 bg-white/90 shadow-zinc-200/50" : "border-zinc-800 bg-zinc-950/90 shadow-black"
      }`}>
        <button
          onClick={handleCopyLink}
          className="flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold hover:opacity-90 transition cursor-pointer text-white"
          style={{ backgroundColor: accentColor }}
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Copy Page Link</span>
        </button>
        <button
          onClick={handleCopyLink}
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition cursor-pointer ${
            isLightBg ? "bg-black/5 border-black/10 text-zinc-650 hover:text-zinc-900 hover:bg-black/10" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
          }`}
          aria-label="Share profile"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Notification Toast */}
      {copyToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-emerald-400 shadow-xl shadow-black animate-in fade-in zoom-in-95">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Page URL copied to clipboard!</span>
        </div>
      )}
    </div>
  );
}
