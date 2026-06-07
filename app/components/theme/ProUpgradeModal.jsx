"use client";

import { X, Sparkles, CheckCircle2, Crown } from "lucide-react";
import BlinkoPhonePreview from "./BlinkoPhonePreview";

const DEFAULT_BENEFITS = [
  { title: "Unlimited Blinko Trees", desc: "Create as many public pages as you want." },
  { title: "Advanced Analytics", desc: "Track Views, Clicks, CTR, Top Links, Traffic Sources, Device stats." },
  { title: "Premium Themes", desc: "Access all 20+ Pro exclusive presets and animated backgrounds." },
  { title: "Custom Domains", desc: "Use yourname.com instead of blinko.site/username." },
  { title: "Remove Blinko Branding", desc: "Remove all platform watermarks." },
  { title: "Priority Support", desc: "Faster support response." },
  { title: "AI Optimization Tools", desc: "AI Bio Generator, AI profile enhancers, and suggestion tools." },
];

export default function ProUpgradeModal({
  isOpen,
  onClose,
  onUpgrade,
  previewProps,
  benefits = DEFAULT_BENEFITS,
}) {
  if (!isOpen) return null;

  const isProPreview = typeof isOpen === "string";
  const featureName = isProPreview ? isOpen : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-6 select-none animate-in fade-in duration-200 overflow-y-auto">
      <div
        className={`relative w-full rounded-[32px] border border-white/60 bg-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.15)] text-center animate-in scale-in duration-300 backdrop-blur-2xl my-auto ${
          isProPreview ? "max-w-md p-5 md:p-6 overflow-visible" : "max-w-md p-6 md:p-8 overflow-hidden"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-black/5 bg-white/45 text-on-surface-variant/70 hover:text-on-surface hover:bg-white transition-all duration-200 cursor-pointer shadow-sm z-20"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {isProPreview && previewProps && (
          <div className="flex justify-center pt-1 pb-2 px-1">
            <BlinkoPhonePreview {...previewProps} size="modal" />
          </div>
        )}

        {!isProPreview && (
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary-container/10 text-primary mb-5 relative">
            <span className="absolute inset-0 rounded-full bg-primary/5 animate-ping opacity-75" />
            <Sparkles className="h-6 w-6 relative z-10" />
          </div>
        )}

        {isProPreview && (
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-400/20">
              <Crown className="h-3 w-3 text-amber-500" />
              <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-wider">Pro Exclusive</span>
            </div>
          </div>
        )}

        <h3 className="text-xl font-bold tracking-tight text-on-surface font-display-xl px-2">
          {isProPreview ? featureName : "🚀 Unlock Unlimited Blinko Trees"}
        </h3>

        <p className="text-xs text-on-surface-variant/80 mt-2 max-w-sm mx-auto leading-relaxed font-body-md px-2">
          {isProPreview
            ? `You're previewing "${featureName}" — a Pro exclusive style. Upgrade to Pro to save and publish it on your live page!`
            : "You've reached a locked feature or the free plan limit of 2 Blinko Trees. Upgrade to Pro to customize limitlessly."}
        </p>

        {!isProPreview && (
          <div className="relative mt-6">
            <div className="grid gap-2.5 text-left max-h-56 overflow-y-auto pr-0.5 no-scrollbar">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 rounded-2xl border border-black/5 bg-white/45 p-3.5 text-xs shadow-sm hover:translate-y-[-1px] hover:bg-white/60 hover:border-primary/10 transition-all duration-200"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-on-surface font-body-md">{benefit.title}</h4>
                    <p className="text-[10px] text-on-surface-variant/70 mt-0.5 font-body-md">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`flex flex-col gap-2.5 ${isProPreview ? "mt-5" : "mt-6"}`}>
          <button
            type="button"
            onClick={onUpgrade}
            className="w-full flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-container text-sm font-bold text-white hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-md cursor-pointer"
          >
            Upgrade to Pro
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-on-surface-variant/75 hover:text-on-surface text-xs font-semibold py-2 transition-all duration-200 cursor-pointer"
          >
            {isProPreview ? "Keep Exploring" : "Not Right Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
