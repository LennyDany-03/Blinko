"use client";

import { Globe, MapPin, Link2 } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import { LINK_STYLE_PRESETS, BIO_CARD_STYLES } from "./themePresets";

const PRO_LIGHT_BACKGROUNDS = [
  "sunbeam-rays", "sakura-petals", "cloud-drift", "pastel-waves", "morning-dew",
  "watercolor-wash", "cotton-candy", "golden-hour", "ocean-breeze", "lavender-mist"
];

export function resolveIsLightBg(backgroundType, animatedBackground) {
  return (
    backgroundType === "bg-[#fff9ee]" ||
    backgroundType === "bg-surface" ||
    backgroundType === "bg-background" ||
    backgroundType?.includes("pink-200") ||
    (backgroundType === "animated" && (
      animatedBackground === "glass-bubbles" ||
      PRO_LIGHT_BACKGROUNDS.includes(animatedBackground)
    ))
  );
}

export function resolvePreviewBg({ backgroundType, animatedBackground, previewBg, isGrad }) {
  if (animatedBackground && animatedBackground !== "none") return "transparent";
  if (isGrad) return "transparent";
  if (previewBg) return previewBg;
  if (backgroundType === "bg-[#fff9ee]") return "#fff9ee";
  if (backgroundType === "bg-zinc-950") return "#09090b";
  return "#09090b";
}

const defaultIconMap = { Link2, Globe };

export default function BlinkoPhonePreview({
  size = "default",
  accentColor = "#7c3aed",
  fontStyle = "font-sans",
  buttonStyle = "rounded-md",
  backgroundType = "bg-zinc-950",
  previewBg,
  animatedBackground = "none",
  animationStrength = 0.6,
  blurAmount = 20,
  shadowIntensity = 0.5,
  cardTransparency = 40,
  titleColor = "accent",
  bioCardStyle = "transparent",
  linkStyle = "minimal",
  displayName = "Display Name",
  bio = "",
  location = "",
  website = "",
  avatarUrl = "",
  handle = "handle",
  links = [],
  cardBgClass,
  iconMap = defaultIconMap,
  showLiveBadge = true,
}) {
  const isModal = size === "modal" || size === "compact";
  const isLightBg = resolveIsLightBg(backgroundType, animatedBackground);
  const isGrad = backgroundType?.includes("bg-gradient") || backgroundType?.includes("from-");
  const resolvedPreviewBg = resolvePreviewBg({ backgroundType, animatedBackground, previewBg, isGrad });

  const resolvedCardBgClass = cardBgClass ?? (
    isLightBg
      ? "bg-black/5 border-black/10 text-zinc-900 shadow-sm"
      : "bg-zinc-900 border-zinc-800 text-zinc-300"
  );

  const btnShapeClass =
    buttonStyle === "rounded-md" ? "rounded-[10px]" :
    buttonStyle === "rounded-xl" ? "rounded-[15px]" :
    buttonStyle;

  const activeLinks = links.filter((l) => l.active !== false);
  const maxWidth = size === "modal" ? "max-w-[280px]" : size === "compact" ? "max-w-[240px]" : "max-w-[310px]";
  const phoneHeight = size === "modal" ? "h-[480px]" : size === "compact" ? "h-[420px]" : "aspect-[9/18]";

  return (
    <div className={`relative w-full ${maxWidth} mx-auto flex flex-col items-center`}>
      {showLiveBadge && (
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 mb-3 bg-white/90 backdrop-blur-md border border-white/60 shadow-sm rounded-full text-[10px] font-bold text-on-surface-variant/95 tracking-wide select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          LIVE PREVIEW
        </div>
      )}

      <div
        className={`relative w-full ${phoneHeight} rounded-[44px] border-[10px] border-zinc-950 bg-zinc-950 p-[3px] ring-1 ring-zinc-800/85 flex flex-col overflow-hidden transition-all duration-500 shadow-2xl`}
        style={{ boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 35px ${accentColor}1c` }}
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-20 rounded-full bg-black border border-white/5 z-20 flex items-center justify-between px-2 shadow-md">
          <div className="w-1 h-1 rounded-full bg-[#070b19] border border-white/5" />
          <div className="w-6 h-0.5 rounded-full bg-zinc-900/40" />
        </div>

        <div
          className={`h-full flex flex-col justify-between transition-colors duration-500 overflow-hidden rounded-[38px] ${backgroundType !== "animated" ? backgroundType : ""} ${fontStyle} relative isolate`}
          style={{ backgroundColor: resolvedPreviewBg }}
        >
          {animatedBackground && animatedBackground !== "none" && (
            <AnimatedBackground
              backgroundId={animatedBackground}
              animationStrength={animationStrength}
              className="rounded-[38px]"
            />
          )}

          <div className={`h-8 pt-3 px-5 flex items-center justify-between text-[9px] font-bold relative z-10 w-full select-none shrink-0 ${isLightBg ? "text-zinc-800" : "text-zinc-200"}`}>
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className={`w-[12px] h-1.5 rounded-[2px] border p-[0.5px] flex ${isLightBg ? "border-zinc-800" : "border-white/80"}`}>
                <div className={`h-full w-4/5 rounded-[1px] ${isLightBg ? "bg-zinc-800" : "bg-white"}`} />
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 pt-1 pb-1 flex flex-col items-center relative z-10">
            <div
              className="relative p-0.5 rounded-full border border-dashed mb-2 mt-0.5 scale-90"
              style={{ borderColor: `${accentColor}40` }}
            >
              <div className="p-0.5 rounded-full border" style={{ borderColor: accentColor }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className={`${isModal ? "h-14 w-14" : "h-11 w-11"} rounded-full object-cover shadow-sm`} />
                ) : (
                  <div className={`${isModal ? "h-14 w-14 text-base" : "h-11 w-11 text-sm"} rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white`}>
                    {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
              </div>
            </div>

            <h4
              className={`${isModal ? "text-sm" : "text-xs"} font-bold leading-none flex items-center gap-0.5 relative z-10`}
              style={{ color: titleColor === "accent" ? accentColor : titleColor || (isLightBg ? "#18181b" : "#ffffff") }}
            >
              {displayName}
              <svg className="w-3 h-3 text-violet-500 fill-current flex-shrink-0" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </h4>
            <p className={`${isModal ? "text-[9px]" : "text-[8px]"} font-mono mt-0.5 relative z-10`} style={{ color: accentColor }}>
              blinko.site/{handle}
            </p>

            {bio && (() => {
              const activeBioPreset = BIO_CARD_STYLES.find((s) => s.id === bioCardStyle);
              const bioCardClass = (bioCardStyle && bioCardStyle !== "transparent")
                ? (activeBioPreset ? (isLightBg ? activeBioPreset.lightClass : activeBioPreset.darkClass) : resolvedCardBgClass)
                : "bg-transparent border-none p-0 text-center relative z-10";

              return (
                <p
                  className={`${isModal ? "text-[10px] max-w-[220px]" : "text-[9px] max-w-[180px]"} leading-relaxed mt-2 transition-all duration-300 relative z-10 ${
                    bioCardStyle && bioCardStyle !== "transparent" ? "p-2 border rounded-lg" : ""
                  } ${bioCardClass}`}
                  style={{
                    backdropFilter: bioCardStyle === "glass" && blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
                    boxShadow: bioCardStyle === "glass" && shadowIntensity > 0 ? `0 4px ${16 * shadowIntensity}px rgba(0,0,0,${shadowIntensity * 0.25})` : undefined,
                    opacity: bioCardStyle && bioCardStyle !== "transparent" && cardTransparency ? (0.5 + cardTransparency / 200) : 1,
                    color: bioCardStyle === "transparent" ? (isLightBg ? "#52525b" : "#a1a1aa") : undefined,
                  }}
                >
                  {bio}
                </p>
              );
            })()}

            <div className="mt-2 flex flex-wrap justify-center gap-1 max-w-[190px] relative z-10">
              {location && (
                <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[7px] border ${
                  isLightBg ? "bg-black/5 text-zinc-700 border-black/10" : "bg-white/5 text-zinc-300 border-white/10"
                }`}>
                  <MapPin className="h-2 w-2" />
                  {location}
                </span>
              )}
              {website && (
                <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[7px] border ${
                  isLightBg ? "bg-black/5 text-zinc-700 border-black/10" : "bg-white/5 text-zinc-300 border-white/10"
                }`}>
                  <Globe className="h-2 w-2" />
                  Website
                </span>
              )}
            </div>

            <div className="mt-3 w-full space-y-1.5 px-0.5 relative z-10">
              {(activeLinks.length > 0 ? activeLinks : [
                { id: "demo-1", title: "GitHub Repositories", icon: "Link2" },
                { id: "demo-2", title: "LinkedIn Professional", icon: "Link2" },
              ]).slice(0, 4).map((link) => {
                const LinkIcon = iconMap[link.icon] || Link2;
                const activeLinkPreset = LINK_STYLE_PRESETS.find((s) => s.id === linkStyle);
                const linkCardClass = activeLinkPreset
                  ? (isLightBg ? activeLinkPreset.lightClass : activeLinkPreset.darkClass)
                  : resolvedCardBgClass;

                return (
                  <div
                    key={link.id}
                    className={`w-full flex items-center justify-between ${isModal ? "p-2.5 text-[10px]" : "p-2 text-[9px]"} font-semibold ${btnShapeClass} ${linkCardClass}`}
                    style={{
                      backdropFilter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
                      boxShadow: shadowIntensity > 0 ? `0 4px ${20 * shadowIntensity}px rgba(0,0,0,${shadowIntensity * 0.3})` : undefined,
                      opacity: cardTransparency ? (0.5 + cardTransparency / 200) : 1,
                    }}
                  >
                    <span className="flex items-center gap-1.5 truncate pr-1">
                      <LinkIcon className="h-3 w-3" style={{ color: accentColor }} />
                      {link.title || "Link Title"}
                    </span>
                    <span className="text-[7px]" style={{ color: accentColor }}>→</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 pb-1.5 flex flex-col items-center gap-1 w-full mt-auto relative z-10 shrink-0">
            <div className="flex items-center justify-center gap-1 opacity-70">
              <span className={`text-[7px] ${isLightBg ? "text-zinc-500" : "text-zinc-400"}`}>powered by</span>
              <span className={`text-[7px] font-bold tracking-wider px-1 py-0.5 rounded border ${
                isLightBg ? "text-zinc-900 bg-black/5 border-black/10" : "text-white bg-black/40 border-zinc-800"
              }`}>
                BLINKO
              </span>
            </div>
            <div className={`w-16 h-0.5 rounded-full ${isLightBg ? "bg-zinc-800/20" : "bg-white/20"}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
