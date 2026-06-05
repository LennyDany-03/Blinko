export default function DashboardCard({
  children,
  className = "",
  hoverEffect = false,
  gradientBorder = false,
  onClick,
}) {
  const CardElement = onClick ? "button" : "div";

  return (
    <CardElement
      onClick={onClick}
      className={[
        "relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950 p-6 text-left transition-all duration-300",
        hoverEffect
          ? "hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/40 hover:shadow-xl hover:shadow-violet-950/10"
          : "",
        gradientBorder
          ? "before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-violet-500/30 before:to-fuchsia-500/30 before:rounded-xl before:-z-10"
          : "",
        onClick ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/50" : "",
        className,
      ].join(" ")}
    >
      {/* Subtle background gradient for extra depth */}
      <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-violet-600/5 opacity-[0.03] blur-3xl pointer-events-none" />
      <div className="relative z-10 w-full">{children}</div>
    </CardElement>
  );
}
