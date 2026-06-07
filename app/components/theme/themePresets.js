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
    id: "instagram-mesh",
    label: "Instagram Mesh",
    emoji: "📸",
    description: "Vibrant Instagram gradient",
    previewGradient: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)"
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
      background: "instagram-mesh",
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

// ─── PRO Exclusive: 10 Animated Background Definitions ──────
export const PRO_ANIMATED_BACKGROUNDS = [
  {
    id: "cyber-rain",
    label: "Cyber Rain",
    emoji: "🌧️",
    description: "Neon rainfall matrix",
    previewGradient: "linear-gradient(180deg, #0a0020 0%, #1a0040 50%, #0d001a 100%)",
    isPro: true
  },
  {
    id: "plasma-vortex",
    label: "Plasma Vortex",
    emoji: "🌀",
    description: "Swirling energy plasma",
    previewGradient: "linear-gradient(135deg, #1a0030 0%, #3d0066 50%, #0d0020 100%)",
    isPro: true
  },
  {
    id: "hologram-grid",
    label: "Hologram Grid",
    emoji: "🔷",
    description: "3D holographic wireframe",
    previewGradient: "linear-gradient(135deg, #000a1a 0%, #001133 50%, #000d26 100%)",
    isPro: true
  },
  {
    id: "void-nebula",
    label: "Void Nebula",
    emoji: "🪐",
    description: "Deep space cosmic clouds",
    previewGradient: "linear-gradient(135deg, #05000d 0%, #150025 50%, #0a0015 100%)",
    isPro: true
  },
  {
    id: "crystal-cave",
    label: "Crystal Cave",
    emoji: "💠",
    description: "Floating crystal formations",
    previewGradient: "linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #0a1628 100%)",
    isPro: true
  },
  {
    id: "ember-storm",
    label: "Ember Storm",
    emoji: "🔥",
    description: "Rising fire particles",
    previewGradient: "linear-gradient(180deg, #1a0000 0%, #330a00 50%, #1a0500 100%)",
    isPro: true
  },
  {
    id: "quantum-field",
    label: "Quantum Field",
    emoji: "⚛️",
    description: "Flickering quantum dots",
    previewGradient: "linear-gradient(135deg, #000d1a 0%, #001a33 50%, #000a1a 100%)",
    isPro: true
  },
  {
    id: "prism-aurora",
    label: "Prism Aurora",
    emoji: "🌈",
    description: "Rainbow light refractions",
    previewGradient: "linear-gradient(135deg, #0a000d 0%, #1a0033 50%, #000d1a 100%)",
    isPro: true
  },
  {
    id: "digital-rain",
    label: "Digital Rain",
    emoji: "🟢",
    description: "Matrix-style code rain",
    previewGradient: "linear-gradient(180deg, #000a00 0%, #001a00 50%, #000d00 100%)",
    isPro: true
  },
  {
    id: "cosmic-web",
    label: "Cosmic Web",
    emoji: "🕸️",
    description: "Interconnected star web",
    previewGradient: "linear-gradient(135deg, #0a0a14 0%, #14142a 50%, #0a0a1e 100%)",
    isPro: true
  }
];

// ─── PRO Exclusive: 10 Premium Theme Definitions ────────────
export const PRO_BUILT_IN_THEMES = [
  {
    id: "neon-cyberpunk",
    name: "Neon Cyberpunk",
    emoji: "⚡",
    description: "Electric neon, dark cyber city vibes",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #0a0020 0%, #1a0040 50%, #0d001a 100%)",
      accent: "#00f0ff",
      textColor: "#00f0ff"
    },
    config: {
      accentColor: "#00f0ff",
      fontFamily: "font-mono",
      buttonStyle: "rounded-none",
      background: "cyber-rain",
      linkStyle: "neon",
      animationStrength: 0.8,
      blur: 6,
      shadowIntensity: 0.9,
      cardTransparency: 15,
      isLight: false,
      titleColor: "#00f0ff",
      bioCardStyle: "neon"
    }
  },
  {
    id: "midnight-amethyst",
    name: "Midnight Amethyst",
    emoji: "💎",
    description: "Deep purple crystal elegance",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #0d001a 0%, #1a0033 50%, #0d001a 100%)",
      accent: "#bf5af2",
      textColor: "#e0b0ff"
    },
    config: {
      accentColor: "#bf5af2",
      fontFamily: "font-serif",
      buttonStyle: "rounded-20px",
      background: "void-nebula",
      linkStyle: "glass",
      animationStrength: 0.5,
      blur: 24,
      shadowIntensity: 0.7,
      cardTransparency: 25,
      isLight: false,
      titleColor: "#e0b0ff",
      bioCardStyle: "glass"
    }
  },
  {
    id: "plasma-fusion",
    name: "Plasma Fusion",
    emoji: "🌀",
    description: "Hot plasma energy, vivid gradients",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #1a0030 0%, #3d0066 50%, #0d0020 100%)",
      accent: "#ff6ec7",
      textColor: "#ffffff"
    },
    config: {
      accentColor: "#ff6ec7",
      fontFamily: "font-sans",
      buttonStyle: "rounded-full",
      background: "plasma-vortex",
      linkStyle: "gradient",
      animationStrength: 0.7,
      blur: 18,
      shadowIntensity: 0.8,
      cardTransparency: 20,
      isLight: false,
      titleColor: "#ff6ec7",
      bioCardStyle: "gradient"
    }
  },
  {
    id: "arctic-frost",
    name: "Arctic Frost",
    emoji: "❄️",
    description: "Icy blue, frozen glass surfaces",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #061a2e 100%)",
      accent: "#7dd3fc",
      textColor: "#e0f2fe"
    },
    config: {
      accentColor: "#7dd3fc",
      fontFamily: "font-sans",
      buttonStyle: "rounded-15px",
      background: "crystal-cave",
      linkStyle: "glass",
      animationStrength: 0.4,
      blur: 28,
      shadowIntensity: 0.4,
      cardTransparency: 35,
      isLight: false,
      titleColor: "#e0f2fe",
      bioCardStyle: "glass"
    }
  },
  {
    id: "inferno-dark",
    name: "Inferno Dark",
    emoji: "🔥",
    description: "Molten lava, ember particles",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #1a0000 0%, #330a00 50%, #1a0500 100%)",
      accent: "#ff4500",
      textColor: "#ffcba4"
    },
    config: {
      accentColor: "#ff4500",
      fontFamily: "font-sans",
      buttonStyle: "rounded-10px",
      background: "ember-storm",
      linkStyle: "floating-3d",
      animationStrength: 0.7,
      blur: 10,
      shadowIntensity: 0.85,
      cardTransparency: 20,
      isLight: false,
      titleColor: "#ffcba4",
      bioCardStyle: "neon"
    }
  },
  {
    id: "quantum-void",
    name: "Quantum Void",
    emoji: "⚛️",
    description: "Sci-fi quantum particles, deep void",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #000d1a 0%, #001a33 50%, #000a1a 100%)",
      accent: "#22d3ee",
      textColor: "#67e8f9"
    },
    config: {
      accentColor: "#22d3ee",
      fontFamily: "font-mono",
      buttonStyle: "rounded-md",
      background: "quantum-field",
      linkStyle: "neon",
      animationStrength: 0.6,
      blur: 12,
      shadowIntensity: 0.6,
      cardTransparency: 18,
      isLight: false,
      titleColor: "#67e8f9",
      bioCardStyle: "neon"
    }
  },
  {
    id: "holographic",
    name: "Holographic",
    emoji: "🔷",
    description: "3D hologram wireframe, futuristic",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #000a1a 0%, #001133 50%, #000d26 100%)",
      accent: "#4f8eff",
      textColor: "#93c5fd"
    },
    config: {
      accentColor: "#4f8eff",
      fontFamily: "font-mono",
      buttonStyle: "rounded-none",
      background: "hologram-grid",
      linkStyle: "outline",
      animationStrength: 0.5,
      blur: 4,
      shadowIntensity: 0.5,
      cardTransparency: 12,
      isLight: false,
      titleColor: "#93c5fd",
      bioCardStyle: "transparent"
    }
  },
  {
    id: "rose-gold-luxe",
    name: "Rose Gold Luxe",
    emoji: "🌹",
    description: "Premium rose gold, soft elegance",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #1a1012 0%, #2a1a1e 50%, #1a1012 100%)",
      accent: "#f4a4b8",
      textColor: "#fce4ec"
    },
    config: {
      accentColor: "#f4a4b8",
      fontFamily: "font-serif",
      buttonStyle: "rounded-full",
      background: "prism-aurora",
      linkStyle: "luxury",
      animationStrength: 0.3,
      blur: 20,
      shadowIntensity: 0.6,
      cardTransparency: 30,
      isLight: false,
      titleColor: "#fce4ec",
      bioCardStyle: "glass"
    }
  },
  {
    id: "matrix-code",
    name: "Matrix Code",
    emoji: "🟢",
    description: "The Matrix digital rain, green glow",
    isPro: true,
    preview: {
      bg: "linear-gradient(180deg, #000a00 0%, #001a00 50%, #000d00 100%)",
      accent: "#00ff41",
      textColor: "#00ff41"
    },
    config: {
      accentColor: "#00ff41",
      fontFamily: "font-mono",
      buttonStyle: "rounded-none",
      background: "digital-rain",
      linkStyle: "neon",
      animationStrength: 0.6,
      blur: 0,
      shadowIntensity: 0.7,
      cardTransparency: 10,
      isLight: false,
      titleColor: "#00ff41",
      bioCardStyle: "transparent"
    }
  },
  {
    id: "cosmic-architect",
    name: "Cosmic Architect",
    emoji: "🕸️",
    description: "Interconnected star constellation web",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #0a0a14 0%, #14142a 50%, #0a0a1e 100%)",
      accent: "#a78bfa",
      textColor: "#c4b5fd"
    },
    config: {
      accentColor: "#a78bfa",
      fontFamily: "font-sans",
      buttonStyle: "rounded-xl",
      background: "cosmic-web",
      linkStyle: "soft-shadow",
      animationStrength: 0.5,
      blur: 16,
      shadowIntensity: 0.5,
      cardTransparency: 25,
      isLight: false,
      titleColor: "#c4b5fd",
      bioCardStyle: "glass"
    }
  }
];

// ─── PRO Exclusive: 10 Light Animated Background Definitions ─
export const PRO_LIGHT_ANIMATED_BACKGROUNDS = [
  {
    id: "sunbeam-rays",
    label: "Sunbeam Rays",
    emoji: "☀️",
    description: "Warm golden light rays",
    previewGradient: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fef9c3 100%)",
    isPro: true
  },
  {
    id: "sakura-petals",
    label: "Sakura Petals",
    emoji: "🌸",
    description: "Falling cherry blossom petals",
    previewGradient: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5d0fe 100%)",
    isPro: true
  },
  {
    id: "cloud-drift",
    label: "Cloud Drift",
    emoji: "☁️",
    description: "Soft floating cloud layers",
    previewGradient: "linear-gradient(180deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%)",
    isPro: true
  },
  {
    id: "pastel-waves",
    label: "Pastel Waves",
    emoji: "🎀",
    description: "Flowing pastel color waves",
    previewGradient: "linear-gradient(135deg, #ede9fe 0%, #fce7f3 50%, #dbeafe 100%)",
    isPro: true
  },
  {
    id: "morning-dew",
    label: "Morning Dew",
    emoji: "🌿",
    description: "Fresh nature-inspired droplets",
    previewGradient: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #f0fdf4 100%)",
    isPro: true
  },
  {
    id: "watercolor-wash",
    label: "Watercolor Wash",
    emoji: "🎨",
    description: "Organic watercolor blending",
    previewGradient: "linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #dbeafe 100%)",
    isPro: true
  },
  {
    id: "cotton-candy",
    label: "Cotton Candy",
    emoji: "🍬",
    description: "Sweet pink & blue gradient",
    previewGradient: "linear-gradient(135deg, #fbcfe8 0%, #e0e7ff 50%, #c7d2fe 100%)",
    isPro: true
  },
  {
    id: "golden-hour",
    label: "Golden Hour",
    emoji: "🌅",
    description: "Warm sunset amber glow",
    previewGradient: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fecaca 100%)",
    isPro: true
  },
  {
    id: "ocean-breeze",
    label: "Ocean Breeze",
    emoji: "🌊",
    description: "Coastal teal ripple waves",
    previewGradient: "linear-gradient(135deg, #ccfbf1 0%, #a5f3fc 50%, #bae6fd 100%)",
    isPro: true
  },
  {
    id: "lavender-mist",
    label: "Lavender Mist",
    emoji: "💜",
    description: "Soft purple haze particles",
    previewGradient: "linear-gradient(135deg, #ede9fe 0%, #e9d5ff 50%, #f3e8ff 100%)",
    isPro: true
  }
];

// ─── PRO Exclusive: 10 Light Theme Definitions ─────────────
export const PRO_LIGHT_THEMES = [
  {
    id: "sunrise-bloom",
    name: "Sunrise Bloom",
    emoji: "🌅",
    description: "Warm amber sunrise with golden rays",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fef9c3 100%)",
      accent: "#f59e0b",
      textColor: "#78350f"
    },
    config: {
      accentColor: "#f59e0b",
      fontFamily: "font-serif",
      buttonStyle: "rounded-20px",
      background: "sunbeam-rays",
      linkStyle: "soft-shadow",
      animationStrength: 0.4,
      blur: 20,
      shadowIntensity: 0.3,
      cardTransparency: 60,
      isLight: true,
      titleColor: "#78350f",
      bioCardStyle: "glass"
    }
  },
  {
    id: "sakura-garden",
    name: "Sakura Garden",
    emoji: "🌸",
    description: "Japanese cherry blossom, soft pink",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5d0fe 100%)",
      accent: "#ec4899",
      textColor: "#831843"
    },
    config: {
      accentColor: "#ec4899",
      fontFamily: "font-sans",
      buttonStyle: "rounded-full",
      background: "sakura-petals",
      linkStyle: "glass",
      animationStrength: 0.5,
      blur: 24,
      shadowIntensity: 0.3,
      cardTransparency: 55,
      isLight: true,
      titleColor: "#831843",
      bioCardStyle: "glass"
    }
  },
  {
    id: "sky-canvas",
    name: "Sky Canvas",
    emoji: "☁️",
    description: "Dreamy sky, floating cloud layers",
    isPro: true,
    preview: {
      bg: "linear-gradient(180deg, #dbeafe 0%, #e0f2fe 50%, #f0f9ff 100%)",
      accent: "#3b82f6",
      textColor: "#1e3a5f"
    },
    config: {
      accentColor: "#3b82f6",
      fontFamily: "font-sans",
      buttonStyle: "rounded-15px",
      background: "cloud-drift",
      linkStyle: "soft-shadow",
      animationStrength: 0.3,
      blur: 20,
      shadowIntensity: 0.25,
      cardTransparency: 65,
      isLight: true,
      titleColor: "#1e3a5f",
      bioCardStyle: "solid"
    }
  },
  {
    id: "pastel-dreams",
    name: "Pastel Dreams",
    emoji: "🎀",
    description: "Soft pastel rainbow gradient flow",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #ede9fe 0%, #fce7f3 50%, #dbeafe 100%)",
      accent: "#8b5cf6",
      textColor: "#4c1d95"
    },
    config: {
      accentColor: "#8b5cf6",
      fontFamily: "font-sans",
      buttonStyle: "rounded-full",
      background: "pastel-waves",
      linkStyle: "gradient",
      animationStrength: 0.5,
      blur: 22,
      shadowIntensity: 0.35,
      cardTransparency: 50,
      isLight: true,
      titleColor: "#4c1d95",
      bioCardStyle: "gradient"
    }
  },
  {
    id: "botanical-fresh",
    name: "Botanical Fresh",
    emoji: "🌿",
    description: "Nature green, morning dew freshness",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #f0fdf4 100%)",
      accent: "#10b981",
      textColor: "#064e3b"
    },
    config: {
      accentColor: "#10b981",
      fontFamily: "font-sans",
      buttonStyle: "rounded-10px",
      background: "morning-dew",
      linkStyle: "minimal",
      animationStrength: 0.4,
      blur: 16,
      shadowIntensity: 0.2,
      cardTransparency: 60,
      isLight: true,
      titleColor: "#064e3b",
      bioCardStyle: "solid"
    }
  },
  {
    id: "watercolor-studio",
    name: "Watercolor Studio",
    emoji: "🎨",
    description: "Artistic watercolor blending effects",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #dbeafe 100%)",
      accent: "#f43f5e",
      textColor: "#881337"
    },
    config: {
      accentColor: "#f43f5e",
      fontFamily: "font-serif",
      buttonStyle: "rounded-20px",
      background: "watercolor-wash",
      linkStyle: "glass",
      animationStrength: 0.6,
      blur: 26,
      shadowIntensity: 0.35,
      cardTransparency: 45,
      isLight: true,
      titleColor: "#881337",
      bioCardStyle: "glass"
    }
  },
  {
    id: "candy-pop",
    name: "Candy Pop",
    emoji: "🍬",
    description: "Sweet cotton candy, playful vibes",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #fbcfe8 0%, #e0e7ff 50%, #c7d2fe 100%)",
      accent: "#d946ef",
      textColor: "#701a75"
    },
    config: {
      accentColor: "#d946ef",
      fontFamily: "font-sans",
      buttonStyle: "rounded-full",
      background: "cotton-candy",
      linkStyle: "gradient",
      animationStrength: 0.5,
      blur: 18,
      shadowIntensity: 0.4,
      cardTransparency: 50,
      isLight: true,
      titleColor: "#701a75",
      bioCardStyle: "gradient"
    }
  },
  {
    id: "golden-editorial",
    name: "Golden Editorial",
    emoji: "✨",
    description: "Luxury magazine, warm golden tones",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%)",
      accent: "#b45309",
      textColor: "#451a03"
    },
    config: {
      accentColor: "#b45309",
      fontFamily: "font-serif",
      buttonStyle: "rounded-none",
      background: "golden-hour",
      linkStyle: "luxury",
      animationStrength: 0.3,
      blur: 14,
      shadowIntensity: 0.3,
      cardTransparency: 55,
      isLight: true,
      titleColor: "#451a03",
      bioCardStyle: "solid"
    }
  },
  {
    id: "ocean-calm",
    name: "Ocean Calm",
    emoji: "🌊",
    description: "Coastal teal, serene water ripples",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #ccfbf1 0%, #a5f3fc 50%, #bae6fd 100%)",
      accent: "#0891b2",
      textColor: "#164e63"
    },
    config: {
      accentColor: "#0891b2",
      fontFamily: "font-sans",
      buttonStyle: "rounded-15px",
      background: "ocean-breeze",
      linkStyle: "glass",
      animationStrength: 0.4,
      blur: 22,
      shadowIntensity: 0.25,
      cardTransparency: 55,
      isLight: true,
      titleColor: "#164e63",
      bioCardStyle: "glass"
    }
  },
  {
    id: "lavender-luxe",
    name: "Lavender Luxe",
    emoji: "💜",
    description: "Soft purple haze, elegant mist",
    isPro: true,
    preview: {
      bg: "linear-gradient(135deg, #ede9fe 0%, #e9d5ff 50%, #f3e8ff 100%)",
      accent: "#7c3aed",
      textColor: "#4c1d95"
    },
    config: {
      accentColor: "#7c3aed",
      fontFamily: "font-sans",
      buttonStyle: "rounded-20px",
      background: "lavender-mist",
      linkStyle: "soft-shadow",
      animationStrength: 0.4,
      blur: 20,
      shadowIntensity: 0.3,
      cardTransparency: 55,
      isLight: true,
      titleColor: "#4c1d95",
      bioCardStyle: "glass"
    }
  }
];
