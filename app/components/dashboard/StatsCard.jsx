import { Eye, MousePointerClick, TrendingUp, Users, Link2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import DashboardCard from "./DashboardCard";

const iconMap = {
  Eye,
  MousePointerClick,
  TrendingUp,
  Users,
  Link2,
};

export default function StatsCard({ label, value, change, isPositive, timeframe, iconName }) {
  const IconComponent = iconMap[iconName] || TrendingUp;

  return (
    <DashboardCard hoverEffect className="relative overflow-hidden">
      {/* Background glow highlight */}
      <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-on-surface-variant/80">{label}</span>
        <div className="rounded-xl border border-black/5 bg-white/50 p-2.5 text-primary shadow-sm">
          <IconComponent className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-on-surface font-display-xl">
          {value}
        </span>
        <span
          className={[
            "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold border",
            isPositive
              ? "bg-emerald-55/70 border-emerald-100 text-emerald-700"
              : "bg-rose-55/70 border-rose-100 text-rose-700",
          ].join(" ")}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {change}
        </span>
      </div>
      <p className="mt-1.5 text-xs text-on-surface-variant/60">{timeframe}</p>
    </DashboardCard>
  );
}
