// ─── Accent Color Swatches ──────────────────────────────
export const ACCENT_COLORS = [
  { hex: "#f472b6", name: "Pink Burst" },
  { hex: "#fbbf24", name: "Amber Glow" },
  { hex: "#38bdf8", name: "Cyan Spark" },
  { hex: "#9f4122", name: "Rust" },
  { hex: "#34d399", name: "Emerald Dream" },
  { hex: "#4f46e5", name: "Royal Violet" },
  { hex: "#a855f7", name: "Purple Spark" },
  { hex: "#d4af37", name: "Gold Leaf" },
  { hex: "#ffffff", name: "Solid White" },
  { hex: "#00ff88", name: "Neon Green" },
  { hex: "#ff3366", name: "Hot Pink" },
  { hex: "#0ea5e9", name: "Sky Blue" }
];

// ─── Button Shape Presets ───────────────────────────────
export const BUTTON_SHAPES = [
  { id: "rounded-none", label: "Sharp" },
  { id: "rounded-10px", label: "Rounded" },
  { id: "rounded-15px", label: "Semi" },
  { id: "rounded-20px", label: "Curvy" },
  { id: "rounded-full", label: "Pill" }
];

// ─── Typography Style Presets ───────────────────────────
export const TYPOGRAPHY_STYLES = [
  { id: "font-sans", label: "Modern Sans" },
  { id: "font-serif", label: "Classic Serif" },
  { id: "font-mono", label: "Clean Mono" }
];

// ─── Title Color Presets ────────────────────────────────
export const TITLE_COLORS = [
  { hex: "#ffffff", name: "White", darkOnly: true },
  { hex: "#000000", name: "Black", lightOnly: true },
  { hex: "#f472b6", name: "Pink" },
  { hex: "#a855f7", name: "Purple" },
  { hex: "#38bdf8", name: "Cyan" },
  { hex: "#00ff88", name: "Neon Green" },
  { hex: "#fbbf24", name: "Gold" },
  { hex: "#d4af37", name: "Luxury Gold" },
  { hex: "#ff3366", name: "Hot Pink" },
  { hex: "#e94560", name: "Coral" },
  { hex: "accent", name: "Match Accent" }
];

// ─── Bio Card Style Presets ─────────────────────────────
export const BIO_CARD_STYLES = [
  {
    id: "transparent",
    label: "Transparent",
    darkClass: "bg-transparent border-none text-zinc-300",
    lightClass: "bg-transparent border-none text-zinc-600"
  },
  {
    id: "glass",
    label: "Glass",
    darkClass: "bg-white/10 backdrop-blur-xl border border-white/20 text-zinc-200 shadow-lg",
    lightClass: "bg-white/40 backdrop-blur-xl border border-white/60 text-zinc-700 shadow-sm"
  },
  {
    id: "solid",
    label: "Solid",
    darkClass: "bg-zinc-900 border border-zinc-800 text-zinc-300",
    lightClass: "bg-white border border-black/10 text-zinc-700 shadow-sm"
  },
  {
    id: "gradient",
    label: "Gradient",
    darkClass: "bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 text-violet-100",
    lightClass: "bg-gradient-to-br from-violet-100/60 to-fuchsia-100/60 border border-violet-200/40 text-violet-900"
  },
  {
    id: "neon",
    label: "Neon Glow",
    darkClass: "bg-zinc-950/70 border border-cyan-500/30 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]",
    lightClass: "bg-white/50 border border-violet-400/30 text-violet-700 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
  },
  {
    id: "minimal",
    label: "Minimal Line",
    darkClass: "bg-transparent border-l-2 border-white/20 text-zinc-400 pl-3 rounded-none",
    lightClass: "bg-transparent border-l-2 border-black/15 text-zinc-500 pl-3 rounded-none"
  }
];

// ─── Link Style Presets (8 styles) ──────────────────────
export const LINK_STYLE_PRESETS = [
  {
    id: "minimal",
    label: "Minimal",
    description: "Clean and simple",
    darkClass: "bg-zinc-900/60 border border-zinc-800 text-white hover:bg-zinc-800/80",
    lightClass: "bg-white/50 border border-black/10 text-zinc-900 hover:bg-white/70"
  },
  {
    id: "glass",
    label: "Glass",
    description: "Frosted translucent",
    darkClass: "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/15 shadow-lg shadow-black/10",
    lightClass: "bg-white/40 backdrop-blur-xl border border-white/60 text-zinc-900 hover:bg-white/60 shadow-lg shadow-black/5"
  },
  {
    id: "neon",
    label: "Neon",
    description: "Glowing edges",
    darkClass: "bg-zinc-950/80 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-shadow",
    lightClass: "bg-white/60 border-2 border-violet-400/40 text-violet-700 hover:border-violet-500/70 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-shadow"
  },
  {
    id: "luxury",
    label: "Luxury",
    description: "Gold accents",
    darkClass: "bg-zinc-950/70 border border-amber-500/30 text-amber-100 hover:border-amber-400/50 shadow-lg shadow-amber-900/10",
    lightClass: "bg-amber-50/50 border border-amber-300/40 text-amber-900 hover:border-amber-400/60 shadow-md"
  },
  {
    id: "gradient",
    label: "Gradient",
    description: "Vibrant fills",
    darkClass: "bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 text-white hover:from-violet-600/30 hover:to-fuchsia-600/30",
    lightClass: "bg-gradient-to-r from-violet-100/60 to-fuchsia-100/60 border border-violet-200/40 text-violet-900 hover:from-violet-100/80 hover:to-fuchsia-100/80"
  },
  {
    id: "outline",
    label: "Outline",
    description: "Border only",
    darkClass: "bg-transparent border-2 border-zinc-600 text-zinc-200 hover:border-white hover:text-white",
    lightClass: "bg-transparent border-2 border-zinc-300 text-zinc-700 hover:border-zinc-600 hover:text-zinc-900"
  },
  {
    id: "soft-shadow",
    label: "Soft Shadow",
    description: "Elevated cards",
    darkClass: "bg-zinc-900/50 border border-zinc-800/50 text-white shadow-xl shadow-black/30 hover:shadow-2xl hover:-translate-y-0.5",
    lightClass: "bg-white/70 border border-white/80 text-zinc-900 shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5"
  },
  {
    id: "floating-3d",
    label: "3D Floating",
    description: "Depth & perspective",
    darkClass: "bg-zinc-900/60 border border-zinc-700/50 text-white shadow-[0_8px_30px_rgba(0,0,0,0.4),0_2px_4px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-all",
    lightClass: "bg-white/60 border border-white/70 text-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.15)] transition-all"
  }
];

// ─── Animated Background Definitions (10 backgrounds) ───
export const ANIMATED_BACKGROUNDS = [
  {
    id: "aurora-waves",
    label: "Aurora Waves",
    emoji: "🌊",
    description: "Flowing gradient waves",
    previewGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
  },
  {
    id: "floating-orbs",
    label: "Floating Orbs",
    emoji: "🔮",
    description: "3D glowing spheres",
    previewGradient: "linear-gradient(135deg, #0c0a1a 0%, #1a0533 50%, #0d0d2b 100%)"
  },
  {
    id: "particle-universe",
    label: "Particle Universe",
    emoji: "✨",
    description: "Floating particles",
    previewGradient: "linear-gradient(135deg, #0a0a1a 0%, #111133 50%, #0a0a2e 100%)"
  },
  {
    id: "developer-grid",
    label: "Developer Grid",
    emoji: "💻",
    description: "Terminal-inspired grid",
    previewGradient: "linear-gradient(135deg, #0a0f0a 0%, #0d1a0d 50%, #0a120a 100%)"
  },
  {
    id: "glass-bubbles",
    label: "Glass Bubbles",
    emoji: "🫧",
    description: "VisionOS style spheres",
    previewGradient: "linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 50%, #e1f5fe 100%)"
  },
  {
    id: "gradient-mesh",
    label: "Gradient Mesh",
    emoji: "🎨",
    description: "Modern startup mesh",
    previewGradient: "linear-gradient(135deg, #667eea 0%, #f093fb 50%, #5ee7df 100%)"
  },
  {
    id: "liquid-flow",
    label: "Liquid Flow",
    emoji: "💧",
    description: "Organic morphing shapes",
    previewGradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
  },
  {
    id: "neural-network",
    label: "Neural Network",
    emoji: "🧠",
    description: "AI nodes & connections",
    previewGradient: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%)"
  },
  {
    id: "northern-lights",
    label: "Northern Lights",
    emoji: "🌌",
    description: "Aurora borealis effect",
    previewGradient: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #061a14 100%)"
  },
  {
    id: "luxury-sparkles",
    label: "Luxury Sparkles",
    emoji: "💎",
    description: "Gold particle elegance",
    previewGradient: "linear-gradient(135deg, #1a1a1a 0%, #2d1f0e 50%, #1a1a1a 100%)"
  }
];

// ─── Static Background Presets (Non-animated) ───────────
export const BACKGROUND_PRESETS = [
  { id: "bg-zinc-950", label: "Minimal Dark", color: "#09090b" },
  { id: "bg-[#0B031E]", label: "Midnight Deep", color: "#0b031e" },
  { id: "bg-[#fff9ee]", label: "Cozy Sand", color: "#fff9ee" },
  { id: "bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-800 animate-gradient", label: "Glass Aurora 🌀", color: "#312e81", isGradient: true },
  { id: "bg-gradient-to-br from-orange-600 via-rose-600 to-indigo-900 animate-gradient", label: "Sunset Drift 🌅", color: "#ea580c", isGradient: true },
  { id: "bg-gradient-to-tr from-emerald-900 via-teal-900 to-slate-950 animate-gradient", label: "Emerald Dream 🌲", color: "#064e3b", isGradient: true },
  { id: "bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 animate-gradient", label: "Pastel Velvet 🌸", color: "#fbcfe8", isGradient: true },
  { id: "bg-gradient-to-tr from-slate-950 via-purple-950 to-indigo-950 animate-gradient", label: "Cosmic Glow ✨", color: "#1e1b4b", isGradient: true }
];

// ─── 10 Built-in Theme Definitions ──────────────────────
export const BUILT_IN_THEMES = [
  {
    id: "apple-glass",
    name: "Apple Glass",
    emoji: "🍎",
    description: "VisionOS frosted glass, floating UI",
    preview: {
      bg: "linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 50%, #e1f5fe 100%)",
      accent: "#007AFF",
      textColor: "#1d1d1f"
    },
    config: {
      accentColor: "#007AFF",
      fontFamily: "font-sans",
      buttonStyle: "rounded-xl",
      background: "glass-bubbles",
      linkStyle: "glass",
      animationStrength: 0.5,
      blur: 24,
      shadowIntensity: 0.3,
      cardTransparency: 60,
      isLight: true
    }
  },
  {
    id: "aurora-glow",
    name: "Aurora Glow",
    emoji: "🌈",
    description: "Purple, pink, cyan soft neon",
    preview: {
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      accent: "#c084fc",
      textColor: "#ffffff"
    },
    config: {
      accentColor: "#c084fc",
      fontFamily: "font-sans",
      buttonStyle: "rounded-full",
      background: "aurora-waves",
      linkStyle: "glass",
      animationStrength: 0.7,
      blur: 20,
      shadowIntensity: 0.6,
      cardTransparency: 40,
      isLight: false
    }
  },
  {
    id: "developer-os",
    name: "Developer OS",
    emoji: "💻",
    description: "GitHub terminal, neon green",
    preview: {
      bg: "linear-gradient(135deg, #0a0f0a 0%, #0d1a0d 50%, #0a120a 100%)",
      accent: "#00ff88",
      textColor: "#00ff88"
    },
    config: {
      accentColor: "#00ff88",
      fontFamily: "font-mono",
      buttonStyle: "rounded-none",
      background: "developer-grid",
      linkStyle: "neon",
      animationStrength: 0.4,
      blur: 0,
      shadowIntensity: 0.5,
      cardTransparency: 20,
      isLight: false
    }
  },
  {
    id: "luxury-black",
    name: "Luxury Black",
    emoji: "🖤",
    description: "Matte black, gold accents, premium",
    preview: {
      bg: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)",
      accent: "#d4af37",
      textColor: "#d4af37"
    },
    config: {
      accentColor: "#d4af37",
      fontFamily: "font-serif",
      buttonStyle: "rounded-md",
      background: "luxury-sparkles",
      linkStyle: "luxury",
      animationStrength: 0.3,
      blur: 12,
      shadowIntensity: 0.8,
      cardTransparency: 30,
      isLight: false
    }
  },
  {
    id: "student-pro",
    name: "Student Pro",
    emoji: "🎓",
    description: "Clean white, blue highlights",
    preview: {
      bg: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f0f9ff 100%)",
      accent: "#2563eb",
      textColor: "#1e3a5f"
    },
    config: {
      accentColor: "#2563eb",
      fontFamily: "font-sans",
      buttonStyle: "rounded-xl",
      background: "none",
      linkStyle: "soft-shadow",
      animationStrength: 0.2,
      blur: 16,
      shadowIntensity: 0.4,
      cardTransparency: 70,
      isLight: true
    }
  },
  {
    id: "creator-hub",
    name: "Creator Hub",
    emoji: "🎨",
    description: "Instagram-inspired vibrant gradients",
    preview: {
      bg: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
      accent: "#fd1d1d",
      textColor: "#ffffff"
    },
    config: {
      accentColor: "#fd1d1d",
      fontFamily: "font-sans",
      buttonStyle: "rounded-full",
      background: "gradient-mesh",
      linkStyle: "gradient",
      animationStrength: 0.6,
      blur: 18,
      shadowIntensity: 0.5,
      cardTransparency: 35,
      isLight: false
    }
  },
  {
    id: "gaming-rgb",
    name: "Gaming RGB",
    emoji: "🎮",
    description: "RGB effects, animated glow",
    preview: {
      bg: "linear-gradient(135deg, #0a0a1a 0%, #1a0033 50%, #000a1a 100%)",
      accent: "#ff0080",
      textColor: "#ffffff"
    },
    config: {
      accentColor: "#ff0080",
      fontFamily: "font-mono",
      buttonStyle: "rounded-md",
      background: "neural-network",
      linkStyle: "neon",
      animationStrength: 0.8,
      blur: 8,
      shadowIntensity: 0.9,
      cardTransparency: 25,
      isLight: false
    }
  },
  {
    id: "music-artist",
    name: "Music Artist",
    emoji: "🎵",
    description: "Album-inspired, visualizer effects",
    preview: {
      bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      accent: "#e94560",
      textColor: "#ffffff"
    },
    config: {
      accentColor: "#e94560",
      fontFamily: "font-sans",
      buttonStyle: "rounded-xl",
      background: "liquid-flow",
      linkStyle: "floating-3d",
      animationStrength: 0.7,
      blur: 14,
      shadowIntensity: 0.7,
      cardTransparency: 30,
      isLight: false
    }
  },
  {
    id: "startup-founder",
    name: "Startup Founder",
    emoji: "🚀",
    description: "Linear/Vercel professional SaaS",
    preview: {
      bg: "linear-gradient(135deg, #000000 0%, #111111 50%, #000000 100%)",
      accent: "#ffffff",
      textColor: "#ffffff"
    },
    config: {
      accentColor: "#ffffff",
      fontFamily: "font-sans",
      buttonStyle: "rounded-xl",
      background: "particle-universe",
      linkStyle: "outline",
      animationStrength: 0.3,
      blur: 0,
      shadowIntensity: 0.2,
      cardTransparency: 15,
      isLight: false
    }
  },
  {
    id: "minimal-mono",
    name: "Minimal Mono",
    emoji: "⬛",
    description: "Black & white editorial design",
    preview: {
      bg: "linear-gradient(135deg, #ffffff 0%, #fafafa 50%, #f5f5f5 100%)",
      accent: "#000000",
      textColor: "#000000"
    },
    config: {
      accentColor: "#000000",
      fontFamily: "font-mono",
      buttonStyle: "rounded-none",
      background: "none",
      linkStyle: "minimal",
      animationStrength: 0,
      blur: 0,
      shadowIntensity: 0.1,
      cardTransparency: 80,
      isLight: true
    }
  }
];
