"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Check, ArrowRight, ArrowLeft, Search, Sparkles, Monitor, Loader2, 
  Copy, CheckCircle2, Share2, QrCode, Globe, MapPin, Mail, 
  ExternalLink, FileText, Play, Code, BookOpen, Layers, 
  Building, Briefcase, Music, Camera, ShoppingBag, Eye, Link2, LucideIcon 
} from "lucide-react";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../../context/AuthContext";
import ThemeCustomizer from "../../../components/theme/ThemeCustomizer";
import BlinkoLogo from "../../../components/BlinkoLogo";
import Button from "../../../components/Button";

// Custom icons mapping
const iconMap = {
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
  Link2
};

const CATEGORIES = ["All", "Tech", "Creative", "Business", "Education", "General"];

const TEMPLATES = [
  {
    id: "creator",
    name: "Creator",
    category: "Creative",
    desc: "For YouTubers, Instagram, and TikTok creators.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultLinks: [
      { title: "Watch my Latest Video", url: "https://youtube.com", icon: "Play" },
      { title: "Follow me on Instagram", url: "https://instagram.com", icon: "Link2" },
      { title: "TikTok Videos", url: "https://tiktok.com", icon: "Play" },
    ]
  },
  {
    id: "developer",
    name: "Developer",
    category: "Tech",
    desc: "For software engineers, designers, and developers.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultLinks: [
      { title: "GitHub Repositories", url: "https://github.com", icon: "Code" },
      { title: "LinkedIn Professional", url: "https://linkedin.com", icon: "Link2" },
      { title: "Download Resume", url: "https://google.com", icon: "FileText" },
      { title: "Personal Portfolio", url: "https://google.com", icon: "Globe" },
    ]
  },
  {
    id: "student",
    name: "Student",
    category: "Education",
    desc: "For college and high school students.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultLinks: [
      { title: "LinkedIn Profile", url: "https://linkedin.com", icon: "Link2" },
      { title: "My Research Projects", url: "https://google.com", icon: "BookOpen" },
      { title: "My Resume", url: "https://google.com", icon: "FileText" },
    ]
  },
  {
    id: "startup",
    name: "Startup Founder",
    category: "Business",
    desc: "For entrepreneurs and company founders.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultLinks: [
      { title: "Visit Company Website", url: "https://google.com", icon: "Building" },
      { title: "View Pitch Deck", url: "https://google.com", icon: "FileText" },
      { title: "Contact Us", url: "mailto:info@startup.com", icon: "Link2" },
    ]
  },
  {
    id: "freelancer",
    name: "Freelancer",
    category: "Business",
    desc: "For freelance writers, developers, and consultants.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultLinks: [
      { title: "My Freelance Services", url: "https://google.com", icon: "Briefcase" },
      { title: "View Portfolio Gallery", url: "https://google.com", icon: "Globe" },
      { title: "Work Testimonials", url: "https://google.com", icon: "BookOpen" },
    ]
  },
  {
    id: "musician",
    name: "Musician",
    category: "Creative",
    desc: "For bands, artists, and music creators.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultLinks: [
      { title: "Listen on Spotify", url: "https://spotify.com", icon: "Music" },
      { title: "Latest Music Video", url: "https://youtube.com", icon: "Play" },
      { title: "Upcoming Gig Tickets", url: "https://google.com", icon: "Link2" },
    ]
  },
  {
    id: "photographer",
    name: "Photographer",
    category: "Creative",
    desc: "For digital artists and photographers.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultLinks: [
      { title: "View Gallery", url: "https://unsplash.com", icon: "Camera" },
      { title: "Instagram Profile", url: "https://instagram.com", icon: "Link2" },
      { title: "Book a Shoot", url: "https://calendly.com", icon: "Briefcase" },
    ]
  },
  {
    id: "agency",
    name: "Agency",
    category: "Business",
    desc: "For design, marketing, and developer agencies.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultLinks: [
      { title: "Our Core Services", url: "https://google.com", icon: "Building" },
      { title: "Client Case Studies", url: "https://google.com", icon: "BookOpen" },
      { title: "Work with Us", url: "https://google.com", icon: "Briefcase" },
    ]
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    category: "Business",
    desc: "For Shopify and online product stores.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultLinks: [
      { title: "Shop New Products", url: "https://shopify.com", icon: "ShoppingBag" },
      { title: "Exclusive Offers", url: "https://google.com", icon: "Link2" },
      { title: "Customer Support", url: "https://google.com", icon: "Briefcase" },
    ]
  },
  {
    id: "custom",
    name: "Custom Blank",
    category: "General",
    desc: "Build your canvas layout from scratch.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultLinks: []
  }
];

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export default function OnboardingSetup() {
  const { user, profile } = useAuth();
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Selection states
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[1]); // Default Developer
  const [themesList, setThemesList] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);

  // Form inputs state
  const [treeName, setTreeName] = useState(TEMPLATES[1].name);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [links, setLinks] = useState(() => 
    TEMPLATES[1].defaultLinks.map((dl, idx) => ({
      id: `link-${idx}`,
      title: dl.title,
      url: dl.url,
      icon: dl.icon,
      position: idx,
      active: true,
      featured: false
    }))
  );

  // Checker / validation states
  const [resolvedSlug, setResolvedSlug] = useState("");
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [copyToast, setCopyToast] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Fine-tune Theme Customization States
  const [accentColor, setAccentColor] = useState("#7C3AED");
  const [buttonStyle, setButtonStyle] = useState("rounded-md");
  const [fontStyle, setFontStyle] = useState("font-sans");
  const [backgroundType, setBackgroundType] = useState("bg-zinc-950");
  const [previewBg, setPreviewBg] = useState("#09090b");

  // Fetch Themes on startup
  useEffect(() => {
    const fetchThemes = async () => {
      const { data } = await supabase.from("themes").select("*");
      if (data && data.length > 0) {
        setThemesList(data);
        // Default select first theme (Glass Aurora)
        setSelectedTheme(data[0]);
      }
    };
    fetchThemes();
  }, []);

  // Sync selected theme configuration to custom override states
  useEffect(() => {
    if (selectedTheme) {
      setAccentColor(selectedTheme.config?.accentColor || "#7C3AED");
      setButtonStyle(selectedTheme.config?.buttonStyle || "rounded-md");
      setFontStyle(selectedTheme.config?.fontFamily || "font-sans");
      setBackgroundType(selectedTheme.config?.bgClass || "bg-zinc-950");
      
      const isGrad = selectedTheme.config?.bgClass?.includes("bg-gradient") || selectedTheme.config?.bgClass?.includes("from-");
      setPreviewBg(isGrad ? "transparent" : (selectedTheme.config?.previewBg || "#09090b"));
    }
  }, [selectedTheme]);

  useEffect(() => {
    if (user) {
      if (!displayName) {
        setDisplayName(user.user_metadata?.full_name || user.user_metadata?.name || "");
      }
      if (!avatarUrl) {
        setAvatarUrl(user.user_metadata?.avatar_url || user.user_metadata?.picture || "");
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchSubscription = async () => {
        try {
          const { data: sub } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();
          
          setIsPro(sub?.status === "active");
        } catch (err) {
          console.error("Subscription Load Error:", err);
        }
      };
      fetchSubscription();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      Promise.resolve().then(() => {
        setDisplayName(displayName || profile.display_name || "");
        setUsername(username || profile.username || "");
        setBio(bio || profile.bio || "");
        setLocation(location || profile.location || "");
        setWebsite(website || profile.website || "");
        setAvatarUrl(avatarUrl || profile.avatar_url || "");
      });
    }
  }, [profile]);

  // Handle template selection changes (populate links)
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setTreeName(template.name);
    setLinks(template.defaultLinks.map((dl, idx) => ({
      id: `link-${idx}`,
      title: dl.title,
      url: dl.url,
      icon: dl.icon,
      position: idx,
      active: true,
      featured: false
    })));
  };

  // Tree Slug auto-resolution and unique check query
  useEffect(() => {
    if (!treeName) {
      Promise.resolve().then(() => {
        setResolvedSlug("");
        setSlugAvailable(false);
      });
      return;
    }

    const timer = setTimeout(async () => {
      setSlugChecking(true);
      
      const baseSlug = slugify(treeName);
      if (baseSlug.length < 3) {
        setResolvedSlug("");
        setSlugAvailable(false);
        setSlugChecking(false);
        return;
      }

      try {
        let currentSlug = baseSlug;
        let isUnique = false;
        let index = 0;
        let attempts = 0;

        while (!isUnique && attempts < 20) {
          const testSlug = index === 0 ? currentSlug : `${currentSlug}-${index}`;
          const { data, error } = await supabase
            .from("trees")
            .select("id")
            .eq("slug", testSlug)
            .maybeSingle();

          if (!data && !error) {
            currentSlug = testSlug;
            isUnique = true;
          } else {
            index++;
          }
          attempts++;
        }

        setResolvedSlug(currentSlug);
        setSlugAvailable(true);
      } catch (err) {
        console.error("Check Slug Error:", err.message || err);
      } finally {
        setSlugChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [treeName]);

  // Step 3 links handler
  const handleLinkChange = (id, field, val) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, [field]: val } : l));
  };

  // Publish flow (Write profiles, trees, links, and analytics)
  const handlePublish = async () => {
    if (!slugAvailable || !treeName || !displayName) return;
    setPublishing(true);

    try {
      // Resolve global username from profile, email, or other sources
      let finalUsername = profile?.username;
      if (!finalUsername && user) {
        const { data: userProfiles } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })
          .limit(1);

        if (userProfiles && userProfiles.length > 0 && userProfiles[0].username) {
          finalUsername = userProfiles[0].username;
        } else {
          const email = user.email || "";
          let baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
          if (baseUsername.length < 3) baseUsername = "creator";
          if (baseUsername.length > 12) baseUsername = baseUsername.slice(0, 12);

          let isUnique = false;
          let attempts = 0;
          finalUsername = baseUsername;
          while (!isUnique && attempts < 10) {
            const testUsername = attempts === 0 ? finalUsername : `${baseUsername}${Math.floor(Math.random() * 90) + 10}`;
            const { count } = await supabase
              .from("profiles")
              .select("id", { count: "exact", head: true })
              .eq("username", testUsername);

            if (count === 0) {
              finalUsername = testUsername;
              isUnique = true;
            } else {
              attempts++;
            }
          }
        }
      }

      if (!finalUsername) {
        throw new Error("Unable to resolve a username for your profile. Please check your account settings.");
      }

      // Update state for copy logic, QR codes, etc.
      setUsername(finalUsername);

      // 1. Create Tree
      const treePayload = {
        user_id: user.id,
        name: treeName.trim(),
        slug: resolvedSlug,
        theme_id: selectedTheme?.id || null,
        is_active: true,
        template_id: selectedTemplate.id,
        published: true,
      };

      const { data: tree, error: treeError } = await supabase
        .from("trees")
        .insert(treePayload)
        .select()
        .single();

      if (treeError) throw treeError;

      // 2. Update Profile details including theme selector configs
      const profilePayload = {
        tree_id: tree.id,
        user_id: user.id,
        username: finalUsername,
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        location: location.trim() || null,
        website: website.trim() || null,
        theme_id: selectedTheme?.id || null,
        accent_color: accentColor,
        button_style: buttonStyle,
        font_style: fontStyle,
        background_type: backgroundType,
        avatar_url: avatarUrl.trim() || null,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .insert(profilePayload);

      if (profileError) throw profileError;

      // 3. Clear existing links for this tree (if any) and write new ones
      const { error: deleteLinksError } = await supabase
        .from("links")
        .delete()
        .eq("tree_id", tree.id);

      if (deleteLinksError) console.error("Clean old links error:", deleteLinksError.message);

      if (links.length > 0) {
        const linksPayload = links.map((l, index) => ({
          tree_id: tree.id,
          title: l.title.trim(),
          url: l.url.trim(),
          icon: l.icon,
          position: index,
          featured: l.featured,
          active: l.active,
        }));

        const { error: linksWriteError } = await supabase
          .from("links")
          .insert(linksPayload);

        if (linksWriteError) throw linksWriteError;
      }

      // 4. Initialize analytics
      const { error: analyticsError } = await supabase
        .from("analytics")
        .upsert({ tree_id: tree.id, views: 0, clicks: 0 }, { onConflict: "tree_id" });

      if (analyticsError) console.error("Analytics init error:", analyticsError.message);

      // Successfully published! Move to final screen
      setStep(6);
    } catch (err) {
      console.error("Publishing Tree Error:", err);
      alert(err.message || "Failed to publish Blinko Tree. Please verify your fields.");
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" 
      ? `${window.location.origin}/${resolvedSlug}` 
      : `https://blinko.site/${resolvedSlug}`;
    navigator.clipboard.writeText(url);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  // Filtering Step 1 Templates
  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Render Theme configuration variables for simulator view
  const isLightBg = backgroundType === "bg-[#fff9ee]" || backgroundType === "bg-surface" || backgroundType === "bg-background" || backgroundType.includes("pink-200");
  const cardBgClass = isLightBg 
    ? "bg-black/5 border-black/10 text-zinc-900 shadow-sm" 
    : (selectedTheme?.config?.previewCard || "bg-zinc-900/60 border-zinc-800/85 text-zinc-355 backdrop-blur-md shadow-sm");
  const bgClass = backgroundType;
  const fontFamilyClass = fontStyle;
  const btnShapeClass = buttonStyle;


  return (
    <div className="min-h-screen bg-transparent text-on-background flex flex-col justify-between relative grain pb-12">
      {/* Main content body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-5 items-start">
        
        {/* Left column: Wizard configurations */}
        <section className={`lg:col-span-3 ${step === 6 ? "lg:col-span-5 max-w-xl mx-auto" : ""} space-y-6`}>
          
          {/* STEP 1: Choose Template */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-on-surface flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  Choose a Template
                </h1>
                <p className="text-sm text-on-surface-variant mt-1">Select a starting structure matching your occupation or style.</p>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/60" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-black/10 bg-white/40 py-2 pl-10 pr-4 text-xs text-on-surface outline-none transition focus:border-primary/50 focus:ring-primary/10"
                  />
                </div>
                <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
                        selectedCategory === cat 
                          ? "bg-primary/15 border border-primary/30 text-primary"
                          : "border border-black/5 text-on-surface-variant hover:bg-white/50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Gallery */}
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredTemplates.map(tpl => {
                  const isSelected = selectedTemplate.id === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`group rounded-xl border p-5 text-left transition duration-300 cursor-pointer shadow-sm ${
                        isSelected 
                          ? "border-primary bg-white/60 ring-1 ring-primary/30"
                          : "border-black/5 bg-white/35 hover:border-primary/35 hover:bg-white/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary font-mono bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                          {tpl.category}
                        </span>
                        {isSelected && (
                          <span className="rounded-full bg-primary p-0.5 text-white">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-on-surface mt-3 group-hover:text-primary transition">{tpl.name}</h3>
                      <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">{tpl.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Customize Content */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-on-surface">Customize Content</h1>
                <p className="text-sm text-on-surface-variant mt-1">Configure your handle, details, and initial biographical info.</p>
              </div>

              <div className="space-y-5 rounded-xl border border-white/60 bg-white/40 shadow-sm backdrop-blur-md p-5">
                {/* Tree Name field */}
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Tree Name</label>
                  <input
                    type="text"
                    value={treeName}
                    onChange={(e) => setTreeName(e.target.value)}
                    placeholder="e.g. Developer Portfolio"
                    required
                    className="w-full rounded-lg border border-black/10 bg-white/45 px-3.5 py-2 text-xs text-on-surface outline-none transition focus:border-primary/50 focus:ring-primary/10"
                  />
                  {/* Status Indicator */}
                  {treeName && (
                    <p className="text-[10px] mt-1.5">
                      {slugChecking ? (
                        <span className="text-on-surface-variant/75 flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin text-primary" /> Resolving unique URL slug...</span>
                      ) : resolvedSlug ? (
                        <span className="text-emerald-600 flex items-center gap-1 font-semibold"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> URL resolved: blinko.site/{resolvedSlug}</span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1 font-semibold">Please enter a valid tree name.</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Avery Stone"
                    required
                    className="w-full rounded-lg border border-black/10 bg-white/45 px-3.5 py-2 text-xs text-on-surface outline-none transition focus:border-primary/50 focus:ring-primary/10"
                  />
                </div>

                {/* Biography */}
                <div>
                  <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Bio Details</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a brief description about what you build, share, or do..."
                    rows="3"
                    className="w-full rounded-lg border border-black/10 bg-white/45 px-3.5 py-2 text-xs text-on-surface outline-none transition focus:border-primary/50 focus:ring-primary/10 resize-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Location */}
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                      className="w-full rounded-lg border border-black/10 bg-white/45 px-3.5 py-2 text-xs text-on-surface outline-none transition focus:border-primary/50 focus:ring-primary/10"
                    />
                  </div>

                  {/* Personal Website */}
                  <div>
                    <label className="block text-xs font-medium text-on-surface-variant mb-1.5">Website</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourpage.com"
                      className="w-full rounded-lg border border-black/10 bg-white/45 px-3.5 py-2 text-xs text-on-surface outline-none transition focus:border-primary/50 focus:ring-primary/10"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Add Links */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-on-surface">Template Links Setup</h1>
                <p className="text-sm text-on-surface-variant mt-1">Review and insert direct URLs for the template links configured.</p>
              </div>

              {links.length === 0 ? (
                <div className="rounded-xl border border-black/10 bg-white/40 shadow-sm p-8 text-center text-on-surface-variant text-xs">
                  This template starts with no initial links. Click next to proceed, or add customized links on the dashboard later.
                </div>
              ) : (
                <div className="space-y-4">
                  {links.map((link) => {
                    const LinkIcon = iconMap[link.icon] || Link2;
                    return (
                      <div key={link.id} className="rounded-xl border border-white/60 bg-white/40 shadow-sm backdrop-blur-md p-4 space-y-3.5">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-primary/10 border border-primary/20 p-1.5 text-primary">
                            <LinkIcon className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-xs font-bold text-on-surface">{link.title}</span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-on-surface-variant mb-1">Link Title</label>
                            <input
                              type="text"
                              value={link.title}
                              onChange={(e) => handleLinkChange(link.id, "title", e.target.value)}
                              className="w-full rounded-lg border border-black/10 bg-white/45 px-3 py-1.5 text-xs text-on-surface outline-none focus:border-primary/50 focus:ring-primary/10"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-on-surface-variant mb-1">Destination URL</label>
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => handleLinkChange(link.id, "url", e.target.value)}
                              placeholder="https://"
                              className="w-full rounded-lg border border-black/10 bg-white/45 px-3 py-1.5 text-xs text-on-surface outline-none focus:border-primary/50 focus:ring-primary/10"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Choose Theme */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-on-surface">Choose a Theme</h1>
                <p className="text-sm text-on-surface-variant mt-1">Select visual presets below, then fully customize elements using the controllers.</p>
              </div>

              <ThemeCustomizer
                themesList={themesList}
                selectedThemeId={selectedTheme?.id}
                onChangeTheme={(theme) => setSelectedTheme(theme)}
                accentColor={accentColor}
                setAccentColor={setAccentColor}
                buttonStyle={buttonStyle}
                setButtonStyle={setButtonStyle}
                fontStyle={fontStyle}
                setFontStyle={setFontStyle}
                backgroundType={backgroundType}
                setBackgroundType={setBackgroundType}
                setPreviewBg={setPreviewBg}
                isPro={isPro}
                setShowUpgradeModal={setShowUpgradeModal}
              />
            </div>
          )}

          {/* STEP 5: Review & Publish */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-on-surface">Review & Publish</h1>
                <p className="text-sm text-on-surface-variant mt-1">Confirm details and write your custom Blinko Tree configuration to live server.</p>
              </div>

              <div className="rounded-xl border border-white/60 bg-white/40 shadow-sm backdrop-blur-md p-5 space-y-4 text-xs">
                <div className="flex justify-between border-b border-black/5 pb-3">
                  <span className="text-on-surface-variant">Selected Template</span>
                  <span className="text-on-surface font-semibold">{selectedTemplate.name}</span>
                </div>
                <div className="flex justify-between border-b border-black/5 pb-3">
                  <span className="text-on-surface-variant">Public URL</span>
                  <span className="text-primary font-mono font-semibold">blinko.site/{resolvedSlug}</span>
                </div>
                <div className="flex justify-between border-b border-black/5 pb-3">
                  <span className="text-on-surface-variant">Theme selection</span>
                  <span className="text-on-surface font-semibold">{selectedTheme?.name}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-on-surface-variant">Total links</span>
                  <span className="text-on-surface font-semibold">{links.length} links</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-primary/25 bg-primary/5 text-xs text-on-surface-variant leading-relaxed">
                By clicking Publish, your page configuration becomes immediately public. You can manage analytics, reorder links, and customize theme settings anytime from your owner control panels.
              </div>
            </div>
          )}

          {/* STEP 6: Success screen */}
          {step === 6 && (
            <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/5 opacity-75" />
                <Check className="h-8 w-8" />
              </div>

              <div>
                <h1 className="text-3xl font-extrabold text-on-surface">🎉 Your Blinko Tree is Live!</h1>
                <p className="text-sm text-on-surface-variant mt-2">Share your link-in-bio page with your audience to track views and click CTR.</p>
              </div>

              {/* QR Code and Sharing Actions Card */}
              <div className="rounded-2xl border border-white/60 bg-white/40 shadow-sm backdrop-blur-md p-6 flex flex-col items-center gap-6">
                {/* Dynamic QR API Image */}
                <div className="p-4 bg-white rounded-xl shadow-inner border border-black/5 flex items-center justify-center">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(typeof window !== "undefined" ? `${window.location.origin}/${resolvedSlug}` : `https://blinko.site/${resolvedSlug}`)}`} 
                    alt="Blinko Page QR Code"
                    className="h-32 w-32 object-contain"
                  />
                </div>

                <div className="w-full space-y-3">
                  <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-2.5 font-mono text-xs text-primary select-all break-all text-center">
                    blinko.site/{resolvedSlug}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={handleCopyLink}
                      className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition cursor-pointer"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </button>
                    <a
                      href={`/${resolvedSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 items-center justify-center gap-2 rounded-lg bg-white/60 border border-black/10 text-xs font-semibold text-on-surface hover:bg-white/95 transition"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Profile
                    </a>
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                className="w-full text-on-surface-variant hover:text-on-surface text-xs font-semibold mt-4"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard Home &rarr;
              </Button>

              {/* Toast */}
              {copyToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-600 shadow-xl shadow-black/10">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Public URL copied to clipboard!</span>
                </div>
              )}
            </div>
          )}

          {/* Stepper buttons (prev / next) */}
          {step < 6 && (
            <div className="flex items-center justify-between pt-6 border-t border-black/5">
              <button
                type="button"
                onClick={() => setStep(prev => prev - 1)}
                disabled={step === 1 || publishing}
                className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant/60 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous Step
              </button>

              {/* Progress Indicator */}
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={i} 
                    className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                      step > i ? "bg-primary shadow-[0_0_8px_rgba(159,65,34,0.15)]" : "bg-black/10"
                    }`}
                  />
                ))}
              </div>

              {step < 5 ? (
                <Button
                  variant="luminous"
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => setStep(prev => prev + 1)}
                  disabled={step === 2 && (!slugAvailable || !treeName || !displayName || slugChecking)}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  variant="luminous"
                  size="sm"
                  onClick={handlePublish}
                  disabled={publishing}
                >
                  {publishing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Publishing...
                    </span>
                  ) : (
                    "Publish Tree"
                  )}
                </Button>
              )}
            </div>
          )}
        </section>

        {/* Right column: Sticky live mockup preview simulator */}
        {step < 6 && (
          <div className="lg:col-span-2 flex justify-center lg:justify-start lg:sticky lg:top-24 h-fit ml-40">
            {/* Ambient Dynamic Backglow Container */}
            <div className="relative w-full max-w-[310px] group">
              {/* Floating Live Simulator Badge */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1.5 bg-white/85 backdrop-blur-md border border-white/60 shadow-sm rounded-full text-[10px] font-bold text-on-surface-variant/95 tracking-wide select-none z-30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                LIVE PREVIEW
              </div>

              {/* Physical Hardware Buttons Simulation */}
              {/* Silent/Ring switch */}
              <div className="absolute top-14 -left-[2px] w-[3px] h-4 bg-zinc-800 border-l border-y border-zinc-700/80 rounded-l-xs z-0" />
              {/* Volume Up */}
              <div className="absolute top-22 -left-[2px] w-[3px] h-8 bg-zinc-800 border-l border-y border-zinc-700/80 rounded-l-xs z-0" />
              {/* Volume Down */}
              <div className="absolute top-32 -left-[2px] w-[3px] h-8 bg-zinc-800 border-l border-y border-zinc-700/80 rounded-l-xs z-0" />
              {/* Power button */}
              <div className="absolute top-26 -right-[2px] w-[3px] h-12 bg-zinc-800 border-r border-y border-zinc-700/80 rounded-r-xs z-0" />

              {/* Dynamic shadow wrapper representing ambient glow */}
              <div 
                className="relative w-full aspect-[9/18] rounded-[44px] border-[10px] border-zinc-950 bg-zinc-950 p-[3px] ring-1 ring-zinc-800/85 flex flex-col justify-between overflow-hidden transition-all duration-500 z-10"
                style={{ 
                  boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 35px ${accentColor}1c`
                }}
              >
                {/* Dynamic Island pill notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-5 w-24 rounded-full bg-black border border-white/5 z-20 flex items-center justify-between px-2.5 shadow-md">
                  {/* Camera lens highlight */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#070b19] border border-white/5 relative flex items-center justify-center">
                    <span className="absolute w-[3px] h-[3px] rounded-full bg-cyan-400/40 blur-[0.5px]" />
                  </div>
                  {/* Subtle sensor window */}
                  <div className="w-8 h-1 rounded-full bg-zinc-900/40" />
                </div>

                {/* Simulated Screen Body */}
                <div 
                  className={`h-full flex flex-col justify-between transition-colors duration-500 overflow-hidden rounded-[38px] ${bgClass} ${fontFamilyClass}`}
                  style={{ backgroundColor: previewBg }}
                >
                  {/* Top Status Bar */}
                  <div className={`h-8 pt-3 px-6 flex items-center justify-between text-[9px] font-bold z-15 w-full select-none ${
                    isLightBg ? "text-zinc-800" : "text-zinc-200"
                  }`}>
                    {/* Time */}
                    <span>9:41</span>

                    {/* Status Icons */}
                    <div className="flex items-center gap-1.5">
                      {/* Signal Strength */}
                      <div className="flex items-end gap-[1.5px] h-1.5">
                        <span className={`w-[1.5px] h-[3px] rounded-2xs ${isLightBg ? "bg-zinc-800" : "bg-white"}`}></span>
                        <span className={`w-[1.5px] h-[4.5px] rounded-2xs ${isLightBg ? "bg-zinc-800" : "bg-white"}`}></span>
                        <span className={`w-[1.5px] h-[6px] rounded-2xs ${isLightBg ? "bg-zinc-800" : "bg-white"}`}></span>
                        <span className={`w-[1.5px] h-[7.5px] rounded-2xs opacity-40 ${isLightBg ? "bg-zinc-800" : "bg-white"}`}></span>
                      </div>

                      {/* Wifi symbol */}
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 20h.01M8.5 16.5a5 5 0 017 0M5 13a10 10 0 0114 0M1.5 9.5a15 15 0 0121 0" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                      {/* Battery outline + fill */}
                      <div className="flex items-center gap-[0.5px]">
                        <div className={`w-[15px] h-2 rounded-[3px] border p-[0.7px] flex ${isLightBg ? "border-zinc-800" : "border-white/80"}`}>
                          <div className={`h-full w-4/5 rounded-[1px] ${isLightBg ? "bg-zinc-800" : "bg-white"}`}></div>
                        </div>
                        <div className={`w-[1px] h-1 rounded-r-xs ${isLightBg ? "bg-zinc-800" : "bg-white/80"}`}></div>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Viewport Section */}
                  <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-1 flex flex-col items-center">
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
                    <h4 className={`text-sm font-bold leading-none flex items-center gap-1 mt-0.5 ${isLightBg ? "text-zinc-900" : "text-zinc-100"}`}>
                      {displayName || "Display Name"}
                      <svg className="w-3.5 h-3.5 text-violet-500 fill-current inline-block flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </h4>
                    <p className="text-[9px] font-mono mt-1" style={{ color: accentColor }}>
                      blinko.site/{resolvedSlug || "slug"}
                    </p>

                    {/* Bio Paragraph */}
                    {bio && (
                      <p className={`text-[10px] leading-relaxed max-w-[210px] mt-3 p-2.5 border rounded-xl shadow-xs transition-all duration-300 ${cardBgClass}`}>
                        {bio}
                      </p>
                    )}

                    {/* Badges details (Location, website) */}
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5 max-w-[220px]">
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

                    {/* Prepopulated links list */}
                    <div className="mt-5 w-full space-y-2 px-1">
                      {links.filter(l => l.active).map((link) => {
                        const LinkIcon = iconMap[link.icon] || Link2;
                        return (
                          <div 
                            key={link.id}
                            className={`w-full flex items-center justify-between p-2.5 text-[10px] font-semibold border shadow-xs hover:translate-y-[-1px] transition-all duration-300 ${btnShapeClass} ${cardBgClass} ${
                              isLightBg ? "text-zinc-900 border-black/5" : "text-zinc-100 border-white/5"
                            }`}
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

                    {/* Home Indicator bar */}
                    <div className={`w-20 h-1 rounded-full ${isLightBg ? "bg-zinc-800/20" : "bg-white/20"}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FREEMIUM UPGRADE MODAL */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 select-none">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/60 bg-white/80 backdrop-blur-2xl p-6 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition cursor-pointer"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="text-xl font-extrabold text-on-surface">🚀 Unlock Unlimited Blinko Trees</h3>
            <p className="text-xs text-on-surface-variant mt-2 max-w-sm mx-auto leading-relaxed">
              Upgrade to Pro to create unlimited trees, unlock advanced premium themes, and track custom domain names.
            </p>

            {/* Benefits list */}
            <div className="mt-6 grid gap-2.5 text-left max-h-52 overflow-y-auto pr-1">
              {[
                { title: "Unlimited Blinko Trees", desc: "Create as many public pages as you want." },
                { title: "Advanced Analytics", desc: "Track Views, Clicks, CTR, Top Links, Traffic Sources, Device stats." },
                { title: "Premium Themes", desc: "Access all premium designs (Neon, Cyberpunk, Glassmorphism)." },
                { title: "Custom Domains", desc: "Use yourname.com instead of blinko.site/username." },
                { title: "Remove Blinko Branding", desc: "Remove all platform watermarks." }
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-2.5 rounded-lg border border-black/5 bg-white/50 p-2.5 text-xs">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-on-surface">{benefit.title}</h4>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{benefit.desc}</p>
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
                className="w-full flex h-11 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white hover:bg-primary/95 transition cursor-pointer shadow-sm"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full text-on-surface-variant hover:text-primary text-xs font-semibold py-2 transition cursor-pointer"
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
