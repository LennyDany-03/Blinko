import Link from "next/link";

const variants = {
  primary:
    "border-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-violet-950/30 hover:from-violet-500 hover:to-fuchsia-400",
  secondary:
    "border-white/10 bg-white/[0.04] text-white hover:border-violet-500/50 hover:bg-white/[0.08]",
  ghost:
    "border-transparent bg-transparent text-zinc-300 hover:bg-white/[0.05] hover:text-white",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  icon: Icon,
  type = "button",
}) {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-md border font-medium transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  ].join(" ");

  const content = (
    <>
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {content}
    </button>
  );
}
