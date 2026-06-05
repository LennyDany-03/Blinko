import { Eye, MousePointerClick, TrendingUp, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import DashboardCard from "./DashboardCard";

const iconMap = {
  Eye,
  MousePointerClick,
  TrendingUp,
  Users,
};

export default function StatsCard({ label, value, change, isPositive, timeframe, iconName }) {
  const IconComponent = iconMap[iconName] || TrendingUp;

  return (
    <DashboardCard hoverEffect className="relative overflow-hidden">
      {/* Background glow highlight */}
      <div className="absolute right-0 top-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-400">{label}</span>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2 text-violet-400">
          <IconComponent className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight text-white">
          {value}
        </span>
        <span
          className={[
            "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
            isPositive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400",
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
      <p className="mt-1 text-xs text-zinc-500">{timeframe}</p>
    </DashboardCard>
  );
}
