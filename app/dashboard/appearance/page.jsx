"use client";

import { useState } from "react";
import { Sparkles, Check, Globe, Eye, Send, CheckCircle2 } from "lucide-react";
import { Github, Linkedin } from "../../components/dashboard/BrandIcons";
import { MOCK_THEMES } from "../../constants/dashboardData";
import SectionHeader from "../../components/dashboard/SectionHeader";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Button from "../../components/Button";

const colors = ["#7c3aed", "#10b981", "#38bdf8", "#f43f5e", "#f59e0b", "#ec4899", "#ffffff"];
const fonts = [
  { id: "font-sans", name: "Inter (Sans-serif)" },
  { id: "font-serif", name: "Playfair Display (Serif)" },
  { id: "font-mono", name: "JetBrains Mono (Monospace)" },
];
const buttonStyles = [
  { id: "rounded-none", name: "Sharp (Square)" },
  { id: "rounded-md", name: "Soft (Medium)" },
  { id: "rounded-full", name: "Pill (Rounded)" },
];

export default function AppearancePage() {
  const [activeTheme, setActiveTheme] = useState(MOCK_THEMES[5]); // Default: Dark Pro
  const [accentColor, setAccentColor] = useState("#7c3aed");
  const [fontFamily, setFontFamily] = useState("font-sans");
  const [buttonStyle, setButtonStyle] = useState("rounded-md");
  const [publishing, setPublishing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Apply predefined theme presets
  const handleSelectTheme = (theme) => {
    setActiveTheme(theme);
    setAccentColor(theme.accentColor);
    setFontFamily(theme.fontFamily);
    setButtonStyle(theme.buttonStyle);
  };

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  // Map font styles for preview styling class
  const getFontFamilyClass = (font) => {
    if (font === "font-mono") return "font-mono";
    if (font === "font-serif") return "font-serif";
    return "font-sans";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <SectionHeader
        title="Design & Themes"
        description="Personalize the visual look, fonts, buttons, and templates of your public profile."
      >
        <Button variant="primary" size="sm" onClick={handlePublish} disabled={publishing}>
          {publishing ? "Publishing Changes..." : "Publish Changes"}
        </Button>
      </SectionHeader>

      {/* Success Notification Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-zinc-950 px-4 py-3 text-sm text-emerald-400 shadow-xl shadow-black/50 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-4 w-4" />
          <span>Your changes are live on your Blinko page!</span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Style Editors (Left 3 cols) */}
        <div className="space-y-6 lg:col-span-3">
          {/* Theme grid */}
          <DashboardCard>
            <h3 className="text-base font-semibold text-white mb-4">Choose a Theme</h3>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              {MOCK_THEMES.map((theme) => {
                const isSelected = activeTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleSelectTheme(theme)}
                    className={[
                      "group flex flex-col gap-2 rounded-xl border p-3.5 text-left transition duration-300",
                      isSelected
                        ? "border-violet-500 bg-violet-650/5 ring-1 ring-violet-500/30"
                        : "border-zinc-900 bg-zinc-950 hover:border-zinc-850 hover:bg-zinc-900/40",
                    ].join(" ")}
                  >
                    {/* Theme Miniature Preview Block */}
                    <div
                      className="aspect-video w-full rounded-lg flex flex-col justify-between p-2 border border-zinc-800"
                      style={{ backgroundColor: theme.previewBg }}
                    >
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                        <div className="h-1 w-6 rounded bg-zinc-700/60" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full rounded bg-zinc-700/60" />
                        <div className="h-1.5 w-2/3 rounded bg-zinc-700/60" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition">
                        {theme.name}
                      </span>
                      {isSelected && (
                        <span className="rounded bg-violet-500/10 p-0.5 text-violet-400 border border-violet-500/20">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </DashboardCard>

          {/* Color Picker */}
          <DashboardCard>
            <h3 className="text-base font-semibold text-white mb-1.5">Accent Color</h3>
            <p className="text-xs text-zinc-500 mb-4">Select the color highlight for tags, highlights, and buttons.</p>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => {
                const isSelected = accentColor.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAccentColor(color)}
                    style={{ backgroundColor: color }}
                    className={[
                      "relative flex h-8 w-8 items-center justify-center rounded-full border border-zinc-950 shadow-md transition-transform duration-200 hover:scale-110 focus:outline-none",
                      isSelected ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-950" : "",
                    ].join(" ")}
                  >
                    {isSelected && (
                      <Check
                        className={[
                          "h-4 w-4",
                          color === "#ffffff" ? "text-black" : "text-white",
                        ].join(" ")}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </DashboardCard>

          {/* Typography font picker */}
          <DashboardCard>
            <h3 className="text-base font-semibold text-white mb-4">Typography</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {fonts.map((font) => {
                const isSelected = fontFamily === font.id;
                return (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setFontFamily(font.id)}
                    className={[
                      "rounded-lg border p-3 text-center text-xs font-medium transition duration-200",
                      isSelected
                        ? "border-violet-500 bg-violet-950/15 text-violet-300"
                        : "border-zinc-900 bg-zinc-950 text-zinc-400 hover:bg-zinc-900/60 hover:text-white",
                      font.id === "font-mono" ? "font-mono" : font.id === "font-serif" ? "font-serif" : "font-sans",
                    ].join(" ")}
                  >
                    {font.name}
                  </button>
                );
              })}
            </div>
          </DashboardCard>

          {/* Button Style selector */}
          <DashboardCard>
            <h3 className="text-base font-semibold text-white mb-4">Button Shape</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {buttonStyles.map((style) => {
                const isSelected = buttonStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setButtonStyle(style.id)}
                    className={[
                      "rounded-lg border p-3 text-center text-xs font-medium transition duration-200 flex flex-col items-center gap-2",
                      isSelected
                        ? "border-violet-500 bg-violet-950/15 text-violet-300"
                        : "border-zinc-900 bg-zinc-950 text-zinc-400 hover:bg-zinc-900/60 hover:text-white",
                    ].join(" ")}
                  >
                    <span>{style.name}</span>
                    <span
                      className={[
                        "h-5 w-16 border border-zinc-800 bg-zinc-900 inline-block block",
                        style.id,
                      ].join(" ")}
                    />
                  </button>
                );
              })}
            </div>
          </DashboardCard>
        </div>

        {/* Live Mockup Preview Panel (Right 2 cols) */}
        <div className="lg:col-span-2 flex justify-center lg:justify-start lg:sticky lg:top-24 h-fit">
          <div className="relative w-full max-w-[310px] aspect-[9/18] rounded-[36px] border-[8px] border-zinc-900 shadow-2xl shadow-violet-950/10 ring-1 ring-zinc-850 flex flex-col justify-between overflow-hidden">
            {/* Live screen colors mapped directly to values selected */}
            <div
              className={[
                "h-full p-4 flex flex-col justify-between pt-6 transition-colors duration-500 overflow-y-auto no-scrollbar",
                activeTheme.bgClass,
                getFontFamilyClass(fontFamily),
              ].join(" ")}
              style={{ backgroundColor: activeTheme.previewBg }}
            >
              {/* Profile Details Container */}
              <div className="w-full flex flex-col items-center text-center">
                {/* User avatar mockup */}
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 shadow-md shadow-violet-500/20 flex items-center justify-center text-lg font-bold text-white mb-3 mt-4">
                  L
                </div>

                <h4 className="text-sm font-semibold text-zinc-100 leading-tight">
                  Lenny
                </h4>
                <p className="text-[10px] font-mono mt-0.5" style={{ color: accentColor }}>
                  @lenny
                </p>

                {/* Info Bio */}
                <p
                  className={[
                    "text-[10px] leading-relaxed max-w-[220px] mt-2.5 p-2.5 border transition-all duration-300",
                    activeTheme.previewCard || "bg-zinc-900 border-zinc-800 text-zinc-400",
                  ].join(" ")}
                >
                  Creator & designer. Building beautiful AI mini websites in seconds at Blinko. 🚀
                </p>

                {/* Accent Color Badge Mock */}
                <div className="mt-3 flex justify-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[8px] border bg-black/40 border-zinc-800 text-zinc-400"
                  >
                    <Globe className="h-2 w-2" />
                    lenny.dev
                  </span>
                </div>

                {/* Social icons row */}
                <div className="mt-4 flex gap-2.5 text-zinc-400">
                  <Github className="h-3 w-3 hover:text-white transition cursor-pointer" />
                  <Linkedin className="h-3 w-3 hover:text-white transition cursor-pointer" />
                </div>

                {/* Live Preview interactive buttons reflecting settings */}
                <div className="mt-6 w-full space-y-2.5 px-1">
                  <button
                    type="button"
                    className={[
                      "w-full flex items-center justify-between p-2.5 text-[10px] text-zinc-100 font-medium border cursor-pointer hover:-translate-y-0.5 transition duration-300",
                      buttonStyle,
                      activeTheme.previewCard || "bg-zinc-900 border-zinc-800",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-1.5">
                      <Github className="h-3.5 w-3.5" style={{ color: accentColor }} />
                      GitHub Profile
                    </span>
                    <span className="text-[8px]" style={{ color: accentColor }}>→</span>
                  </button>

                  <button
                    type="button"
                    className={[
                      "w-full flex items-center justify-between p-2.5 text-[10px] text-zinc-100 font-medium border cursor-pointer hover:-translate-y-0.5 transition duration-300",
                      buttonStyle,
                      activeTheme.previewCard || "bg-zinc-900 border-zinc-800",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" style={{ color: accentColor }} />
                      My Portfolio
                    </span>
                    <span className="text-[8px]" style={{ color: accentColor }}>→</span>
                  </button>
                </div>
              </div>

              {/* Branding */}
              <div className="mt-8 mb-2 flex items-center justify-center gap-1 opacity-45">
                <span className="text-[8px] text-zinc-650">powered by</span>
                <span className="text-[8px] font-bold text-white tracking-wider bg-black/45 px-1 py-0.5 rounded border border-zinc-900">
                  BLINKO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
