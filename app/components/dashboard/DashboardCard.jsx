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
        "relative overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-6 text-left transition-all duration-300 backdrop-blur-md shadow-sm",
        hoverEffect
          ? "hover:-translate-y-1 hover:border-white/85 hover:bg-white/60 hover:shadow-md hover:shadow-primary/5"
          : "",
        gradientBorder
          ? "before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-r before:from-primary/20 before:to-secondary/20 before:rounded-2xl before:-z-10"
          : "",
        onClick ? "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40" : "",
        className,
      ].join(" ")}
    >
      {/* Subtle background gradient for extra depth */}
      <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-primary/5 opacity-[0.05] blur-3xl pointer-events-none" />
      <div className="relative z-10 w-full">{children}</div>
    </CardElement>
  );
}
