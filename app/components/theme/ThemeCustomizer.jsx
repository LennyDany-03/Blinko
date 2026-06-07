"use client";

import { useState, useRef } from "react";
import { Check, Sparkles, Lock, ChevronLeft, ChevronRight, Layers, Paintbrush, Type, RectangleHorizontal, Palette, Sliders, Monitor, Crown, Sun, Moon } from "lucide-react";
import {
  ACCENT_COLORS, BUTTON_SHAPES, TYPOGRAPHY_STYLES,
  BACKGROUND_PRESETS, LINK_STYLE_PRESETS, ANIMATED_BACKGROUNDS,
  BUILT_IN_THEMES, TITLE_COLORS, BIO_CARD_STYLES,
  PRO_BUILT_IN_THEMES, PRO_ANIMATED_BACKGROUNDS,
  PRO_LIGHT_THEMES, PRO_LIGHT_ANIMATED_BACKGROUNDS
} from "./themePresets";

// A reusable horizontal scrollable list with arrows for navigation
function HorizontalCarousel({ items, renderItem }) {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/carousel w-full">
      {/* Left scroll arrow */}
      <button
        type="button"
        onClick={() => handleScroll("left")}
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-800/90 border border-black/10 dark:border-white/15 shadow-md transition-all opacity-0 group-hover/carousel:opacity-100 hidden sm:flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 text-zinc-800 dark:text-zinc-100"
      >
        <ChevronLeft className="h-4 w-4 stroke-[3]" />
      </button>

      {/* Scrollable list */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 pt-1.5 pro-theme-scroll scroll-smooth snap-x w-full"
      >
        {items.map((item, idx) => (
          <div key={item.id || idx} className="flex-none snap-start">
            {renderItem(item)}
          </div>
        ))}
      </div>

      {/* Right scroll arrow */}
      <button
        type="button"
        onClick={() => handleScroll("right")}
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-800/90 border border-black/10 dark:border-white/15 shadow-md transition-all opacity-0 group-hover/carousel:opacity-100 hidden sm:flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 text-zinc-800 dark:text-zinc-100"
      >
        <ChevronRight className="h-4 w-4 stroke-[3]" />
      </button>
    </div>
  );
}

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
  setShowUpgradeModal,
  // New Theme Studio props
  linkStyle = "minimal",
  setLinkStyle,
  animationStrength = 0.6,
  setAnimationStrength,
  blurAmount = 20,
  setBlurAmount,
  shadowIntensity = 0.5,
  setShadowIntensity,
  cardTransparency = 40,
  setCardTransparency,
  animatedBackground = "none",
  setAnimatedBackground,
  titleColor = "accent",
  setTitleColor,
  bioCardStyle = "transparent",
  setBioCardStyle
}) {

  const [expandedSection, setExpandedSection] = useState("themes");
  const [proThemeTab, setProThemeTab] = useState("dark");
  const [proBgTab, setProBgTab] = useState("dark");

  // Apply a built-in theme preset
  const handleApplyBuiltInTheme = (theme) => {
    if (onChangeTheme) onChangeTheme(null); // clear DB theme
    setAccentColor(theme.config.accentColor);
    setFontStyle(theme.config.fontFamily);
    setButtonStyle(theme.config.buttonStyle);
    if (setLinkStyle) setLinkStyle(theme.config.linkStyle);
    if (setAnimationStrength) setAnimationStrength(theme.config.animationStrength);
    if (setBlurAmount) setBlurAmount(theme.config.blur);
    if (setShadowIntensity) setShadowIntensity(theme.config.shadowIntensity);
    if (setCardTransparency) setCardTransparency(theme.config.cardTransparency);
    
    // Automatically derive clean title color and bio card style preset matching theme type
    if (setTitleColor) {
      setTitleColor(theme.config.titleColor || "accent");
    }
    if (setBioCardStyle) {
      setBioCardStyle(
        theme.config.bioCardStyle || 
        (theme.config.linkStyle === "neon" ? "neon" : theme.config.linkStyle === "glass" ? "glass" : theme.config.linkStyle === "gradient" ? "gradient" : "transparent")
      );
    }

    // Handle background
    if (theme.config.background && theme.config.background !== "none") {
      if (setAnimatedBackground) setAnimatedBackground(theme.config.background);
      setBackgroundType("animated");
      if (setPreviewBg) setPreviewBg("transparent");
    } else {
      if (setAnimatedBackground) setAnimatedBackground("none");
      setBackgroundType(theme.config.isLight ? "bg-[#fff9ee]" : "bg-zinc-950");
      if (setPreviewBg) setPreviewBg(theme.config.isLight ? "#fff9ee" : "#09090b");
    }
  };

  // Apply a DB theme (legacy)
  const handleSelectDbTheme = (theme) => {
    const isPremiumTheme = ["Glassmorphism", "Gradient Neon", "Cyberpunk"].includes(theme.name);
    if (isPremiumTheme && !isPro) {
      setShowUpgradeModal(true);
      return;
    }
    if (onChangeTheme) onChangeTheme(theme);
    setAccentColor(theme.config?.accentColor || "#7C3AED");
    setButtonStyle(theme.config?.buttonStyle || "rounded-md");
    setFontStyle(theme.config?.fontFamily || "font-sans");
    setBackgroundType(theme.config?.bgClass || "bg-zinc-950");
    if (setPreviewBg) {
      const isGrad = theme.config?.bgClass?.includes("bg-gradient") || theme.config?.bgClass?.includes("from-");
      setPreviewBg(isGrad ? "transparent" : (theme.config?.previewBg || "#09090b"));
    }
  };

  const SectionHeader = ({ id, icon: Icon, title, subtitle, isOpen }) => (
    <button
      type="button"
      onClick={() => setExpandedSection(isOpen ? null : id)}
      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 cursor-pointer group ${
        isOpen 
          ? "bg-primary/8 border border-primary/15" 
          : "bg-white/30 border border-white/40 hover:bg-white/50 hover:border-white/60"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl transition-colors ${
          isOpen ? "bg-primary/15 text-primary" : "bg-black/5 text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary"
        }`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-left">
          <h3 className={`text-sm font-bold ${isOpen ? "text-primary" : "text-on-surface"}`}>{title}</h3>
          <p className="text-[10px] text-on-surface-variant mt-0.5">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className={`h-4 w-4 text-on-surface-variant transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`} />
    </button>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-300">

      {/* ═══════ Studio Header ═══════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/15 via-fuchsia-500/10 to-cyan-400/15 border border-white/30 p-5 shadow-lg backdrop-blur-md">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3 relative">
          <div className="p-2.5 rounded-2xl bg-primary/15 text-primary shadow-sm">
            <Paintbrush className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-on-surface tracking-tight flex items-center gap-2">
              Theme Studio
              <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-bold tracking-wider uppercase">Pro</span>
            </h2>
            <p className="text-[11px] text-on-surface-variant mt-0.5">Design your page with professional-grade customization tools</p>
          </div>
        </div>
      </div>

      {/* ═══════ Section 1: Theme Gallery ═══════ */}
      <SectionHeader 
        id="themes" 
        icon={Layers} 
        title="Theme Presets" 
        subtitle="30 professionally designed starting points" 
        isOpen={expandedSection === "themes"} 
      />
      {expandedSection === "themes" && (
        <div className="bg-white/45 border border-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {BUILT_IN_THEMES.map((theme) => {
              const isSelected = 
                accentColor === theme.config.accentColor && 
                fontStyle === theme.config.fontFamily &&
                (animatedBackground === theme.config.background || (!animatedBackground && theme.config.background === "none"));

              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleApplyBuiltInTheme(theme)}
                  className={`group relative flex flex-col rounded-lg border overflow-hidden transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10 scale-[1.02]"
                      : "border-black/10 bg-white/35 hover:border-primary/30 hover:shadow-md hover:scale-[1.01]"
                  }`}
                >
                  {/* Theme Preview Bar */}
                  <div 
                    className="h-20 w-full relative overflow-hidden"
                    style={{ background: theme.preview.bg }}
                  >
                    {/* Mini UI mockup inside preview */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3">
                      <div className="w-6 h-6 rounded-full border-2 border-white/40 bg-white/20" />
                      <div className="w-16 h-1.5 rounded-full bg-white/30" />
                      <div 
                        className="w-20 h-4 rounded-md flex items-center justify-center"
                        style={{ 
                          backgroundColor: `${theme.preview.accent}30`,
                          border: `1px solid ${theme.preview.accent}50`
                        }}
                      >
                        <div className="w-10 h-1 rounded-full" style={{ backgroundColor: `${theme.preview.accent}80` }} />
                      </div>
                    </div>

                  </div>
                  {/* Theme Label */}
                  <div className="p-2.5 bg-white/50">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{theme.emoji}</span>
                      <span className={`text-[11px] font-bold truncate ${isSelected ? "text-primary" : "text-on-surface-variant"}`}>
                        {theme.name}
                      </span>
                    </div>
                    <p className="text-[9px] text-on-surface-variant/70 mt-0.5 truncate">{theme.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ═══════ Pro Exclusive Themes ═══════ */}
          <div className="pt-4 mt-4 border-t border-black/8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 border border-amber-400/20">
                  <Crown className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                  <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pro Exclusive</span>
                </div>
                <span className="text-[10px] text-on-surface-variant/60 font-semibold">20 premium presets</span>
              </div>
              
              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-black/5 p-1 rounded-xl self-start sm:self-auto border border-black/5">
                <button
                  type="button"
                  onClick={() => setProThemeTab("dark")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                    proThemeTab === "dark"
                      ? "bg-white text-zinc-800 shadow-sm scale-[1.02] border border-black/5"
                      : "text-on-surface-variant/70 hover:text-on-surface hover:bg-black/5"
                  }`}
                >
                  <Moon className="h-3 w-3 text-violet-500" />
                  Dark Presets
                </button>
                <button
                  type="button"
                  onClick={() => setProThemeTab("light")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                    proThemeTab === "light"
                      ? "bg-white text-zinc-800 shadow-sm scale-[1.02] border border-black/5"
                      : "text-on-surface-variant/70 hover:text-on-surface hover:bg-black/5"
                  }`}
                >
                  <Sun className="h-3 w-3 text-amber-500" />
                  Light Presets
                </button>
              </div>
            </div>

            <HorizontalCarousel
              items={proThemeTab === "dark" ? PRO_BUILT_IN_THEMES : PRO_LIGHT_THEMES}
              renderItem={(theme) => {
                const isSelected = isPro &&
                  accentColor === theme.config.accentColor && 
                  fontStyle === theme.config.fontFamily &&
                  (animatedBackground === theme.config.background || (!animatedBackground && theme.config.background === "none"));

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      if (!isPro) {
                        setShowUpgradeModal(true);
                        return;
                      }
                      handleApplyBuiltInTheme(theme);
                    }}
                    className={`group relative flex flex-col w-[150px] rounded-lg border overflow-hidden transition-all duration-300 cursor-pointer text-left ${
                      isSelected
                        ? "border-amber-400 ring-2 ring-amber-400/25 shadow-lg shadow-amber-500/10 scale-[1.01]"
                        : "border-black/10 bg-white/35 dark:bg-black/10 hover:border-amber-400/30 hover:shadow-md hover:scale-[1.01]"
                    }`}
                  >
                    {/* Theme Preview Bar */}
                    <div 
                      className="h-20 w-full relative overflow-hidden"
                      style={{ background: theme.preview.bg }}
                    >
                      {/* Mini UI mockup inside preview */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3">
                        <div className="w-6 h-6 rounded-full border border-white/40 bg-white/20" />
                        <div className="w-14 h-1.5 rounded-full bg-white/30" />
                        <div 
                          className="w-18 h-4 rounded-md flex items-center justify-center"
                          style={{ 
                            backgroundColor: `${theme.preview.accent}30`,
                            border: `1px solid ${theme.preview.accent}50`
                          }}
                        >
                          <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: `${theme.preview.accent}80` }} />
                        </div>
                      </div>
                      {/* Pro lock overlay for free users */}
                      {!isPro && (
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="p-1.5 rounded-full bg-black/50 border border-amber-500/30">
                            <Lock className="h-3.5 w-3.5 text-amber-400" />
                          </div>
                        </div>
                      )}

                      {/* Pro badge */}
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/80 to-orange-500/80 backdrop-blur-md">
                        <span className="text-[7px] font-extrabold text-white uppercase tracking-wider">PRO</span>
                      </div>
                    </div>
                    {/* Theme Label */}
                    <div className="p-2.5 bg-white/50 dark:bg-black/20">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{theme.emoji}</span>
                        <span className={`text-[10px] font-bold truncate ${isSelected ? "text-amber-600 dark:text-amber-400" : "text-on-surface-variant"}`}>
                          {theme.name}
                        </span>
                      </div>
                      <p className="text-[8px] text-on-surface-variant/70 mt-0.5 truncate">{theme.description}</p>
                    </div>
                  </button>
                );
              }}
            />
          </div>

        </div>
      )}

      {/* ═══════ Section 2: Animated Backgrounds ═══════ */}
      <SectionHeader
        id="backgrounds"
        icon={Monitor}
        title="Animated Backgrounds"
        subtitle="10 GPU-accelerated visual effects"
        isOpen={expandedSection === "backgrounds"}
      />
      {expandedSection === "backgrounds" && (
        <div className="bg-white/45 border border-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Animated backgrounds grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* None option */}
            <button
              type="button"
              onClick={() => {
                if (setAnimatedBackground) setAnimatedBackground("none");
              }}
              className={`group relative aspect-[16/10] w-full rounded-lg border overflow-hidden transition-all duration-200 cursor-pointer ${
                (!animatedBackground || animatedBackground === "none")
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-black/10 hover:border-primary/30"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
                <span className="text-[10px] font-bold text-zinc-500">None</span>
              </div>
            </button>
            {ANIMATED_BACKGROUNDS.map((bg) => {
              const isSelected = animatedBackground === bg.id;
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => {
                    if (setAnimatedBackground) setAnimatedBackground(bg.id);
                    setBackgroundType("animated");
                    if (setPreviewBg) setPreviewBg("transparent");
                  }}
                  className={`group relative aspect-[16/10] w-full rounded-lg border overflow-hidden transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-primary ring-2 ring-primary/20 shadow-md"
                      : "border-black/10 hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: bg.previewGradient }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
                    <div className="flex items-center gap-1">
                      <span className="text-xs">{bg.emoji}</span>
                      <span className="text-[9px] font-bold text-white truncate">{bg.label}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 rounded-full bg-primary p-0.5 shadow-md">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Pro Animated Backgrounds */}
          <div className="pt-4 border-t border-black/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-yellow-500/15 border border-amber-400/20">
                  <Crown className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                  <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pro</span>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant/70">Exclusive FX</span>
              </div>
              
              {/* Tab Selector */}
              <div className="flex items-center gap-1 bg-black/5 p-1 rounded-xl self-start sm:self-auto border border-black/5">
                <button
                  type="button"
                  onClick={() => setProBgTab("dark")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                    proBgTab === "dark"
                      ? "bg-white text-zinc-800 shadow-sm scale-[1.02] border border-black/5"
                      : "text-on-surface-variant/70 hover:text-on-surface hover:bg-black/5"
                  }`}
                >
                  <Moon className="h-3 w-3 text-violet-500" />
                  Dark FX
                </button>
                <button
                  type="button"
                  onClick={() => setProBgTab("light")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                    proBgTab === "light"
                      ? "bg-white text-zinc-800 shadow-sm scale-[1.02] border border-black/5"
                      : "text-on-surface-variant/70 hover:text-on-surface hover:bg-black/5"
                  }`}
                >
                  <Sun className="h-3 w-3 text-amber-500" />
                  Light FX
                </button>
              </div>
            </div>

            <HorizontalCarousel
              items={proBgTab === "dark" ? PRO_ANIMATED_BACKGROUNDS : PRO_LIGHT_ANIMATED_BACKGROUNDS}
              renderItem={(bg) => {
                const isSelected = animatedBackground === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => {
                      if (!isPro) {
                        setShowUpgradeModal(true);
                        return;
                      }
                      if (setAnimatedBackground) setAnimatedBackground(bg.id);
                      setBackgroundType("animated");
                      if (setPreviewBg) setPreviewBg("transparent");
                    }}
                    className={`group relative aspect-[16/10] w-[140px] rounded-lg border overflow-hidden transition-all duration-200 cursor-pointer text-left ${
                      isSelected
                        ? "border-amber-400 ring-2 ring-amber-400/25 shadow-md scale-[1.01]"
                        : "border-black/10 bg-white/35 dark:bg-black/10 hover:border-amber-400/30 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ background: bg.previewGradient }}
                    />
                    {/* Pro lock overlay */}
                    {!isPro && (
                      <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center">
                        <Lock className="h-3.5 w-3.5 text-amber-400/80" />
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{bg.emoji}</span>
                        <span className="text-[9px] font-bold text-white truncate">{bg.label}</span>
                      </div>
                    </div>
                    {/* Pro badge */}
                    <div className="absolute top-1 left-1 px-1 py-0.5 rounded bg-gradient-to-r from-amber-500/80 to-orange-500/80 backdrop-blur-md">
                      <span className="text-[6px] font-extrabold text-white uppercase tracking-wider">PRO</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 rounded-full bg-amber-500 p-0.5 shadow-md">
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              }}
            />
          </div>

          {/* Static backgrounds */}
          <div className="pt-3 border-t border-black/5">
            <p className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-wider mb-2">Static Backgrounds</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BACKGROUND_PRESETS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => {
                    if (setAnimatedBackground) setAnimatedBackground("none");
                    setBackgroundType(bg.id);
                    if (setPreviewBg) setPreviewBg(bg.isGradient ? "transparent" : bg.color);
                  }}
                  className={`group relative aspect-[16/9] w-full rounded-lg border text-left p-2 transition cursor-pointer overflow-hidden ${
                    backgroundType === bg.id && (!animatedBackground || animatedBackground === "none")
                      ? "border-primary ring-1 ring-primary/30"
                      : "border-black/10 bg-white/20 hover:bg-white/40"
                  }`}
                >
                  <div 
                    className={`absolute inset-0 -z-10 ${bg.id}`}
                    style={bg.isGradient ? {} : { backgroundColor: bg.color }}
                  />
                  <span className={`text-[9px] font-bold tracking-tight absolute bottom-1.5 left-2 ${
                    bg.id === "bg-[#fff9ee]" || bg.id.includes("from-pink-200") ? "text-zinc-900" : "text-white"
                  }`}>
                    {bg.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ Section 3: Link Styles ═══════ */}
      <SectionHeader
        id="links"
        icon={RectangleHorizontal}
        title="Link Card Styles"
        subtitle="8 premium link button designs"
        isOpen={expandedSection === "links"}
      />
      {expandedSection === "links" && (
        <div className="bg-white/45 border border-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid gap-2 grid-cols-2">
            {LINK_STYLE_PRESETS.map((style) => {
              const isSelected = linkStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setLinkStyle && setLinkStyle(style.id)}
                  className={`group relative rounded-lg border p-3 transition-all duration-200 cursor-pointer text-left ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-black/10 bg-white/30 hover:border-primary/25 hover:bg-white/50"
                  }`}
                >
                  {/* Mini link preview */}
                  <div className="h-8 rounded-lg bg-zinc-900 mb-2 flex items-center px-3 overflow-hidden relative">
                    <div className={`absolute inset-0 rounded-lg ${style.darkClass}`} />
                    <div className="relative flex items-center gap-1.5 w-full">
                      <div className="w-3 h-3 rounded-sm bg-white/30" />
                      <div className="w-12 h-1 rounded-full bg-white/40" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-[11px] font-bold ${isSelected ? "text-primary" : "text-on-surface-variant"}`}>
                        {style.label}
                      </span>
                      <p className="text-[9px] text-on-surface-variant/60 mt-0.5">{style.description}</p>
                    </div>
                    {isSelected && (
                      <div className="rounded-full bg-primary p-0.5">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════ Section 4: Fine-tune Design Controls ═══════ */}
      <SectionHeader
        id="finetune"
        icon={Sliders}
        title="Fine-tune Design"
        subtitle="Colors, typography, shapes & effects"
        isOpen={expandedSection === "finetune"}
      />
      {expandedSection === "finetune" && (
        <div className="rounded-2xl border border-white/60 bg-white/45 shadow-sm backdrop-blur-md p-5 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">

          {/* Accent Color */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
              <Palette className="h-3.5 w-3.5 text-primary" />
              Accent Color
            </label>
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
            </div>
          </div>

          {/* Button Shape */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
              <RectangleHorizontal className="h-3.5 w-3.5 text-primary" />
              Button Shape
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {BUTTON_SHAPES.map((btn) => {
                const isActive = buttonStyle === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setButtonStyle(btn.id)}
                    className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? "bg-primary/15 border-primary/40 text-primary"
                        : "bg-white/20 border-black/5 text-on-surface-variant hover:bg-white/50"
                    }`}
                  >
                    {/* Shape preview */}
                    <div 
                      className={`w-12 h-6 border-2 transition mx-auto ${
                        isActive ? "border-primary/60 bg-primary/10" : "border-black/15 bg-black/5"
                      } ${btn.id}`}
                    />
                    <span>{btn.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-2.5">
            <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
              <Type className="h-3.5 w-3.5 text-primary" />
              Typography Style
            </label>
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

          {/* Title Color */}
          {setTitleColor && (
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                <Type className="h-3.5 w-3.5 text-primary" />
                Title Text Color
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {TITLE_COLORS.map((col) => {
                  const isAccent = col.hex === "accent";
                  const bgStyle = isAccent ? accentColor : col.hex;
                  const isSelected = titleColor === col.hex;
                  return (
                    <button
                      key={col.hex}
                      type="button"
                      title={col.name}
                      onClick={() => setTitleColor(col.hex)}
                      className={`h-7 w-7 rounded-full border transition cursor-pointer relative flex items-center justify-center ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/20 scale-110" 
                          : "border-black/15 hover:scale-105"
                      }`}
                      style={{ background: bgStyle }}
                    >
                      {isAccent && (
                        <span className="absolute text-[9px] font-black text-white mix-blend-difference">A</span>
                      )}
                      {isSelected && (
                        <Check className={`h-3.5 w-3.5 ${bgStyle === "#ffffff" ? "text-black" : "text-white"}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bio Card Style */}
          {setBioCardStyle && (
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                <RectangleHorizontal className="h-3.5 w-3.5 text-primary" />
                About Me Card Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BIO_CARD_STYLES.map((style) => {
                  const isActive = bioCardStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setBioCardStyle(style.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition cursor-pointer ${
                        isActive
                          ? "bg-primary/15 border-primary/40 text-primary"
                          : "bg-white/20 border-black/5 text-on-surface-variant hover:bg-white/50"
                      }`}
                    >
                      <span className="text-[11px] font-bold">{style.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Effect Sliders ─── */}
          <div className="pt-3 border-t border-black/5 space-y-5">
            <h4 className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              Visual Effects
            </h4>

            {/* Animation Strength */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-semibold text-on-surface-variant">Animation Strength</span>
                <span className="text-[10px] font-mono text-on-surface-variant/70 bg-black/5 px-1.5 py-0.5 rounded">{Math.round((animationStrength || 0.6) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((animationStrength || 0.6) * 100)}
                onChange={(e) => setAnimationStrength && setAnimationStrength(parseInt(e.target.value) / 100)}
                className="theme-slider"
              />
            </div>

            {/* Card Transparency */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-semibold text-on-surface-variant">Card Transparency</span>
                <span className="text-[10px] font-mono text-on-surface-variant/70 bg-black/5 px-1.5 py-0.5 rounded">{cardTransparency || 40}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={cardTransparency || 40}
                onChange={(e) => setCardTransparency && setCardTransparency(parseInt(e.target.value))}
                className="theme-slider"
              />
            </div>

            {/* Blur Amount */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-semibold text-on-surface-variant">Blur Amount</span>
                <span className="text-[10px] font-mono text-on-surface-variant/70 bg-black/5 px-1.5 py-0.5 rounded">{blurAmount || 20}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={blurAmount || 20}
                onChange={(e) => setBlurAmount && setBlurAmount(parseInt(e.target.value))}
                className="theme-slider"
              />
            </div>

            {/* Shadow Intensity */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-semibold text-on-surface-variant">Shadow Intensity</span>
                <span className="text-[10px] font-mono text-on-surface-variant/70 bg-black/5 px-1.5 py-0.5 rounded">{Math.round((shadowIntensity || 0.5) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((shadowIntensity || 0.5) * 100)}
                onChange={(e) => setShadowIntensity && setShadowIntensity(parseInt(e.target.value) / 100)}
                className="theme-slider"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
