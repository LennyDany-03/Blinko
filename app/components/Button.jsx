import Link from "next/link";

const variants = {
  /* ── Legacy variants (for dashboard/auth pages) ── */
  primary:
    "border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:from-violet-500 hover:to-fuchsia-400",
  secondary:
    "border-white/40 bg-white/50 text-slate-800 backdrop-blur-xl hover:bg-white/70 hover:border-white/60 shadow-sm hover:shadow-md",
  "secondary-dark":
    "border-white/15 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20 hover:border-white/25",
  ghost:
    "border-transparent bg-transparent text-slate-600 hover:bg-white/40 hover:text-slate-900",

  /* ── Cyber-Neural variants (for landing page) ── */
  "primary-cyber":
    "border-transparent bg-[#00f5d4] text-[#00382f] font-bold shadow-[0_0_20px_rgba(0,245,212,0.3)] hover:shadow-[0_0_30px_rgba(0,245,212,0.45)] hover:scale-105 active:scale-95",
  "ghost-cyber":
    "border-white/10 bg-transparent text-[#dbe5e0] backdrop-blur-xl hover:bg-white/5 hover:border-white/20 font-bold",

  /* ── Luminous Horizon variants ── */
  luminous:
    "border-transparent bg-primary text-white shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:bg-primary/95",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-10 text-base",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  type = "button",
  ...props
}) {
  const isCyber = variant.includes("cyber");
  const isRound = isCyber || variant === "luminous";
  const roundClass = isRound ? "rounded-full" : "rounded-xl";
  const focusRingClass = variant === "luminous"
    ? "focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-transparent"
    : "focus:ring-2 focus:ring-violet-500/40 focus:ring-offset-2 focus:ring-offset-transparent";

  const classes = [
    "inline-flex items-center justify-center gap-2 border font-semibold transition-all duration-300 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
    roundClass,
    !isCyber && "hover:-translate-y-0.5",
    !isCyber && focusRingClass,
    variants[variant],
    sizes[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {children}
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {content}
    </button>
  );
}
