"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Check, Eye, MousePointerClick, Link2, Globe, FileText, Mail,
  MapPin, ArrowUpRight, Play, BookOpen, Sparkles, ChevronRight,
  Share2, Copy, CheckCircle2, Loader2, MessageSquare, DollarSign,
  TrendingUp, AlertCircle
} from "lucide-react";
import { supabase } from "../../../lib/supabase";

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

export default function PublicNestedProfilePage({ params }) {
  const resolvedParams = use(params);
  const rawUsername = resolvedParams?.username || "";
  const username = rawUsername.toLowerCase();
  const rawSlug = resolvedParams?.slug || "";
  const slug = rawSlug.toLowerCase();

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

  // Action feedback states
  const [copyToast, setCopyToast] = useState(false);
  const [buyingId, setBuyingId] = useState(null);
  const [storeToast, setStoreToast] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState("");

  // Contact Form states
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle, sending, success

  useEffect(() => {
    if (!username || !slug) return;

    const loadCreatorData = async () => {
      try {
        setLoading(true);

        // 1. Fetch profile matching username to get user_id
        const { data: userProfile, error: userProfileError } = await supabase
          .from("profiles")
          .select("user_id, username")
          .eq("username", username)
          .limit(1)
          .maybeSingle();

        if (userProfileError || !userProfile) {
          setProfileExists(false);
          setLoading(false);
          return;
        }

        // 2. Fetch tree matching user_id and slug
        const { data: treeRow, error: treeError } = await supabase
          .from("trees")
          .select("*")
          .eq("user_id", userProfile.user_id)
          .eq("slug", slug)
          .maybeSingle();

        if (treeError || !treeRow) {
          setProfileExists(false);
          setLoading(false);
          return;
        }
        setActiveTree(treeRow);

        // 3. Fetch profile matching tree_id
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

        // 4. Fetch theme configuration if profileRow has theme_id
        if (profileRow.theme_id) {
          const { data: themeRow } = await supabase
            .from("themes")
            .select("*")
            .eq("id", profileRow.theme_id)
            .maybeSingle();
          setTheme(themeRow);
        }

        // Increment Views in analytics
        const { data: analRow } = await supabase
          .from("analytics")
          .select("id, views, clicks")
          .eq("tree_id", treeRow.id)
          .maybeSingle();

        let currentViews = 0;
        let currentClicks = 0;

        if (analRow) {
          currentViews = analRow.views + 1;
          currentClicks = analRow.clicks;
          await supabase
            .from("analytics")
            .update({ views: currentViews })
            .eq("id", analRow.id);
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
  }, [username, slug]);

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
        const { data: analRow } = await supabase
          .from("analytics")
          .select("id, clicks")
          .eq("tree_id", activeTree.id)
          .maybeSingle();

        if (analRow) {
          await supabase
            .from("analytics")
            .update({ clicks: analRow.clicks + 1 })
            .eq("id", analRow.id);
          
          setClicksCount(analRow.clicks + 1);
        }
      }
    } catch (err) {
      console.error("Increment Clicks Error:", err);
    }
  };

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : `https://blinko.site/${username}/${slug}`;
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
        <p className="text-xs text-zinc-450 mt-2 text-center max-w-sm leading-relaxed">
          The Blinko Tree page <span className="font-mono text-violet-400">blinko.site/{username}/{slug}</span> is not registered. Double check the address or sign up to claim it!
        </p>
        <Link href="/signup" className="mt-8 inline-flex items-center gap-1.5 rounded-lg bg-violet-650 px-4 py-2 text-xs font-bold text-white hover:bg-violet-600 transition">
          Claim Handle
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  // Visual Theme mapping
  const bgClass = creatorProfile.background_type || "bg-[#0A0A0A]";
  const accentColor = creatorProfile.accent_color || "#7C3AED";
  const fontFamilyClass = creatorProfile.font_style || "font-sans";
  const buttonStyle = creatorProfile.button_style || "rounded-md";

  // Predefined or fallback cardBg
  const cardBgClass = theme?.config?.previewCard || "bg-zinc-950/60 border border-zinc-900 hover:border-violet-500/35 hover:bg-zinc-900/10";

  return (
    <div className={`min-h-screen ${bgClass} ${fontFamilyClass} text-zinc-100 flex flex-col items-center pb-16 pt-16 px-4 relative overflow-hidden select-none`}>
      {/* Background Glows */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.12),transparent_50%)] pointer-events-none" />

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
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-indigo-500 opacity-80 blur-sm animate-spin [animation-duration:8s] -z-10" />
            {creatorProfile.avatar_url ? (
              <img
                src={creatorProfile.avatar_url}
                alt={creatorProfile.display_name}
                className="h-24 w-24 rounded-full object-cover shadow-lg relative border border-zinc-850"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 font-extrabold text-white text-3xl flex items-center justify-center relative shadow-lg shadow-violet-950/20">
                {creatorProfile.display_name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User names */}
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {creatorProfile.display_name}
            </h1>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white shadow shadow-blue-500/20">
              <Check className="h-3 w-3 stroke-[3]" />
            </span>
          </div>
          <p className="text-sm font-semibold font-mono mt-1" style={{ color: accentColor }}>@{creatorProfile.username}/{slug}</p>

          {/* Bio */}
          {creatorProfile.bio && (
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 max-w-md">
              {creatorProfile.bio}
            </p>
          )}

          {/* Location */}
          {creatorProfile.location && (
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-500">
              <MapPin className="h-3.5 w-3.5 text-zinc-650" />
              {creatorProfile.location}
            </div>
          )}

          {/* Views & Clicks Stats */}
          <div className="mt-8 grid grid-cols-3 gap-3 w-full sm:max-w-md bg-zinc-950/60 border border-zinc-900 rounded-xl p-3">
            <div className="text-center">
              <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                <Eye className="h-3 w-3 text-zinc-650" />
                Views
              </span>
              <p className="text-base font-semibold text-zinc-200 mt-1">{viewsCount.toLocaleString()}</p>
            </div>
            <div className="text-center border-x border-zinc-900">
              <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                <MousePointerClick className="h-3 w-3 text-zinc-650" />
                Clicks
              </span>
              <p className="text-base font-semibold text-zinc-200 mt-1">{clicksCount.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                <Link2 className="h-3 w-3 text-zinc-650" />
                Links
              </span>
              <p className="text-base font-semibold text-zinc-200 mt-1">{links.length}</p>
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
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={target}
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick(link)}
                  className={`group flex items-center gap-4 p-4 hover:shadow-lg hover:shadow-violet-950/5 hover:-translate-y-0.5 transition duration-300 relative overflow-hidden border ${buttonStyle} ${cardBgClass}`}
                >
                  {/* Left accent color strip */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: accentColor }} />
                  
                  <div className="rounded-lg bg-zinc-900 border border-zinc-850 p-2 text-violet-400 group-hover:bg-violet-600/10 transition-colors">
                    <Link2 className="h-5 w-5" style={{ color: accentColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-xs text-zinc-550 mt-0.5 leading-relaxed truncate pr-4">{link.url}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-zinc-650 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300 shrink-0" />
                </a>
              );
            })}
          </section>
        ) : (
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/45 p-8 text-center text-zinc-550 text-xs italic">
            This Blinko Tree has no active links published yet.
          </div>
        )}

        {/* Portfolio Showcase Grid */}
        {projects.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Featured Projects</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="group flex flex-col justify-between rounded-xl border border-zinc-900 bg-zinc-950 p-4 hover:border-violet-500/25 hover:shadow-lg transition duration-300"
                >
                  <div>
                    {/* Project preview header */}
                    <div className="h-24 w-full rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 mb-3 flex items-center justify-center border border-zinc-900 shadow-inner relative overflow-hidden group-hover:opacity-90 transition">
                      <Sparkles className="h-7 w-7 text-white/40 drop-shadow" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{proj.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1 leading-normal">{proj.description}</p>
                  </div>
                  
                  {proj.project_url && (
                    <div className="mt-4">
                      <a
                        href={proj.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-400 group-hover:text-violet-350 hover:underline"
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
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Digital Store</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {products.map((prod) => {
                const isBuying = buyingId === prod.id;
                return (
                  <div
                    key={prod.id}
                    className="flex flex-col justify-between rounded-xl border border-zinc-900 bg-zinc-950 p-4 hover:border-violet-500/20 transition duration-300"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="rounded bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 text-[10px] font-bold text-violet-300 font-mono" style={{ color: accentColor, borderColor: `${accentColor}33` }}>
                          ${prod.price || "5"}
                        </span>
                      </div>
                      <h3 className="text-xs font-semibold text-white">{prod.title}</h3>
                      <p className="text-[10px] text-zinc-500 mt-1 leading-normal">{prod.description}</p>
                    </div>
                    
                    <div className="mt-4">
                      <button
                        onClick={() => handleBuy(prod.id, prod.title)}
                        disabled={buyingId !== null}
                        className="w-full rounded-lg border border-zinc-850 bg-zinc-900 py-1.5 text-[10px] font-bold text-zinc-350 hover:border-violet-500/50 hover:bg-violet-950/10 hover:text-violet-300 transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
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
        <section className="rounded-xl border border-zinc-900 bg-zinc-950 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-violet-400" />
              Get in Touch
            </h3>
            <p className="text-xs text-zinc-550 mt-0.5">Send a message directly to my creator inbox.</p>
          </div>

          {formStatus === "success" ? (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-center text-xs text-emerald-400 animate-in fade-in duration-300">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-emerald-400 animate-bounce" />
              <p className="font-semibold">Thank you for your message!</p>
              <p className="text-zinc-500 mt-1">Your message has been delivered to my private owner inbox.</p>
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
                  className="w-full rounded-lg border border-zinc-900 bg-zinc-900/20 px-3.5 py-2 text-xs text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/40"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full rounded-lg border border-zinc-900 bg-zinc-900/20 px-3.5 py-2 text-xs text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/40"
                />
              </div>
              <textarea
                placeholder="Write your message..."
                required
                rows="3"
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full rounded-lg border border-zinc-900 bg-zinc-900/20 px-3.5 py-2 text-xs text-zinc-200 outline-none transition focus:border-violet-500/50 focus:bg-zinc-900/40 resize-none"
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
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 text-center text-white shadow-xl shadow-violet-950/20">
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <h3 className="text-lg font-bold tracking-tight">Create your own Blinko page</h3>
          <p className="mt-1 text-xs text-violet-100 max-w-sm mx-auto">
            Design dynamic visual link trees, portfolio showcases, and AI bio drafts in seconds.
          </p>
          <div className="mt-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-1 rounded-lg bg-white px-4 py-2.5 text-xs font-bold text-violet-700 hover:bg-violet-550 transition"
            >
              Get Started Free
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-zinc-900/75 space-y-4">
          <div className="flex items-center justify-center gap-1.5 opacity-55">
            <span className="text-[10px] text-zinc-550">powered by</span>
            <Link
              href="/"
              className="text-[10px] font-bold text-white tracking-wider bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-850 hover:opacity-100 hover:border-violet-500/20 transition"
            >
              BLINKO
            </Link>
          </div>
        </footer>

      </main>

      {/* Floating Share Control Bar */}
      <div className="fixed bottom-6 z-40 flex items-center gap-2 rounded-full border border-zinc-850 bg-zinc-950/90 p-1.5 shadow-2xl shadow-black backdrop-blur-md animate-in slide-in-from-bottom-12 duration-500">
        <button
          onClick={handleCopyLink}
          className="flex h-9 items-center gap-1.5 rounded-full bg-violet-650/15 border border-violet-500/20 px-3.5 text-xs font-semibold text-violet-300 hover:bg-violet-650 hover:text-white transition cursor-pointer"
          style={{ color: accentColor, borderColor: `${accentColor}33` }}
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Copy Page Link</span>
        </button>
        <button
          onClick={handleCopyLink}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition cursor-pointer"
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
