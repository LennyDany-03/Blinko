"use client";

import { Check, Sparkles, Lock } from "lucide-react";
import { ACCENT_COLORS, BUTTON_SHAPES, TYPOGRAPHY_STYLES, BACKGROUND_PRESETS } from "./themePresets";

export default function ThemeCustomizer({
  themesList = [],
  selectedThemeId = null,
  onChangeTheme,
  accentColor = "#7c3aed",
  setAccentColor,
  buttonStyle = "rounded-md",
  setButtonStyle,
  fontStyle = "font-sans",
  setFontStyle,
  backgroundType = "bg-zinc-950",
  setBackgroundType,
  setPreviewBg,
  isPro = false,
  setShowUpgradeModal
}) {
  const handleSelectTheme = (theme) => {
    const isPremiumTheme = ["Glassmorphism", "Gradient Neon", "Cyberpunk"].includes(theme.name);
    if (isPremiumTheme && !isPro) {
      setShowUpgradeModal(true);
      return;
    }

    if (onChangeTheme) {
      onChangeTheme(theme);
    }
    setAccentColor(theme.config?.accentColor || "#7C3AED");
    setButtonStyle(theme.config?.buttonStyle || "rounded-md");
    setFontStyle(theme.config?.fontFamily || "font-sans");
    setBackgroundType(theme.config?.bgClass || "bg-zinc-950");
    
    if (setPreviewBg) {
      const isGrad = theme.config?.bgClass?.includes("bg-gradient") || theme.config?.bgClass?.includes("from-");
      setPreviewBg(isGrad ? "transparent" : (theme.config?.previewBg || "#09090b"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Choose a Theme Grid */}
      <div className="bg-white/45 border border-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-on-surface">Choose a Theme</h3>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Select visual presets below, then fully customize elements using the controllers.</p>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {themesList.map((theme) => {
            const isSelected = selectedThemeId === theme.id;
            const isGrad = theme.config?.bgClass?.includes("bg-gradient") || theme.config?.bgClass?.includes("from-");
            const isPremium = ["Glassmorphism", "Gradient Neon", "Cyberpunk"].includes(theme.name);

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleSelectTheme(theme)}
                className={`group flex flex-col gap-2 rounded-xl border p-3.5 text-left transition duration-300 cursor-pointer ${
                  isSelected 
                    ? "border-primary bg-white/60 ring-1 ring-primary/30"
                    : "border-black/10 bg-white/35 hover:border-primary/35 hover:bg-white/50"
                }`}
              >
                {/* Theme Miniature Preview Block */}
                <div className="aspect-video w-full rounded-lg flex flex-col justify-between p-2 border border-black/5 relative overflow-hidden">
                  <div 
                    className={`absolute inset-0 -z-10 ${theme.config?.bgClass || "bg-zinc-950"}`}
                    style={isGrad ? {} : { backgroundColor: theme.config?.previewBg || "#09090b" }}
                  />
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full shadow-sm" style={{ backgroundColor: theme.config?.accentColor || "#7c3aed" }} />
                    <div className="h-1 w-6 rounded bg-black/10" />
                  </div>

                  {isPremium && !isPro && (
                    <span className="absolute top-2 right-2 rounded bg-black/40 border border-white/20 p-0.5 text-white">
                      <Lock className="h-2.5 w-2.5" />
                    </span>
                  )}

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
      </div>

      {/* Fine-tune Your Design Panel */}
      <div className="rounded-xl border border-white/60 bg-white/45 shadow-sm backdrop-blur-md p-5 space-y-6">
        <div className="flex items-center gap-2 border-b border-black/5 pb-2.5">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <h2 className="text-sm font-bold text-on-surface">Fine-tune Your Design</h2>
        </div>

        {/* Accent Color Section */}
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold text-on-surface-variant">Accent Color</label>
          <div className="flex flex-wrap items-center gap-2">
            {ACCENT_COLORS.map((col) => (
              <button
                key={col.hex}
                type="button"
                title={col.name}
                onClick={() => setAccentColor(col.hex)}
                className={`h-7 w-7 rounded-full border transition cursor-pointer relative flex items-center justify-center ${
                  accentColor.toLowerCase() === col.hex.toLowerCase()
                    ? "border-primary ring-2 ring-primary/20 scale-110" 
                    : "border-black/15 hover:scale-105"
                }`}
                style={{ backgroundColor: col.hex }}
              >
                {accentColor.toLowerCase() === col.hex.toLowerCase() && (
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
            {BUTTON_SHAPES.map((btn) => (
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
            {TYPOGRAPHY_STYLES.map((fnt) => (
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
            {BACKGROUND_PRESETS.map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => {
                  setBackgroundType(bg.id);
                  if (setPreviewBg) {
                    setPreviewBg(bg.isGradient ? "transparent" : bg.color);
                  }
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
  );
}
