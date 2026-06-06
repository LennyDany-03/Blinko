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

  // Pre-fill fields from profile or Google metadata on mount / auth change
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
  const isLightBg = backgroundType === "bg-[#fff9ee]" || backgroundType === "bg-surface" || backgroundType === "bg-background";
  const cardBgClass = isLightBg 
    ? "bg-black/5 border-black/10 text-zinc-900" 
    : (selectedTheme?.config?.previewCard || "bg-zinc-900 border-zinc-800 text-zinc-300");
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

              <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                {themesList.map((theme) => {
                  const isSelected = selectedTheme?.id === theme.id;
                  const isGrad = theme.config?.bgClass?.includes("bg-gradient") || theme.config?.bgClass?.includes("from-");
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme)}
                      className={`group flex flex-col gap-2 rounded-xl border p-3.5 text-left transition duration-300 cursor-pointer ${
                        isSelected 
                          ? "border-primary bg-white/60 ring-1 ring-primary/30"
                          : "border-black/10 bg-white/35 hover:border-primary/35 hover:bg-white/50"
                      }`}
                    >
                      {/* Theme Miniature Preview Block */}
                      <div
                        className="aspect-video w-full rounded-lg flex flex-col justify-between p-2 border border-black/5 relative overflow-hidden"
                      >
                        <div 
                          className={`absolute inset-0 -z-10 ${theme.config?.bgClass}`}
                          style={isGrad ? {} : { backgroundColor: theme.config?.previewBg }}
                        />
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: theme.config?.accentColor }} />
                          <div className="h-1 w-6 rounded bg-black/10" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 w-full rounded bg-black/15" />
                          <div className="h-1.5 w-2/3 rounded bg-black/15" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] font-bold text-on-surface-variant group-hover:text-primary transition truncate pr-1">
                          {theme.name}
                        </span>
                        {isSelected && (
                          <span className="rounded-full bg-primary p-0.5 text-white">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Customization Widgets Panel */}
              <div className="rounded-xl border border-white/60 bg-white/45 shadow-sm backdrop-blur-md p-5 space-y-6">
                <div className="flex items-center gap-2 border-b border-black/5 pb-2.5">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  <h2 className="text-sm font-bold text-on-surface">Fine-tune Your Design</h2>
                </div>

                {/* Accent Color Section */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-on-surface-variant">Accent Color</label>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { hex: "#f472b6", name: "Pink Burst" },
                      { hex: "#fbbf24", name: "Amber Glow" },
                      { hex: "#38bdf8", name: "Cyan Spark" },
                      { hex: "#9f4122", name: "Rust" },
                      { hex: "#34d399", name: "Emerald Dream" },
                      { hex: "#4f46e5", name: "Royal Violet" },
                      { hex: "#a855f7", name: "Purple Spark" },
                      { hex: "#d4af37", name: "Gold Leaf" },
                      { hex: "#ffffff", name: "Solid White" }
                    ].map(col => (
                      <button
                        key={col.hex}
                        type="button"
                        title={col.name}
                        onClick={() => setAccentColor(col.hex)}
                        className={`h-7 w-7 rounded-full border transition cursor-pointer relative flex items-center justify-center ${
                          accentColor === col.hex 
                            ? "border-primary ring-2 ring-primary/20 scale-110" 
                            : "border-black/15 hover:scale-105"
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {accentColor === col.hex && (
                          <Check className={`h-3.5 w-3.5 ${col.hex === "#ffffff" ? "text-black" : "text-white"}`} />
                        )}
                      </button>
                    ))}
                    
                    {/* Custom Color Input */}
                    <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-black/10">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="h-7 w-7 rounded border border-black/10 cursor-pointer bg-transparent"
                      />
                      <span className="text-[10px] text-on-surface-variant font-mono">{accentColor}</span>
                    </div>
                  </div>
                </div>

                {/* Button Style (Border Shapes) */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-on-surface-variant">Button Shape</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "rounded-none", label: "Sharp" },
                      { id: "rounded-md", label: "Rounded" },
                      { id: "rounded-xl", label: "Curvy" },
                      { id: "rounded-full", label: "Pill" }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setButtonStyle(btn.id)}
                        className={`py-2 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                          buttonStyle === btn.id
                            ? "bg-primary/15 border-primary/40 text-primary"
                            : "bg-white/20 border-black/5 text-on-surface-variant hover:bg-white/50"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography (Fonts) */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-on-surface-variant">Typography Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "font-sans", label: "Modern Sans" },
                      { id: "font-serif", label: "Classic Serif" },
                      { id: "font-mono", label: "Clean Mono" }
                    ].map(fnt => (
                      <button
                        key={fnt.id}
                        type="button"
                        onClick={() => setFontStyle(fnt.id)}
                        className={`py-2 rounded-lg border text-xs font-semibold transition cursor-pointer ${fnt.id} ${
                          fontStyle === fnt.id
                            ? "bg-primary/15 border-primary/40 text-primary"
                            : "bg-white/20 border-black/5 text-on-surface-variant hover:bg-white/50"
                        }`}
                      >
                        {fnt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Presets Selector */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-on-surface-variant">Background Styles & Animations</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { id: "bg-zinc-950", label: "Minimal Dark", color: "#09090b" },
                      { id: "bg-[#0B031E]", label: "Midnight Deep", color: "#0b031e" },
                      { id: "bg-[#fff9ee]", label: "Cozy Sand", color: "#fff9ee" },
                      { id: "bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-800 animate-gradient", label: "Glass Aurora 🌀", color: "#312e81", isGradient: true },
                      { id: "bg-gradient-to-br from-orange-600 via-rose-600 to-indigo-900 animate-gradient", label: "Sunset Drift 🌅", color: "#ea580c", isGradient: true },
                      { id: "bg-gradient-to-tr from-emerald-900 via-teal-900 to-slate-950 animate-gradient", label: "Emerald Dream 🌲", color: "#064e3b", isGradient: true },
                      { id: "bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 animate-gradient", label: "Pastel Velvet 🌸", color: "#fbcfe8", isGradient: true },
                      { id: "bg-gradient-to-tr from-slate-950 via-purple-950 to-indigo-950 animate-gradient", label: "Cosmic Glow ✨", color: "#1e1b4b", isGradient: true }
                    ].map(bg => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => {
                          setBackgroundType(bg.id);
                          setPreviewBg(bg.isGradient ? "transparent" : bg.color);
                        }}
                        className={`group relative aspect-[16/9] w-full rounded-lg border text-left p-2 transition cursor-pointer overflow-hidden ${
                          backgroundType === bg.id
                            ? "border-primary ring-1 ring-primary/30"
                            : "border-black/10 bg-white/20 hover:bg-white/40"
                        }`}
                      >
                        {/* Live background container inside button */}
                        <div 
                          className={`absolute inset-0 -z-10 ${bg.id}`}
                          style={bg.isGradient ? {} : { backgroundColor: bg.color }}
                        />
                        <span className={`text-[10px] font-bold tracking-tight absolute bottom-1.5 left-2 ${
                          bg.id === "bg-[#fff9ee]" || bg.id.includes("from-pink-200") ? "text-zinc-900" : "text-white"
                        }`}>
                          {bg.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
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
            <div className="relative w-full max-w-[310px] aspect-[9/18] rounded-[36px] border-[8px] border-zinc-900 bg-zinc-950 p-4 shadow-2xl shadow-violet-950/20 ring-1 ring-zinc-800 flex flex-col justify-between overflow-hidden">
              
              {/* Top notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-24 rounded-full bg-zinc-900 z-10 flex items-center justify-between px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                <span className="w-10 h-1 rounded-full bg-zinc-800" />
              </div>

              {/* Live screen display elements */}
              <div 
                className={`h-full p-4 flex flex-col justify-between pt-6 transition-colors duration-500 overflow-y-auto no-scrollbar ${bgClass} ${fontFamilyClass}`}
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
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-md shadow-violet-500/20 flex items-center justify-center text-lg font-bold text-white mb-3 mt-4">
                      {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                    </div>
                  )}

                  {/* Display Name */}
                  <h4 className={`text-sm font-bold leading-tight ${isLightBg ? "text-zinc-900" : "text-zinc-100"}`}>
                    {displayName || "Display Name"}
                  </h4>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: accentColor }}>
                    blinko.site/{resolvedSlug || "slug"}
                  </p>

                  {/* Bio */}
                  {bio && (
                    <p className={`text-[10px] leading-relaxed max-w-[220px] mt-2.5 p-2.5 border transition duration-300 ${cardBgClass}`}>
                      {bio}
                    </p>
                  )}

                  {/* Details row */}
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5 max-w-[240px]">
                    {location && (
                      <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[8px] border ${
                        isLightBg ? "bg-black/5 text-zinc-650 border-black/10" : "bg-black/40 text-zinc-400 border-zinc-900"
                      }`}>
                        <MapPin className="h-2 w-2" />
                        {location}
                      </span>
                    )}
                    {website && (
                      <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[8px] border ${
                        isLightBg ? "bg-black/5 text-zinc-650 border-black/10" : "bg-black/40 text-zinc-400 border-zinc-900"
                      }`}>
                        <Globe className="h-2 w-2" />
                        Website
                      </span>
                    )}
                  </div>

                  {/* Prepopulated links list */}
                  <div className="mt-6 w-full space-y-2 px-1">
                    {links.filter(l => l.active).map((link) => {
                      const LinkIcon = iconMap[link.icon] || Link2;
                      return (
                        <div 
                          key={link.id}
                          className={`w-full flex items-center justify-between p-2.5 text-[10px] font-medium border ${btnShapeClass} ${cardBgClass} ${isLightBg ? "text-zinc-900" : "text-zinc-100"}`}
                        >
                          <span className="flex items-center gap-1.5 truncate pr-2">
                            <LinkIcon className="h-3.5 w-3.5" style={{ color: accentColor }} />
                            {link.title || "Link Title"}
                          </span>
                          <span className="text-[8px]" style={{ color: accentColor }}>→</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* simulator footer branding */}
                <div className="mt-8 mb-2 flex items-center justify-center gap-1 opacity-70">
                  <span className={`text-[8px] ${isLightBg ? "text-zinc-500" : "text-zinc-400"}`}>powered by</span>
                  <span className={`text-[8px] font-bold tracking-wider px-1 py-0.5 rounded border ${
                    isLightBg ? "text-zinc-900 bg-black/5 border-black/10" : "text-white bg-black/40 border-zinc-800"
                  }`}>
                    BLINKO
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
