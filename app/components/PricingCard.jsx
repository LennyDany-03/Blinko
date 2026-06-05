import { Check, Sparkles } from "lucide-react";
import Button from "./Button";
import Card from "./Card";

export default function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  popular = false,
}) {
  return (
    <Card
      className={[
        "relative flex h-full flex-col p-6 transition duration-200 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-white/[0.03]",
        popular ? "border-violet-500/60 bg-violet-500/[0.07]" : "",
      ].join(" ")}
    >
      {popular ? (
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-violet-400/30 bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-100">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Most Popular
        </div>
      ) : null}

      <div>
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="mt-2 min-h-10 text-sm leading-5 text-zinc-400">
          {description}
        </p>
        <div className="mt-6 flex items-end gap-1">
          <span className="text-4xl font-semibold tracking-tight text-white">
            {price}
          </span>
          <span className="pb-1 text-sm text-zinc-500">/month</span>
        </div>
      </div>

      <Button
        href="/signup"
        variant={popular ? "primary" : "secondary"}
        className="mt-6 w-full"
      >
        {cta}
      </Button>

      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm text-zinc-300">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-violet-300"
              aria-hidden="true"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
