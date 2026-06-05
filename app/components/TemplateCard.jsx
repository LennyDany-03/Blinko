import { ArrowUpRight, LayoutTemplate, Wand2 } from "lucide-react";
import Button from "./Button";
import Card from "./Card";

export default function TemplateCard({
  name,
  description,
  gradient,
  accent,
  stats,
}) {
  return (
    <Card className="group overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-white/[0.03]">
      <div className={`relative h-48 overflow-hidden ${gradient}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_32%)]" />
        <div className="absolute left-5 right-5 top-5 rounded-lg border border-white/15 bg-black/35 p-4 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${accent}`} />
              <span className="text-xs font-medium text-white/80">
                blinko.site/{name.toLowerCase().replace(" ", "-")}
              </span>
            </div>
            <LayoutTemplate className="h-4 w-4 text-white/60" />
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-white/70" />
            <div className="h-2 w-1/2 rounded-full bg-white/35" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {stats.map((item) => (
              <div key={item} className="rounded-md bg-white/10 p-2">
                <div className="h-2 w-full rounded-full bg-white/40" />
                <div className="mt-2 h-2 w-2/3 rounded-full bg-white/20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">{name}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {description}
            </p>
          </div>
          <Wand2 className="mt-1 h-4 w-4 shrink-0 text-violet-300" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full" icon={ArrowUpRight}>
            Preview
          </Button>
          <Button className="w-full">Use Template</Button>
        </div>
      </div>
    </Card>
  );
}
