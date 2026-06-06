"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {
  Sparkles,
  User,
  LayoutGrid,
  Link as LinkIcon,
  Plus,
  PlusCircle,
  ArrowUp,
  Palette,
  Type,
  Grid,
  UploadCloud,
  ShieldCheck,
  Database,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code,
  Terminal,
  Compass,
  TrendingUp,
  PieChart,
  LineChart,
  BarChart3,
  Check,
  ArrowRight,
  ToggleRight
} from "lucide-react";

/* ─── Typewriter Hook Prompts ───────────────────────────────── */

const prompts = [
  "I'm a student looking for software engineering internships.",
  "Create a sleek landing page for my UI/UX design studio.",
  "Build a link-in-bio page for my photography portfolio.",
  "Make a minimalistic profile with GitHub and Twitter widgets."
];

function useTypewriter() {
  const [text, setText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const indexRef = useRef(0);
  const directionRef = useRef("forward");

  useEffect(() => {
    let timeout;
    const currentPrompt = prompts[promptIndex];
    
    const tick = () => {
      if (directionRef.current === "forward") {
        if (indexRef.current < currentPrompt.length) {
          indexRef.current++;
          setText(currentPrompt.slice(0, indexRef.current));
          timeout = setTimeout(tick, 60);
        } else {
          directionRef.current = "pause";
          timeout = setTimeout(tick, 2500);
        }
      } else if (directionRef.current === "pause") {
        directionRef.current = "backward";
        timeout = setTimeout(tick, 30);
      } else {
        if (indexRef.current > 0) {
          indexRef.current--;
          setText(currentPrompt.slice(0, indexRef.current));
          timeout = setTimeout(tick, 20);
        } else {
          directionRef.current = "forward";
          setPromptIndex((prev) => (prev + 1) % prompts.length);
          timeout = setTimeout(tick, 600);
        }
      }
    };
    timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, [promptIndex]);

  return text;
}

/* ─── FAQ Accordion Data ─────────────────────────────────────── */

const faqItems = [
  {
    question: "What is Blinko?",
    answer: "Blinko is an AI-powered link-in-bio and mini website builder. It allows you to design and launch your online presence in seconds using natural language description.",
  },
  {
    question: "How does Blinko work?",
    answer: "Describe the design, links, and content you want. Blinko's AI synthesis engine compiles a gorgeous custom digital layout with edge-optimized performance instantly.",
  },
  {
    question: "Can I export my code?",
    answer: "Yes, you can export the clean, structured HTML/CSS code of your generated pages anytime for self-hosting or styling modification.",
  },
  {
    question: "Is there a free trial?",
    answer: "We offer a generous Free tier featuring 1 Neural Identity, basic UI components, and a blinko.site subdomain. You can upgrade to Pro for advanced features.",
  },
  {
    question: "How secure is my data on Blinko?",
    answer: "Your data is securely stored and managed using industry-standard encryption. We prioritize your privacy and do not sell your personal information.",
  },
  {
    question: "Can I collaborate with my team in real-time?",
    answer: "Yes! Our Pro and Enterprise plans support collaborative editing workspaces, enabling teams to build and scale layouts together.",
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer: "Yes, we support custom enterprise branding, dedicated custom templates, premium SLAs, dedicated support, and custom domain routing.",
  },
];

/* ─── Showcase Carousel Cards ────────────────────────────────── */

const showcaseCards = [
  {
    title: "Developer Portfolio",
    gradientClass: "from-[#3B82F6]/30 via-[#8B5CF6]/20 to-[#EC4899]/30",
    color: "#3B82F6",
    details: (
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="h-32 bg-[#3B82F6]/20 border border-white/50 rounded flex flex-col items-center justify-center">
          <Code className="text-on-surface-variant/30 w-8 h-8" />
          <span className="text-[10px] text-on-surface-variant/60 font-semibold mt-1">Projects</span>
        </div>
        <div className="h-32 bg-[#A855F7]/20 border border-white/50 rounded flex flex-col items-center justify-center">
          <Terminal className="text-on-surface-variant/30 w-8 h-8" />
          <span className="text-[10px] text-on-surface-variant/60 font-semibold mt-1">Terminal</span>
        </div>
      </div>
    )
  },
  {
    title: "Creative Studio",
    gradientClass: "from-[#A855F7]/30 via-[#EC4899]/20 to-[#F59E0B]/30",
    color: "#A855F7",
    details: (
      <div className="flex-1 border-t border-b border-white/40 flex flex-col gap-4 py-4 justify-center">
        <div className="h-4 bg-white/80 rounded w-full"></div>
        <div className="h-4 bg-white/80 rounded w-5/6"></div>
        <div className="h-4 bg-white/80 rounded w-2/3"></div>
      </div>
    )
  },
  {
    title: "Travel Explorer",
    gradientClass: "from-[#F43F5E]/30 via-[#BE185D]/20 to-[#FF5E3A]/30",
    color: "#F43F5E",
    details: (
      <div className="h-36 bg-white/50 rounded-lg border border-white/60 flex items-center justify-center">
        <Compass className="text-on-surface-variant/40 w-10 h-10 animate-bounce-subtle" />
      </div>
    )
  },
  {
    title: "Venture Dashboard",
    gradientClass: "from-[#F59E0B]/30 via-[#EF4444]/20 to-[#10B981]/30",
    color: "#F59E0B",
    details: (
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-white/80 rounded p-2 flex items-center justify-center"><TrendingUp className="text-on-surface-variant/30 w-6 h-6" /></div>
        <div className="bg-white/80 rounded p-2 flex items-center justify-center"><PieChart className="text-on-surface-variant/30 w-6 h-6" /></div>
        <div className="bg-white/80 rounded p-2 flex items-center justify-center"><LineChart className="text-on-surface-variant/30 w-6 h-6" /></div>
        <div className="bg-white/80 rounded p-2 flex items-center justify-center"><BarChart3 className="text-on-surface-variant/30 w-6 h-6" /></div>
      </div>
    )
  }
];

/* ─── Page ──────────────────────────────────────────────────── */

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const typedText = useTypewriter();
  const [promptValue, setPromptValue] = useState("");
  const [activeTab, setActiveTab] = useState("Chat");
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const scrollRef = useRef(null);

  const handleSubmit = () => {
    const trimmed = promptValue.trim();
    if (!trimmed) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("blinko_pending_prompt", trimmed);
    }

    if (user) {
      router.push(`/dashboard/ai-builder?prompt=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/signup");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    let text = "";
    if (suggestion === "Developer Portfolio") {
      text = "I'm a computer science student looking for software engineering internships.";
    } else if (suggestion === "Creative Studio") {
      text = "Create a sleek landing page for my UI/UX design studio.";
    } else if (suggestion === "Link Hub") {
      text = "Build a link-in-bio page for my photography portfolio.";
    } else if (suggestion === "Venture Page") {
      text = "Create a modern dashboard page for a fintech startup.";
    }
    setPromptValue(text);
  };

  /* Mouse glow position coordinates */
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e, rect) => {
    if (rect) {
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const scrollShowcase = (direction) => {
    if (!scrollRef.current) return;
    const amount = 424; // card width (400) + gap (24)
    scrollRef.current.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container min-h-screen relative grain">
      <Navbar />

      <main className="max-w-[1728px] mx-auto w-full">
        {/* Section 1: Hero */}
        <section
          className="relative pt-48 pb-section-gap px-container-padding min-h-[95vh] flex flex-col items-center justify-center text-center overflow-hidden"
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget.getBoundingClientRect())}
          style={{
            "--mouse-x": `${mousePos.x}px`,
            "--mouse-y": `${mousePos.y}px`
          }}
        >
          {/* Animated glow background matching Luminous Horizon colors */}
          <div
            className="absolute inset-0 -z-10 transition-all duration-700 ease-out"
            style={{
              background: `radial-gradient(1200px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(79, 70, 229, 0.2), rgba(217, 70, 239, 0.15), rgba(139, 92, 246, 0.08), transparent 80%), linear-gradient(135deg, #e8dbfc 0%, #f6e8e2 50%, #e0d7f5 100%)`
            }}
          ></div>

          <h1 className="font-display-xl text-display-xl text-on-surface max-w-4xl mb-6">
            Build with Blinko
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-12">
            Blinko lets you build beautiful link-in-bio sites and profiles in minutes. An airy, minimalist workspace designed for seamless AI integration.
          </p>

          {/* Prompt inputs container */}
          <div className="w-full max-w-[870px] bg-white/40 rounded-3xl border border-white/60 shadow-[0_8px_32px_rgba(159,65,34,0.04)] p-6 mb-8 backdrop-blur-xl">
            <div className="flex flex-col gap-4">
              <textarea
                className="w-full bg-transparent border-none resize-none font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:ring-0 min-h-[80px] outline-none"
                placeholder={typedText ? `e.g., "${typedText}"` : "Describe the digital presence you want to build..."}
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              ></textarea>
              <div className="flex items-center justify-between pt-4 border-t border-white/40">
                <div className="flex items-center gap-3">
                  <button className="p-2 rounded-full hover:bg-white/50 transition-colors text-on-surface-variant flex items-center justify-center border border-white/45">
                    <Plus className="w-5 h-5 text-on-surface-variant" />
                  </button>
                  <div className="flex items-center gap-2 bg-white/50 border border-white/60 rounded-full px-4 py-2 cursor-pointer shadow-sm">
                    <span className="font-body-md text-body-md text-on-surface-variant">Plan Mode</span>
                    <ToggleRight className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!promptValue.trim()}
                  className="bg-white/50 border border-white/60 text-on-surface rounded-full w-12 h-12 flex items-center justify-center shadow-sm hover:bg-white/70 transition-colors scale-95 active:scale-90 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleSuggestionClick("Developer Portfolio")}
              className="bg-white/30 text-on-surface border border-white/50 shadow-sm rounded-full px-5 py-2 font-body-md text-body-md hover:bg-white/50 transition-colors backdrop-blur-md"
            >
              Developer Portfolio
            </button>
            <button
              onClick={() => handleSuggestionClick("Creative Studio")}
              className="bg-white/30 text-on-surface border border-white/50 shadow-sm rounded-full px-5 py-2 font-body-md text-body-md hover:bg-white/50 transition-colors backdrop-blur-md"
            >
              Creative Studio
            </button>
            <button
              onClick={() => handleSuggestionClick("Link Hub")}
              className="bg-white/30 text-on-surface border border-white/50 shadow-sm rounded-full px-5 py-2 font-body-md text-body-md hover:bg-white/50 transition-colors backdrop-blur-md"
            >
              Link Hub
            </button>
            <button
              onClick={() => handleSuggestionClick("Venture Page")}
              className="bg-white/30 text-on-surface border border-white/50 shadow-sm rounded-full px-5 py-2 font-body-md text-body-md hover:bg-white/50 transition-colors backdrop-blur-md"
            >
              Venture Page
            </button>
          </div>
        </section>

        {/* Section 2: Minimal Slogan */}
        <section className="py-section-gap px-container-padding bg-surface relative min-h-[400px] flex items-center justify-center border-y border-black/5">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="font-display-xl text-[48px] leading-[1.3] md:text-[62px] font-normal text-on-surface tracking-tight">
              Imagine a link-in-bio page that feels like a premium workspace.
            </h2>
          </div>
        </section>

        {/* Section 3: Feature 01 (Tell Blinko your idea) */}
        <section id="features" className="pt-section-gap pb-0 px-container-padding relative">
          <div className="max-w-[1118px] mx-auto bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/60 shadow-[0_8px_32px_rgba(159,65,34,0.04)] overflow-hidden flex flex-col md:flex-row min-h-[596px]">
            <div className="p-card-internal flex-1 flex flex-col justify-center">
              <span className="font-label-caps text-label-caps text-on-surface-variant mb-6 tracking-widest uppercase">01 / 02</span>
              <h3 className="font-headline-lg text-[32px] text-on-surface mb-6 leading-tight">Tell Blinko your digital presence idea...</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md">
                Transform your career, links, and content into functional micro-websites seamlessly. Our intuitive builder lets you craft beautiful layouts without traditional constraints.
              </p>
              <a className="inline-flex items-center justify-center gap-2 bg-white/45 border border-white/60 shadow-sm backdrop-blur-md text-on-surface font-body-md text-body-md font-medium px-8 py-4 rounded-[100px] w-fit hover:bg-white/60 hover:-translate-y-0.5 transition-all" href="/signup">
                Start building
              </a>
            </div>

            <div className="flex-1 bg-white/20 relative overflow-hidden flex items-center justify-end border-l border-white/40">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF5E3A]/20 via-[#A855F7]/10 to-[#80b1c7]/20"></div>
              
              {/* Decorative Blur Blobs */}
              <div className="absolute inset-0 overflow-hidden opacity-30">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/30 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-tertiary/30 rounded-full blur-[100px]"></div>
              </div>

              {/* Glassmorphic tab workspace */}
              <div className="relative z-10 w-[85%] h-[80%] mx-auto bg-white/10 backdrop-blur-[32px] rounded-3xl border border-white/40 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center justify-center p-4 border-b border-white/10">
                  <div className="flex p-1 rounded-full border border-white/20 backdrop-blur-md bg-white/40">
                    {["Chat", "Idea", "Narration"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all ${
                          activeTab === tab
                            ? "bg-white text-on-surface shadow-sm"
                            : "text-on-surface-variant hover:text-primary"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content switching based on active tab */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
                  {activeTab === "Chat" && (
                    <div className="space-y-5">
                      {/* Bot Message */}
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary/20 shrink-0 border border-white/45 flex items-center justify-center">
                          <Sparkles className="text-primary w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-2 w-20 bg-on-surface/40 rounded-full"></div>
                          <div className="bg-white/40 rounded-2xl rounded-tl-none p-3 border border-white/60 shadow-sm text-xs text-on-surface">
                            I am generating your professional developer profile template. Selecting clean layouts...
                          </div>
                        </div>
                      </div>

                      {/* User Message */}
                      <div className="flex gap-3 flex-row-reverse">
                        <div className="w-7 h-7 rounded-full bg-tertiary/20 shrink-0 border border-white/45 flex items-center justify-center">
                          <User className="text-tertiary w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-2 flex flex-col items-end">
                          <div className="h-2 w-16 bg-on-surface/40 rounded-full"></div>
                          <div className="bg-primary/10 rounded-2xl rounded-tr-none p-3 border border-primary/20 w-3/4 text-xs text-on-surface-variant">
                            Add a link to my GitHub and a contact form.
                          </div>
                        </div>
                      </div>

                      {/* Components Preview */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="h-20 bg-white/30 rounded-2xl border border-white/40 flex flex-col items-center justify-center shadow-sm">
                          <LayoutGrid className="text-primary/60 w-5 h-5 mb-1" />
                          <span className="text-[10px] font-bold text-on-surface-variant">Clean Grid</span>
                        </div>
                        <div className="h-20 bg-white/30 rounded-2xl border border-white/40 flex flex-col items-center justify-center shadow-sm">
                          <LinkIcon className="text-tertiary/60 w-5 h-5 mb-1" />
                          <span className="text-[10px] font-bold text-on-surface-variant">Social Links</span>
                        </div>
                      </div>

                      {/* Input mockup */}
                      <div className="mt-4 p-2 bg-white/50 rounded-full border border-white/60 flex items-center gap-2">
                        <PlusCircle className="text-on-surface-variant w-5 h-5 ml-2" />
                        <div className="flex-1 h-2 bg-on-surface/10 rounded-full"></div>
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
                          <ArrowUp className="text-white w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "Idea" && (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <h4 className="text-sm font-bold text-on-surface">Synthesis Specs:</h4>
                      <div className="space-y-3 font-body-md text-xs text-on-surface-variant">
                        <div className="flex items-center gap-2 bg-white/30 p-2.5 rounded-xl border border-white/40">
                          <Palette className="text-primary w-5 h-5" />
                          <span><strong>Color strategy:</strong> Parchment theme with Peach sunset highlights</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/30 p-2.5 rounded-xl border border-white/40">
                          <Type className="text-tertiary w-5 h-5" />
                          <span><strong>Typography:</strong> Plus Jakarta Sans with dramatic editorial weights</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/30 p-2.5 rounded-xl border border-white/40">
                          <Grid className="text-secondary w-5 h-5" />
                          <span><strong>Components:</strong> Glassmorphic layout panels, rounded-3xl buttons</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "Narration" && (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center animate-in fade-in duration-300">
                      <div className="flex items-center gap-1.5 h-10">
                        <div className="w-1.5 bg-primary h-8 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-1.5 bg-tertiary h-12 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-1.5 bg-primary h-6 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                        <div className="w-1.5 bg-secondary h-10 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        <div className="w-1.5 bg-tertiary h-5 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }}></div>
                      </div>
                      <p className="text-xs font-semibold text-on-surface-variant italic">
                        &ldquo;Compile my latest works into a premium glass portfolio website&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Feature 02 (Edge deployment / Backend) */}
        <section className="pt-10 pb-section-gap px-container-padding relative">
          <div className="max-w-[1118px] mx-auto bg-white/40 backdrop-blur-2xl rounded-[32px] border border-white/60 shadow-[0_8px_32px_rgba(159,65,34,0.04)] overflow-hidden flex flex-col md:flex-row min-h-[596px]">
            <div className="p-card-internal flex-1 flex flex-col justify-center">
              <span className="font-label-caps text-label-caps text-on-surface-variant mb-6 tracking-widest uppercase">02 / 02</span>
              <h3 className="font-headline-lg text-[32px] text-on-surface mb-6 leading-tight">An instant edge runtime for profiles</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-md">
                Robust infrastructure generated instantly. From ultra-fast page load times to customized search engine meta tags, Blinko writes the code so you can focus on building connections.
              </p>
            </div>

            <div className="flex-1 bg-surface relative overflow-hidden flex items-center justify-center backdrop-blur-md border-l border-white/40">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/20 via-[#EF4444]/15 to-[#BE185D]/20"></div>
              
              <div className="relative z-10 w-[80%] bg-white/60 backdrop-blur-[40px] rounded-3xl border border-white/60 shadow-[0_40px_80px_-20px_rgba(159,65,34,0.08)] p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-6 border-b border-black/5 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                      <UploadCloud className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <span className="block text-on-surface font-bold text-base leading-none">Deployment</span>
                      <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">v1.2.0-stable</span>
                    </div>
                  </div>

                  {/* Sparkline Graph */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Health</div>
                    <svg className="w-16 h-6 overflow-visible animate-pulse" viewBox="0 0 60 20">
                      <path d="M0 15 L10 12 L20 18 L30 8 L40 10 L50 4 L60 6" fill="none" stroke="#27C93F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[12px] font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#27C93F] shadow-[0_0_8px_rgba(39,201,63,0.8)] animate-pulse"></div>
                        <span className="text-on-surface">Edge Runtime</span>
                      </div>
                      <span className="text-on-surface font-mono">99.9%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden border border-black/5">
                      <div className="h-full w-[94%] bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000"></div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-medium">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="text-[#27C93F] w-4 h-4" />
                        <span className="">SSL Certification active</span>
                      </div>
                      <span className="font-mono opacity-60">12:45:01</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-medium">
                      <div className="flex items-center gap-2">
                        <Database className="text-[#27C93F] w-4 h-4" />
                        <span className="">Database migration 100%</span>
                      </div>
                      <span className="font-mono opacity-60">12:45:03</span>
                    </div>

                    <div className="flex items-center justify-between text-on-surface-variant text-[11px] font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-primary/40 border-t-primary animate-spin"></div>
                        <span className="">CDN Edge propagation...</span>
                      </div>
                      <span className="font-mono opacity-60">Running</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white/80 rounded-2xl border border-white shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-[#27C93F] w-5 h-5" />
                      <span className="text-on-surface text-[12px] font-bold">Live in production</span>
                    </div>
                    <span className="text-on-surface-variant text-[10px] font-mono font-bold px-2 py-0.5 bg-black/5 rounded">0.4ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Showcase */}
        <section className="py-section-gap bg-surface relative overflow-hidden border-y border-black/5">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(var(--color-outline-variant) 1px, transparent 1px)`, backgroundSize: "32px 32px", opacity: 0.25 }}></div>
          
          <div className="max-w-7xl mx-auto px-container-padding flex flex-col md:flex-row items-center justify-between mb-16 relative z-10">
            <div className="text-left max-w-2xl">
              <h2 className="text-headline-lg text-on-surface font-normal">
                Seamless integration from idea to execution
              </h2>
            </div>
            
            {/* Carousel navigation controls */}
            <div className="flex gap-4 mt-6 md:mt-0">
              <button
                onClick={() => scrollShowcase("prev")}
                className="w-12 h-12 rounded-full border border-white/60 bg-white/40 flex items-center justify-center hover:bg-white/60 active:scale-95 transition-all text-on-surface shadow-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scrollShowcase("next")}
                className="w-12 h-12 rounded-full border border-white/60 bg-white/40 flex items-center justify-center hover:bg-white/60 active:scale-95 transition-all text-on-surface shadow-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="w-full flex gap-6 overflow-x-auto px-8 pb-12 snap-x snap-mandatory hide-scrollbar relative z-10 justify-start md:justify-center no-scrollbar scroll-smooth"
          >
            {showcaseCards.map((card, idx) => (
              <div
                key={idx}
                className="snap-center shrink-0 w-[400px] h-[333px] bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-sm flex flex-col overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-full bg-gradient-to-br ${card.gradientClass} relative overflow-hidden p-6 flex flex-col justify-between`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                  
                  <div className="relative z-10 h-full bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between">
                    <div className="h-6 rounded mb-4 w-fit">
                      <span className="font-body-md text-on-surface font-semibold px-2">
                        {card.title}
                      </span>
                    </div>

                    {card.details}

                    <div
                      className="h-8 w-24 bg-white/80 border border-white/50 mt-auto rounded-full self-end flex items-center justify-center shadow-sm scale-95 hover:scale-100 transition-transform cursor-pointer"
                      style={{ color: card.color }}
                    >
                      <span className="text-xs font-bold font-body-md">View Site</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Pricing */}
        <section id="pricing" className="py-section-gap px-container-padding">
          <div className="max-w-[1516px] mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1: Info */}
              <div className="p-8 flex flex-col justify-center bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-[0_8px_32px_rgba(159,65,34,0.02)]">
                <h2 className="font-display-xl text-[38px] leading-tight text-on-surface mb-4">Simple, transparent pricing.</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">Choose the plan that fits your ambition. No hidden fees.</p>
              </div>

              {/* Column 2: Free Tier */}
              <div className="p-8 bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-[0_8px_32px_rgba(159,65,34,0.04)] flex flex-col relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-b from-[#80b1c7]/20 to-transparent -z-10"></div>
                <h3 className="font-headline-md text-[30px] text-on-surface mb-2">Neural Free</h3>
                <div className="font-display-xl text-[56px] text-on-surface mb-6">$0<span className="font-body-md text-body-md text-on-surface-variant">/mo</span></div>
                
                <ul className="space-y-4 mb-8 flex-1 font-body-md text-body-md text-on-surface-variant">
                  <li className="flex items-center gap-3"><Check className="text-primary w-4 h-4" /> 1 Neural Identity</li>
                  <li className="flex items-center gap-3"><Check className="text-primary w-4 h-4" /> Standard LLM Synthesis</li>
                  <li className="flex items-center gap-3"><Check className="text-primary w-4 h-4" /> Blinko Subdomain</li>
                  <li className="flex items-center gap-3"><Check className="text-primary w-4 h-4" /> Community Modules</li>
                </ul>
                
                <a className="w-full bg-white/50 backdrop-blur-md border border-white/60 shadow-sm text-on-surface rounded-full py-4 font-body-md text-body-md hover:bg-white/70 transition-colors text-center" href="/signup">
                  Get Started
                </a>
              </div>

              {/* Column 3: Pro Tier */}
              <div className="p-8 bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/60 shadow-[0_8px_32px_rgba(159,65,34,0.04)] flex flex-col relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute inset-0 bg-gradient-to-b from-[#9f4122]/15 to-[#ff8a65]/10 -z-10"></div>
                <div className="absolute top-4 right-4 bg-white/60 backdrop-blur-md border border-white/80 text-on-surface shadow-sm text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Popular</div>
                <h3 className="font-headline-md text-[30px] text-on-surface mb-2">Pro Protocol</h3>
                <div className="font-display-xl text-[56px] text-on-surface mb-6">$5<span className="font-body-md text-body-md text-on-surface-variant">/mo</span></div>
                
                <ul className="space-y-4 mb-8 flex-1 font-body-md text-body-md text-on-surface-variant">
                  <li className="flex items-center gap-3"><Check className="text-primary w-4 h-4" /> Unlimited Identities</li>
                  <li className="flex items-center gap-3"><Check className="text-primary w-4 h-4" /> Premium Neural Refinement</li>
                  <li className="flex items-center gap-3"><Check className="text-primary w-4 h-4" /> Custom Domain Mapping</li>
                  <li className="flex items-center gap-3"><Check className="text-primary w-4 h-4" /> Biometric Analytics Suite</li>
                  <li className="flex items-center gap-3"><Check className="text-primary w-4 h-4" /> Priority Synthesis Queue</li>
                </ul>
                
                <a className="w-full bg-primary text-white border border-primary/20 shadow-md rounded-full py-4 font-body-md text-body-md hover:bg-primary/95 transition-all text-center block" href="/signup">
                  Upgrade to Pro
                </a>
              </div>
            </div>

            {/* Enterprise callout banner */}
            <div className="mt-8 bg-white/40 backdrop-blur-xl rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between border border-white/60 shadow-[0_8px_32px_rgba(159,65,34,0.02)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#80b1c7]/20 to-[#9ccee4]/20 -z-10"></div>
              <div>
                <h4 className="font-headline-md text-[28px] text-on-surface mb-2">Enterprise needs?</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">Custom layouts, dedicated support SLA, and customized team roles.</p>
              </div>
              <a href="mailto:sales@blinko.site" className="mt-4 md:mt-0 bg-white/50 backdrop-blur-md border border-white/60 shadow-sm text-on-surface rounded-full px-8 py-3 font-body-md text-body-md hover:bg-white/70 transition-colors">
                Contact Sales
              </a>
            </div>
          </div>
        </section>

        {/* Section 7: FAQ (Accordion) */}
        <section className="py-section-gap px-container-padding bg-surface border-t border-black/5">
          <div className="max-w-[1515px] mx-auto flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
              <h2 className="font-display-xl text-[48px] md:text-[60px] leading-[1.1] text-on-surface sticky top-32">
                Frequently asked questions
              </h2>
            </div>
            
            <div className="lg:w-2/3 flex flex-col">
              {faqItems.map((item, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="border-b border-outline-variant/30 py-6 group cursor-pointer flex flex-col transition-all duration-300"
                  >
                    <div className="flex justify-between items-center w-full">
                      <h3 className="text-headline-md text-on-surface group-hover:text-primary transition-colors text-xl font-light">
                        {item.question}
                      </h3>
                      <Plus className={`text-on-surface-variant group-hover:text-primary transition-all duration-300 ${isOpen ? "rotate-45" : ""}`} size={24} />
                    </div>
                    
                    {/* Collapsible Answer */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? "max-h-40 mt-4 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 8: Final CTA */}
        <section
          className="py-section-gap px-container-padding relative overflow-hidden flex flex-col items-center justify-center min-h-[70vh] group/cta"
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget.getBoundingClientRect())}
          style={{
            "--mouse-x": `${mousePos.x}px`,
            "--mouse-y": `${mousePos.y}px`
          }}
        >
          <div className="absolute inset-0 bg-surface -z-10"></div>
          
          {/* Sophisticated deep gradient base */}
          <div className="absolute inset-0 opacity-40 -z-10" style={{ background: `radial-gradient(circle at 10% 20%, #4338CA 0%, transparent 60%), radial-gradient(circle at 90% 80%, #BE185D 0%, transparent 60%), radial-gradient(circle at 50% 50%, #0369A1 0%, transparent 70%)` }}></div>
          
          {/* Interactive cursor-following glow */}
          <div
            className="absolute inset-0 -z-10 opacity-0 group-hover/cta:opacity-50 transition-opacity duration-500"
            style={{
              background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(236, 72, 153, 0.5), rgba(139, 92, 246, 0.4), transparent 60%)`
            }}
          ></div>

          <h2 className="font-display-xl text-[40px] md:text-[54px] leading-tight mb-10 text-center relative z-10 max-w-2xl drop-shadow-sm text-on-surface">
            So, what are we building today?
          </h2>
          
          <a className="inline-flex items-center gap-3 bg-white/40 backdrop-blur-md border border-white/60 font-body-md text-body-md font-medium px-8 py-3.5 rounded-full hover:bg-white/60 hover:scale-105 transition-all shadow-sm group relative z-10 text-on-surface" href="/signup">
            Get started
            <div className="w-5 h-5 flex items-center justify-center">
              <ArrowRight className="text-on-surface w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}
