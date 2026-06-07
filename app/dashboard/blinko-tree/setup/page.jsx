"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Check, ArrowRight, ArrowLeft, Search, Sparkles, Monitor, Loader2, 
  Copy, CheckCircle2, Share2, QrCode, Globe, MapPin, Mail, 
  ExternalLink, FileText, Play, Code, BookOpen, Layers, 
  Building, Briefcase, Music, Camera, ShoppingBag, Eye, Link2, LucideIcon,
  X, Plus, Trash2, GripVertical, Upload
} from "lucide-react";
import { Github, Linkedin, Instagram, Youtube, Twitter } from "../../../components/dashboard/BrandIcons";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../../context/AuthContext";
import ThemeCustomizer from "../../../components/theme/ThemeCustomizer";
import BlinkoLogo from "../../../components/BlinkoLogo";
import Button from "../../../components/Button";
import AnimatedBackground from "../../../components/theme/AnimatedBackground";
import { LINK_STYLE_PRESETS, BIO_CARD_STYLES, BUILT_IN_THEMES } from "../../../components/theme/themePresets";

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

const PLATFORMS = [
  { name: "YouTube", icon: "Youtube", defaultTitle: "Watch my YouTube Videos", defaultUrl: "https://youtube.com" },
  { name: "Instagram", icon: "Instagram", defaultTitle: "Follow me on Instagram", defaultUrl: "https://instagram.com" },
  { name: "TikTok", icon: "Play", defaultTitle: "TikTok Videos", defaultUrl: "https://tiktok.com" },
  { name: "GitHub", icon: "Github", defaultTitle: "My GitHub Repositories", defaultUrl: "https://github.com" },
  { name: "LinkedIn", icon: "Linkedin", defaultTitle: "Connect on LinkedIn", defaultUrl: "https://linkedin.com" },
  { name: "Twitter / X", icon: "Twitter", defaultTitle: "Follow me on Twitter", defaultUrl: "https://twitter.com" },
  { name: "Spotify", icon: "Music", defaultTitle: "Listen on Spotify", defaultUrl: "https://spotify.com" },
  { name: "Website", icon: "Globe", defaultTitle: "My Personal Website", defaultUrl: "https://" },
  { name: "Email Address", icon: "Mail", defaultTitle: "Send me an Email", defaultUrl: "mailto:" },
  { name: "Custom Link", icon: "Link2", defaultTitle: "Custom Link", defaultUrl: "https://" },
];

const CATEGORIES = ["All", "Tech", "Creative", "Business", "Education", "General"];

const TEMPLATES = [
  {
    id: "creator",
    name: "Creator",
    category: "Creative",
    desc: "For YouTubers, Instagram, and TikTok creators.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultDisplayName: "Avery Stone",
    defaultBio: "Digital creator & YouTuber sharing travel stories and lifestyle vlogs.",
    defaultLocation: "Los Angeles, CA",
    defaultWebsite: "https://averystone.com",
    defaultLinks: [
      { title: "Watch my Latest Video", url: "https://youtube.com", icon: "Play" },
      { title: "Follow me on Instagram", url: "https://instagram.com", icon: "Link2" },
      { title: "TikTok Videos", url: "https://tiktok.com", icon: "Play" },
    ],
    defaultThemeId: "creator-hub"
  },
  {
    id: "developer",
    name: "Developer",
    category: "Tech",
    desc: "For software engineers, designers, and developers.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultDisplayName: "Alex Carter",
    defaultBio: "Software Engineer & Designer building open-source projects.",
    defaultLocation: "San Francisco, CA",
    defaultWebsite: "https://alexcarter.dev",
    defaultLinks: [
      { title: "GitHub Repositories", url: "https://github.com", icon: "Code" },
      { title: "LinkedIn Professional", url: "https://linkedin.com", icon: "Link2" },
      { title: "Download Resume", url: "https://google.com", icon: "FileText" },
      { title: "Personal Portfolio", url: "https://google.com", icon: "Globe" },
    ],
    defaultThemeId: "developer-os"
  },
  {
    id: "student",
    name: "Student",
    category: "Education",
    desc: "For college and high school students.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultDisplayName: "Jordan Lee",
    defaultBio: "Computer Science student at Stanford. Passionate about AI & UX.",
    defaultLocation: "Palo Alto, CA",
    defaultWebsite: "https://jordanlee.me",
    defaultLinks: [
      { title: "LinkedIn Profile", url: "https://linkedin.com", icon: "Link2" },
      { title: "My Research Projects", url: "https://google.com", icon: "BookOpen" },
      { title: "My Resume", url: "https://google.com", icon: "FileText" },
    ],
    defaultThemeId: "student-pro"
  },
  {
    id: "startup",
    name: "Startup Founder",
    category: "Business",
    desc: "For entrepreneurs and company founders.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultDisplayName: "Morgan Taylor",
    defaultBio: "Founder & CEO of Novatech. Building the future of automation.",
    defaultLocation: "New York, NY",
    defaultWebsite: "https://novatech.co",
    defaultLinks: [
      { title: "Visit Company Website", url: "https://google.com", icon: "Building" },
      { title: "View Pitch Deck", url: "https://google.com", icon: "FileText" },
      { title: "Contact Us", url: "mailto:info@startup.com", icon: "Link2" },
    ],
    defaultThemeId: "startup-founder"
  },
  {
    id: "freelancer",
    name: "Freelancer",
    category: "Business",
    desc: "For freelance writers, developers, and consultants.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultDisplayName: "Taylor Reid",
    defaultBio: "Freelance UI/UX designer & brand strategist helping startups grow.",
    defaultLocation: "London, UK",
    defaultWebsite: "https://taylorreid.design",
    defaultLinks: [
      { title: "My Freelance Services", url: "https://google.com", icon: "Briefcase" },
      { title: "View Portfolio Gallery", url: "https://google.com", icon: "Globe" },
      { title: "Work Testimonials", url: "https://google.com", icon: "BookOpen" },
    ],
    defaultThemeId: "apple-glass"
  },
  {
    id: "musician",
    name: "Musician",
    category: "Creative",
    desc: "For bands, artists, and music creators.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultDisplayName: "Sam Jenkins",
    defaultBio: "Indie singer-songwriter. New album 'Echoes of Light' out now!",
    defaultLocation: "Nashville, TN",
    defaultWebsite: "https://samjenkinsmusic.com",
    defaultLinks: [
      { title: "Listen on Spotify", url: "https://spotify.com", icon: "Music" },
      { title: "Latest Music Video", url: "https://youtube.com", icon: "Play" },
      { title: "Upcoming Gig Tickets", url: "https://google.com", icon: "Link2" },
    ],
    defaultThemeId: "music-artist"
  },
  {
    id: "photographer",
    name: "Photographer",
    category: "Creative",
    desc: "For digital artists and photographers.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultDisplayName: "Robin Vance",
    defaultBio: "Landscape & street photographer capturing moments around the globe.",
    defaultLocation: "Seattle, WA",
    defaultWebsite: "https://robinvancephoto.com",
    defaultLinks: [
      { title: "View Gallery", url: "https://unsplash.com", icon: "Camera" },
      { title: "Instagram Profile", url: "https://instagram.com", icon: "Link2" },
      { title: "Book a Shoot", url: "https://calendly.com", icon: "Briefcase" },
    ],
    defaultThemeId: "apple-glass"
  },
  {
    id: "agency",
    name: "Agency",
    category: "Business",
    desc: "For design, marketing, and developer agencies.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultDisplayName: "Vortex Labs",
    defaultBio: "Digital agency specializing in web development, design, and SEO.",
    defaultLocation: "Austin, TX",
    defaultWebsite: "https://vortexlabs.agency",
    defaultLinks: [
      { title: "Our Core Services", url: "https://google.com", icon: "Building" },
      { title: "Client Case Studies", url: "https://google.com", icon: "BookOpen" },
      { title: "Work with Us", url: "https://google.com", icon: "Briefcase" },
    ],
    defaultThemeId: "startup-founder"
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    category: "Business",
    desc: "For Shopify and online product stores.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultDisplayName: "Aura Essentials",
    defaultBio: "Handcrafted minimalist home decor and wellness products.",
    defaultLocation: "Chicago, IL",
    defaultWebsite: "https://auraessentials.com",
    defaultLinks: [
      { title: "Shop New Products", url: "https://shopify.com", icon: "ShoppingBag" },
      { title: "Exclusive Offers", url: "https://google.com", icon: "Link2" },
      { title: "Customer Support", url: "https://google.com", icon: "Briefcase" },
    ],
    defaultThemeId: "luxury-black"
  },
  {
    id: "custom",
    name: "Custom Blank",
    category: "General",
    desc: "Build your canvas layout from scratch.",
    fields: ["display_name", "username", "bio", "location", "website"],
    defaultDisplayName: "My Blinko Tree",
    defaultBio: "Welcome to my link-in-bio page!",
    defaultLocation: "",
    defaultWebsite: "",
    defaultLinks: [],
    defaultThemeId: "apple-glass"
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
  const [displayName, setDisplayName] = useState(TEMPLATES[1].defaultDisplayName);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState(TEMPLATES[1].defaultBio);
  const [location, setLocation] = useState(TEMPLATES[1].defaultLocation);
  const [website, setWebsite] = useState(TEMPLATES[1].defaultWebsite);
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
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Fine-tune Theme Customization States - Default to Developer OS (GitHub Grid) to match Developer template selection
  const [accentColor, setAccentColor] = useState("#00ff88");
  const [buttonStyle, setButtonStyle] = useState("rounded-none");
  const [fontStyle, setFontStyle] = useState("font-mono");
  const [backgroundType, setBackgroundType] = useState("animated");
  const [previewBg, setPreviewBg] = useState("transparent");
  const [linkStyle, setLinkStyle] = useState("neon");
  const [animationStrength, setAnimationStrength] = useState(0.4);
  const [blurAmount, setBlurAmount] = useState(0);
  const [shadowIntensity, setShadowIntensity] = useState(0.5);
  const [cardTransparency, setCardTransparency] = useState(20);
  const [animatedBackground, setAnimatedBackground] = useState("developer-grid");
  const [titleColor, setTitleColor] = useState("accent");
  const [bioCardStyle, setBioCardStyle] = useState("neon");

  // Fetch Themes on startup
  useEffect(() => {
    const fetchThemes = async () => {
      const { data } = await supabase.from("themes").select("*");
      if (data && data.length > 0) {
        setThemesList(data);
        // Do NOT auto-select database themes so that client-side "Apple Glass" starts active
        setSelectedTheme(null);
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

  // Handle template selection changes (populate links)
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setTreeName(template.name);
    setDisplayName(template.defaultDisplayName || "");
    setBio(template.defaultBio || "");
    setLocation(template.defaultLocation || "");
    setWebsite(template.defaultWebsite || "");
    setLinks(template.defaultLinks.map((dl, idx) => ({
      id: `link-${idx}`,
      title: dl.title,
      url: dl.url,
      icon: dl.icon,
      position: idx,
      active: true,
      featured: false
    })));

    // Automatically apply matching theme config
    const matchingTheme = BUILT_IN_THEMES.find(t => t.id === template.defaultThemeId);
    if (matchingTheme) {
      setSelectedTheme(matchingTheme);
      setAccentColor(matchingTheme.config.accentColor);
      setFontStyle(matchingTheme.config.fontFamily);
      setButtonStyle(matchingTheme.config.buttonStyle);
      if (matchingTheme.config.linkStyle) setLinkStyle(matchingTheme.config.linkStyle);
      if (matchingTheme.config.animationStrength !== undefined) setAnimationStrength(matchingTheme.config.animationStrength);
      if (matchingTheme.config.blur !== undefined) setBlurAmount(matchingTheme.config.blur);
      if (matchingTheme.config.shadowIntensity !== undefined) setShadowIntensity(matchingTheme.config.shadowIntensity);
      if (matchingTheme.config.cardTransparency !== undefined) setCardTransparency(matchingTheme.config.cardTransparency);
      setTitleColor(matchingTheme.config.titleColor || "accent");
      setBioCardStyle(
        matchingTheme.config.bioCardStyle || 
        (matchingTheme.config.linkStyle === "neon" ? "neon" : matchingTheme.config.linkStyle === "glass" ? "glass" : matchingTheme.config.linkStyle === "gradient" ? "gradient" : "transparent")
      );
      if (matchingTheme.config.background && matchingTheme.config.background !== "none") {
        setAnimatedBackground(matchingTheme.config.background);
        setBackgroundType("animated");
        setPreviewBg("transparent");
      } else {
        setAnimatedBackground("none");
        setBackgroundType(matchingTheme.config.isLight ? "bg-[#fff9ee]" : "bg-zinc-950");
        setPreviewBg(matchingTheme.config.isLight ? "#fff9ee" : "#09090b");
      }
    }
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
      const fileName = `${user.id}/setup-${Date.now()}.${fileExt}`;
      
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
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert(`Avatar upload failed: ${err.message || "Unknown error"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleAvatarDragLeave = () => {
    setIsDragging(false);
  };

  const handleAvatarDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadAvatarFile(file);
    }
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

  // Add new link from platform templates
  const handleAddLink = (platform) => {
    const newLink = {
      id: `link-${Date.now()}`,
      title: platform.defaultTitle,
      url: platform.defaultUrl,
      icon: platform.icon,
      position: links.length,
      active: true,
      featured: false
    };
    setLinks(prev => [...prev, newLink]);
    setShowAddLinkModal(false);
  };

  // Delete link from template setup list
  const handleDeleteLink = (id) => {
    setLinks(prev => prev.filter(l => l.id !== id));
  };

  // Drag and drop handlers for list reordering
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const updatedLinks = [...links];
    const draggedItem = updatedLinks[draggedIndex];
    
    // Remove dragged item from its original position
    updatedLinks.splice(draggedIndex, 1);
    // Insert dragged item at the new position
    updatedLinks.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setLinks(updatedLinks);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
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
        background_type: serializedConfig,
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
  const isLightBg = 
    backgroundType === "bg-[#fff9ee]" || 
    backgroundType === "bg-surface" || 
    backgroundType === "bg-background" || 
    backgroundType.includes("pink-200") ||
    (backgroundType === "animated" && (
      animatedBackground === "glass-bubbles" || 
      ["sunbeam-rays", "sakura-petals", "cloud-drift", "pastel-waves", "morning-dew", "watercolor-wash", "cotton-candy", "golden-hour", "ocean-breeze", "lavender-mist"].includes(animatedBackground)
    ));
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
        <section className={`${(step === 1 || step === 6) ? "lg:col-span-5" : "lg:col-span-3"} ${step === 1 ? "max-w-3xl mx-auto w-full" : step === 6 ? "max-w-xl mx-auto" : ""} space-y-6`}>
          
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

              {/* Upload Profile Pic Box (matching first screenshot) */}
              <div className="bg-white/40 border border-white/60 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center gap-4.5 shadow-sm text-center">
                <div className="relative shrink-0">
                  <div className="absolute -inset-0.5 rounded-full bg-white opacity-40 blur-sm" />
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName || "Profile Preview"}
                      className={`relative h-20 w-20 rounded-full object-cover shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-4 border-white transition-all duration-300 hover:scale-105 ${uploading ? 'opacity-50' : ''}`}
                    />
                  ) : (
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary-container text-3xl font-bold text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-4 border-white transition-all duration-300 hover:scale-105">
                      {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 border-4 border-white">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex flex-row items-center gap-3 justify-center w-full">
                  <label className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white border border-black/5 text-zinc-800 font-bold rounded-full text-xs hover:bg-zinc-50 transition cursor-pointer shadow-md select-none">
                    <Upload className="h-3.5 w-3.5 text-zinc-700" />
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
                    onDragOver={handleAvatarDragOver}
                    onDragLeave={handleAvatarDragLeave}
                    onDrop={handleAvatarDrop}
                    className={`px-5 py-2.5 rounded-full border-2 border-dashed text-xs font-semibold select-none tracking-wide transition-all ${
                      isDragging 
                        ? 'border-primary bg-primary/10 text-primary scale-105' 
                        : 'border-zinc-300 text-zinc-500 hover:border-zinc-400 hover:bg-black/5'
                    }`}
                  >
                    {isDragging ? "Drop your photo here!" : "or drag & drop here"}
                  </div>
                </div>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-on-surface">Template Links Setup</h1>
                  <p className="text-sm text-on-surface-variant mt-1">Review, reorder, or add custom platform links.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddLinkModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/95 transition cursor-pointer shadow-sm shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  Add Link
                </button>
              </div>

              {links.length === 0 ? (
                <div className="rounded-xl border border-black/10 bg-white/40 shadow-sm p-8 text-center text-on-surface-variant text-xs">
                  No active links configured. Click "Add Link" above to build your page structure.
                </div>
              ) : (
                <div className="space-y-4">
                  {links.map((link, idx) => {
                    const LinkIcon = iconMap[link.icon] || Link2;
                    const isDragging = idx === draggedIndex;
                    return (
                      <div 
                        key={link.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDragEnd={handleDragEnd}
                        className={`group relative rounded-xl border border-white/60 bg-white/40 shadow-sm backdrop-blur-md p-4 space-y-3.5 transition-all duration-200 ${
                          isDragging ? "opacity-45 scale-[0.98] border-primary/50 border-dashed" : "hover:border-primary/20"
                        }`}
                      >
                        {/* Drag indicator & Title Row */}
                        <div className="flex items-center justify-between select-none">
                          <div className="flex items-center gap-2">
                            {/* Grab handle */}
                            <div className="cursor-grab active:cursor-grabbing p-1 text-on-surface-variant/40 hover:text-primary transition">
                              <GripVertical className="h-4 w-4" />
                            </div>
                            
                            <span className="rounded bg-primary/10 border border-primary/20 p-1.5 text-primary">
                              <LinkIcon className="h-3.5 w-3.5" />
                            </span>
                            <span className="text-xs font-bold text-on-surface">{link.title || "Untitled Link"}</span>
                            
                            {/* Position Badge */}
                            <span className="text-[9px] font-mono font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                              #{idx + 1}
                            </span>
                          </div>

                          {/* Delete Link Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteLink(link.id)}
                            className="p-1.5 rounded-lg border border-black/5 hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600 text-on-surface-variant/50 transition cursor-pointer"
                            title="Delete link"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Input Fields */}
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
        {step > 1 && step < 6 && (
          <div className="lg:col-span-2 flex justify-center lg:justify-start lg:sticky lg:top-24 h-fit ml-40 pt-6">
            {/* Ambient Dynamic Backglow Container */}
            <div className="relative w-full max-w-[310px] group">
              {/* Floating Live Simulator Badge */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1.5 bg-white/85 backdrop-blur-md border border-white/60 shadow-sm rounded-full text-[10px] font-bold text-on-surface-variant/95 tracking-wide select-none z-30">
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
                  className={`h-full flex flex-col justify-between transition-colors duration-500 overflow-hidden rounded-[38px] relative ${bgClass} ${fontFamilyClass}`}
                  style={{ backgroundColor: previewBg }}
                >
                  {/* Animated Background */}
                  {animatedBackground && animatedBackground !== "none" && (
                    <AnimatedBackground 
                      backgroundId={animatedBackground} 
                      animationStrength={animationStrength} 
                    />
                  )}
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
                    {selectedTheme?.config?.neonAvatarGlow ? (
                      <div className="relative mb-3 mt-1 scale-95">
                        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-90 blur-[2px] -z-10" />
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="h-14 w-14 rounded-full object-cover relative border border-white/80 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-md flex items-center justify-center text-base font-bold text-white border border-white/80">
                            {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                          </div>
                        )}
                      </div>
                    ) : isLightBg ? (
                      <div className="relative mb-3 mt-1 scale-95">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="h-14 w-14 rounded-full object-cover relative border-2 border-white shadow-[0_0_10px_rgba(191,219,254,0.6)]"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-md flex items-center justify-center text-base font-bold text-white border-2 border-white shadow-[0_0_10px_rgba(191,219,254,0.6)]">
                            {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                          </div>
                        )}
                      </div>
                    ) : (
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
                    )}

                    {/* Display Name with verified badge */}
                    <h4 
                      className="text-sm font-bold leading-none flex items-center justify-center gap-1 mt-0.5 relative z-10"
                      style={{ color: titleColor === "accent" ? accentColor : titleColor || (isLightBg ? "#18181b" : "#ffffff") }}
                    >
                      {displayName || "Display Name"}
                      <svg className="w-3.5 h-3.5 text-violet-500 fill-current inline-block flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </h4>
                    <p className="text-[9px] font-mono mt-1 relative z-10" style={{ color: accentColor }}>
                      blinko.site/{resolvedSlug || "slug"}
                    </p>

                    {/* Bio Paragraph */}
                    {bio && (
                      (() => {
                        const activeBioPreset = BIO_CARD_STYLES.find(s => s.id === bioCardStyle);
                        const bioCardClass = (bioCardStyle && bioCardStyle !== "transparent")
                          ? (activeBioPreset ? (isLightBg ? activeBioPreset.lightClass : activeBioPreset.darkClass) : cardBgClass)
                          : "bg-transparent border-none p-0 text-center z-10";

                        return (
                          <p 
                            className={`text-[10px] leading-relaxed max-w-[210px] mt-3 transition-all duration-300 z-10 ${
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
                    <div className="mt-3 flex flex-wrap justify-center gap-1.5 max-w-[220px] z-10">
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
                    <div className="mt-5 w-full space-y-2 px-1 z-10">
                      {links.filter(l => l.active).map((link) => {
                        const LinkIcon = iconMap[link.icon] || Link2;
                        const activeLinkPreset = LINK_STYLE_PRESETS.find(s => s.id === linkStyle);
                        const linkCardStyle = activeLinkPreset 
                          ? (isLightBg ? activeLinkPreset.lightClass : activeLinkPreset.darkClass)
                          : cardBgClass;

                        return (
                          <div 
                            key={link.id}
                            className={`w-full flex items-center justify-between p-2.5 text-[10px] font-semibold border shadow-xs hover:translate-y-[-1px] transition-all duration-300 ${btnShapeClass} ${linkCardStyle}`}
                            style={{
                              backdropFilter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
                              boxShadow: shadowIntensity > 0 ? `0 4px ${16 * shadowIntensity}px rgba(0,0,0,${shadowIntensity * 0.25})` : undefined,
                              opacity: cardTransparency ? (0.5 + (cardTransparency / 200)) : 1
                            }}
                          >
                            <span className="flex items-center gap-2 truncate pr-2">
                              <span className={
                                selectedTheme?.config?.usePlatformIconColors
                                  ? `rounded-full p-1.5 border ${platformColors[link.icon] || "bg-purple-500/10 border-purple-500/20 text-purple-400"}`
                                  : ""
                              }>
                                <LinkIcon className="h-3.5 w-3.5" style={{ color: selectedTheme?.config?.usePlatformIconColors ? undefined : accentColor }} />
                              </span>
                              {link.title || "Link Title"}
                            </span>
                            <span className="text-[8px]" style={{ color: selectedTheme?.config?.usePlatformIconColors ? "#ffffff" : accentColor }}>→</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 select-none animate-in fade-in duration-300">
          <div className="relative w-full max-w-md rounded-[32px] border border-white/60 bg-white/75 p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-center animate-in scale-in duration-300 backdrop-blur-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-black/5 bg-white/45 text-on-surface-variant/70 hover:text-on-surface hover:bg-white transition-all duration-200 cursor-pointer shadow-sm"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Header */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary-container/10 text-primary mb-5 relative">
              <span className="absolute inset-0 rounded-full bg-primary/5 animate-ping opacity-75" />
              <Sparkles className="h-6 w-6 relative z-10" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-on-surface font-display-xl">🚀 Unlock Unlimited Blinko Trees</h3>
            <p className="text-xs text-on-surface-variant/80 mt-2 max-w-sm mx-auto leading-relaxed font-body-md">
              Upgrade to Pro to create unlimited trees, unlock advanced premium themes, and track custom domain names.
            </p>

            {/* Benefits list (Scroll container) */}
            <div className="relative mt-6">
              <div className="grid gap-2.5 text-left max-h-56 overflow-y-auto pr-0.5 no-scrollbar">
                {[
                  { title: "Unlimited Blinko Trees", desc: "Create as many public pages as you want." },
                  { title: "Advanced Analytics", desc: "Track Views, Clicks, CTR, Top Links, Traffic Sources, Device stats." },
                  { title: "Premium Themes", desc: "Access all premium designs (Neon, Cyberpunk, Glassmorphism)." },
                  { title: "Custom Domains", desc: "Use yourname.com instead of blinko.site/username." },
                  { title: "Remove Blinko Branding", desc: "Remove all platform watermarks." }
                ].map((benefit, idx) => (
                  <div key={idx} className="flex gap-3 rounded-2xl border border-black/5 bg-white/45 p-3.5 text-xs shadow-sm hover:translate-y-[-1px] hover:bg-white/60 hover:border-primary/10 transition-all duration-200">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-on-surface font-body-md">{benefit.title}</h4>
                      <p className="text-[10px] text-on-surface-variant/80 mt-0.5 font-body-md">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal actions buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  router.push("/dashboard/billing");
                }}
                className="w-full flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-container text-sm font-bold text-white hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-md cursor-pointer"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full text-on-surface-variant/75 hover:text-on-surface text-xs font-semibold py-2 transition-all duration-200 cursor-pointer"
              >
                Not Right Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PLATFORM LINK MODAL */}
      {showAddLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 select-none animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/60 bg-white/80 backdrop-blur-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            {/* Close Button */}
            <button
              onClick={() => setShowAddLinkModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition cursor-pointer p-1 rounded-lg hover:bg-black/5"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-4">
              <h3 className="text-lg font-extrabold text-on-surface flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add a Platform Link
              </h3>
              <p className="text-xs text-on-surface-variant mt-1">Select a template matching the social, content, or contact link you want to add.</p>
            </div>

            {/* Platforms Grid */}
            <div className="overflow-y-auto pr-1 py-1 grid gap-2.5 sm:grid-cols-2">
              {PLATFORMS.map((platform, idx) => {
                const PlatformIcon = iconMap[platform.icon] || Link2;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAddLink(platform)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-black/5 bg-white/40 hover:bg-white hover:border-primary/40 transition hover:shadow-sm text-left cursor-pointer group"
                  >
                    <span className="rounded bg-primary/10 border border-primary/10 p-2 text-primary group-hover:scale-105 transition duration-200">
                      <PlatformIcon className="h-4 w-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{platform.name}</h4>
                      <p className="text-[10px] text-on-surface-variant/80 mt-0.5 font-mono truncate max-w-[150px]">
                        {platform.defaultUrl.replace("https://", "")}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
