"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  Check,
  Eye,
  MousePointerClick,
  Link2,
  Globe,
  FileText,
  Mail,
  MapPin,
  ArrowUpRight,
  Play,
  BookOpen,
  Sparkles,
  ChevronRight,
  Share2,
  Copy,
  CheckCircle2,
  Loader2,
  MessageSquare,
  DollarSign,
  Heart,
  TrendingUp,
} from "lucide-react";

// Brand icon SVGs defined locally to make public profile page self-contained
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

export default function PublicProfilePage({ params }) {
  // Resolve Dynamic username parameter
  const resolvedParams = use(params);
  const rawUsername = resolvedParams?.username || "lenny";
  const username = rawUsername.toLowerCase();
  
  // Format Display details
  const displayHandle = `@${username}`;
  const displayName = username.charAt(0).toUpperCase() + username.slice(1) + " Dany";

  // Mock click increment systems
  const [stats, setStats] = useState({
    views: 12480,
    clicks: 450,
  });

  // Action feedback states
  const [copyToast, setCopyToast] = useState(false);
  const [buyingId, setBuyingId] = useState(null);
  const [storeToast, setStoreToast] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState("");

  // Contact Form states
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState("idle"); // idle, sending, success

  const handleLinkClick = () => {
    setStats((prev) => ({ ...prev, clicks: prev.clicks + 1 }));
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

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setFormStatus("sending");
    setTimeout(() => {
      setFormStatus("success");
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setFormStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 flex flex-col items-center pb-16 pt-16 px-4 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.16),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_100%,rgba(219,39,119,0.06),transparent_40%)] pointer-events-none" />

      {/* Main Container */}
      <main className="w-full max-w-2xl z-10 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
        
        {/* Profile Header Block */}
        <section className="flex flex-col items-center text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-6 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available for work
          </div>

          {/* Profile Image with Rotating Gradient Border */}
          <div className="relative mb-4">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-indigo-500 opacity-80 blur-sm animate-spin [animation-duration:8s] -z-10" />
            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 font-extrabold text-white text-3xl flex items-center justify-center relative shadow-lg shadow-violet-950/20">
              {displayName.charAt(0)}
            </div>
          </div>

          {/* User Names & verified status */}
          <div className="flex items-center gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {displayName}
            </h1>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white shadow shadow-blue-500/20" title="Verified Creator">
              <Check className="h-3 w-3 stroke-[3]" />
            </span>
          </div>
          <p className="text-sm font-semibold text-violet-400 font-mono mt-1">{displayHandle}</p>

          {/* Biography details */}
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 max-w-md">
            Full Stack Developer. Building AI products and SaaS apps. Focused on developer tooling, UX performance, and micro-interactions.
          </p>

          {/* Location row */}
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-zinc-500">
            <MapPin className="h-3.5 w-3.5 text-zinc-650" />
            Chennai, India
          </div>

          {/* View stats indicators */}
          <div className="mt-8 grid grid-cols-3 gap-3 w-full sm:max-w-md bg-zinc-950/60 border border-zinc-900 rounded-xl p-3">
            <div className="text-center">
              <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                <Eye className="h-3 w-3 text-zinc-650" />
                Views
              </span>
              <p className="text-base font-semibold text-zinc-200 mt-1">{(stats.views).toLocaleString()}</p>
            </div>
            <div className="text-center border-x border-zinc-900">
              <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                <MousePointerClick className="h-3 w-3 text-zinc-650" />
                Clicks
              </span>
              <p className="text-base font-semibold text-zinc-200 mt-1">{(stats.clicks).toLocaleString()}</p>
            </div>
            <div className="text-center">
              <span className="flex items-center justify-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                <Link2 className="h-3 w-3 text-zinc-650" />
                Links
              </span>
              <p className="text-base font-semibold text-zinc-200 mt-1">15</p>
            </div>
          </div>
        </section>

        {/* Social Links Row */}
        <section className="flex justify-center gap-3">
          {[
            { name: "GitHub", href: "https://github.com", icon: GithubIcon },
            { name: "LinkedIn", href: "https://linkedin.com", icon: LinkedinIcon },
            { name: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
            { name: "YouTube", href: "https://youtube.com", icon: YoutubeIcon },
            { name: "Twitter", href: "https://twitter.com", icon: TwitterIcon },
          ].map((soc) => {
            const Icon = soc.icon;
            return (
              <a
                key={soc.name}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="h-10 w-10 flex items-center justify-center bg-zinc-900/50 border border-zinc-800/80 rounded-full text-zinc-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-950/15 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                aria-label={soc.name}
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            );
          })}
        </section>

        {/* Primary Links tree */}
        <section className="space-y-3.5">
          {[
            { title: "My Portfolio", desc: "Check out my coding projects, dashboard mockups, and blog writing.", url: "https://lenny.dev", icon: Globe },
            { title: "Download Resume", desc: "View my developer experiences, tool stack, and education details.", url: "https://lenny.dev/resume.pdf", icon: FileText },
            { title: "Active Repositories", desc: "Browse my public GitHub repositories, stars, and pull requests.", url: "https://github.com", icon: GithubIcon },
            { title: "Connect on LinkedIn", desc: "Send me a message for developer roles, freelance, or consulting.", url: "https://linkedin.com", icon: LinkedinIcon },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="group flex items-center gap-4 rounded-xl border border-zinc-900 bg-zinc-950/60 p-4 hover:border-violet-500/35 hover:bg-zinc-900/10 hover:shadow-lg hover:shadow-violet-950/5 hover:-translate-y-0.5 transition duration-300 relative overflow-hidden"
              >
                {/* Left accent color strip */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-violet-600 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="rounded-lg bg-zinc-900 border border-zinc-850 p-2 text-violet-400 group-hover:bg-violet-600/10 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed truncate pr-4">{link.desc}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-300 shrink-0" />
              </a>
            );
          })}
        </section>

        {/* Portfolio Showcase Grid */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Featured Projects</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: "IELTS AI Platform", desc: "Automated test reviewer leveraging advanced prompt metrics.", tag: "SaaS", gradient: "from-violet-600 to-fuchsia-600" },
              { title: "NovaPay Wallet", desc: "Decentralized dashboard supporting Web3 ledger transfers.", tag: "Crypto", gradient: "from-emerald-600 to-teal-600" },
              { title: "Club Sphere Hubs", desc: "Unified platform coordinating collegiate student forums.", tag: "Web App", gradient: "from-blue-600 to-indigo-600" },
              { title: "AI Agent OS Node", desc: "Local console system running offline compiler containers.", tag: "Systems", gradient: "from-slate-700 to-slate-900" },
            ].map((proj) => (
              <div
                key={proj.title}
                className="group flex flex-col justify-between rounded-xl border border-zinc-900 bg-zinc-950 p-4 hover:border-violet-500/25 hover:shadow-lg transition duration-300"
              >
                <div>
                  {/* Dynamic Mock Graphic Gradient Area */}
                  <div className={`h-24 w-full rounded-lg bg-gradient-to-br ${proj.gradient} mb-3 flex items-center justify-center border border-zinc-900 shadow-inner relative overflow-hidden group-hover:opacity-90 transition`}>
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition" />
                    <Sparkles className="h-7 w-7 text-white/40 drop-shadow animate-pulse" />
                    <span className="absolute top-2 right-2 rounded-full bg-black/45 px-2 py-0.5 text-[9px] font-bold text-zinc-350 border border-zinc-800">
                      {proj.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">{proj.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-normal">{proj.desc}</p>
                </div>
                
                <div className="mt-4">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-400 group-hover:text-violet-350 hover:underline"
                  >
                    Visit Project
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Content Section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Latest Content</h2>
          <div className="space-y-3">
            {[
              { title: "Building a Next.js SaaS from scratch in 1 hour", details: "YouTube Video • 14:20 mins", date: "June 2, 2026", type: "youtube", icon: Play },
              { title: "Why Tailwind v4 compiler is a frontend game changer", details: "Blog Post • 5 min read", date: "May 28, 2026", type: "blog", icon: BookOpen },
              { title: "AI Agent OS v2.0 dashboard release logs", details: "Project Log • Github Releases", date: "May 20, 2026", type: "release", icon: TrendingUp },
            ].map((content) => {
              const Icon = content.icon;
              return (
                <a
                  key={content.title}
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLinkClick}
                  className="group flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950 p-4 hover:border-violet-500/20 hover:bg-zinc-900/10 transition duration-300"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="rounded-lg bg-zinc-900 border border-zinc-850 p-2 text-zinc-450 group-hover:bg-violet-600/10 group-hover:text-violet-400 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors truncate">
                        {content.title}
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{content.details}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-medium shrink-0 ml-4 font-mono">{content.date}</span>
                </a>
              );
            })}
          </div>
        </section>

        {/* Digital Products Store */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Digital Products</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { id: "prod-1", title: "Portfolio Template", price: "$15", desc: "Clean Next.js layout presets." },
              { id: "prod-2", title: "Resume Template", price: "$9", desc: "ATS-compliant developer template." },
              { id: "prod-3", title: "Developer Toolkit", price: "$29", desc: "Aesthetic UI blocks & snippets." },
            ].map((prod) => {
              const isBuying = buyingId === prod.id;
              return (
                <div
                  key={prod.id}
                  className="flex flex-col justify-between rounded-xl border border-zinc-900 bg-zinc-950 p-4 hover:border-violet-500/20 transition duration-300"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="rounded bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 text-[10px] font-bold text-violet-300 font-mono">
                        {prod.price}
                      </span>
                    </div>
                    <h3 className="text-xs font-semibold text-white">{prod.title}</h3>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-normal">{prod.desc}</p>
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
                          Buy Template
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonials section */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Testimonials</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "Sarah Jenkins", role: "Lead Designer", review: "Lenny is a wizard. Built our entire frontend prototype dashboard mockups in record time.", init: "SJ" },
              { name: "David Chen", role: "Tech Lead", review: "Outstanding communication and top-tier code quality. The UI transitions are stunningly optimized.", init: "DC" },
              { name: "Amara Okafor", role: "Founder", review: "NovaPay looks incredibly beautiful. The premium Vercel-like aesthetics are developer class.", init: "AO" },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-zinc-900 bg-zinc-950/45 p-4 flex flex-col justify-between"
              >
                <p className="text-[10px] italic leading-relaxed text-zinc-400">"{t.review}"</p>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-900/60">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-[9px] font-bold text-white flex items-center justify-center">
                    {t.init}
                  </div>
                  <div>
                    <h4 className="text-[10px] font-semibold text-white">{t.name}</h4>
                    <p className="text-[8px] text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="rounded-xl border border-zinc-900 bg-zinc-950 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-violet-400" />
              Get in Touch
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Send a message directly to my creator inbox.</p>
          </div>

          {formStatus === "success" ? (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-center text-xs text-emerald-400 animate-in fade-in duration-300">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-emerald-400 animate-bounce" />
              <p className="font-semibold">Thank you for your message!</p>
              <p className="text-zinc-500 mt-1">I will get back to you at the email provided shortly.</p>
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
                className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 py-2.5 text-xs font-bold text-white hover:from-violet-500 hover:to-fuchsia-400 transition cursor-pointer flex items-center justify-center gap-1.5"
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
          <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
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
          <div className="flex justify-center gap-4 text-[10px] text-zinc-500">
            <Link href="/" className="hover:text-white transition">Get Started</Link>
            <Link href="/templates" className="hover:text-white transition">Templates</Link>
            <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
          </div>
        </footer>

      </main>

      {/* Floating Share Control Bar (Bottom Right on Desktop, Center Bottom on Mobile) */}
      <div className="fixed bottom-6 z-40 flex items-center gap-2 rounded-full border border-zinc-850 bg-zinc-950/90 p-1.5 shadow-2xl shadow-black backdrop-blur-md animate-in slide-in-from-bottom-12 duration-500">
        <button
          onClick={handleCopyLink}
          className="flex h-9 items-center gap-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 px-3.5 text-xs font-semibold text-violet-300 hover:bg-violet-600 hover:text-white transition cursor-pointer"
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

      {/* Success Notification Toasts */}
      {copyToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-emerald-400 shadow-xl shadow-black animate-in fade-in zoom-in-95">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Page URL copied to clipboard!</span>
        </div>
      )}

      {storeToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-violet-300 shadow-xl shadow-black animate-in fade-in zoom-in-95">
          <Sparkles className="h-3.5 w-3.5 animate-bounce" />
          <span>Thank you! Initiating mock checkout for {purchasedItem}.</span>
        </div>
      )}
    </div>
  );
}
