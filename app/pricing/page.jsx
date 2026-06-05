import {
  ArrowRight,
  BarChart3,
  Check,
  HelpCircle,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PricingCard from "../components/PricingCard";

export const metadata = {
  title: "Pricing | Blinko",
  description: "Simple pricing for AI-powered link-in-bio pages and mini websites.",
};

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Launch a polished link hub with the essentials.",
    cta: "Start Free",
    features: [
      "AI Layout Suggestions",
      "Social Links",
      "Contact Form",
      "5 Themes",
      "Custom Username URL",
    ],
  },
  {
    name: "Pro",
    price: "$5",
    description: "Turn your page into a mini website that grows with you.",
    cta: "Upgrade to Pro",
    popular: true,
    features: [
      "Portfolio Section",
      "Mini Store",
      "Custom Domain",
      "Advanced Analytics",
      "Latest Posts Feed",
      "Unlimited Themes",
      "Remove Branding",
      "AI Bio Rewriter",
    ],
  },
];

const comparison = [
  ["AI Layout Suggestions", true, true],
  ["Social Links", true, true],
  ["Contact Form", true, true],
  ["Portfolio Section", false, true],
  ["Mini Store", false, true],
  ["Custom Domain", false, true],
  ["Advanced Analytics", false, true],
  ["Remove Branding", false, true],
];

const faqs = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes. Start free and move to Pro whenever you need domains, analytics, or commerce blocks.",
  },
  {
    question: "Do I need design experience?",
    answer:
      "No. Blinko uses guided sections, smart defaults, and AI layout suggestions to keep your page sharp.",
  },
  {
    question: "Is there a transaction fee for mini store links?",
    answer:
      "Blinko does not process payments in this demo UI. Store sections are represented with dummy content only.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main>
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.24),transparent_36%)]" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-200">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Built for modern creators
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
              Simple Pricing
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Everything you need to build your online presence.
            </p>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            {plans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Why Choose Blinko?
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
              Blinko helps creators, students, freelancers, and businesses build
              their online presence without needing a full website.
            </p>
          </div>
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Feature Comparison
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Compare the essentials before you choose your launch plan.
                </p>
              </div>
              <div className="flex gap-3">
                <Metric icon={Zap} label="Fast setup" />
                <Metric icon={Shield} label="Secure by default" />
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-[#222222] bg-[#111111]">
              <div className="grid grid-cols-[1.5fr_0.75fr_0.75fr] border-b border-[#222222] bg-white/[0.02] p-4 text-sm font-medium text-zinc-300">
                <span>Feature</span>
                <span className="text-center">Free</span>
                <span className="text-center">Pro</span>
              </div>
              {comparison.map(([feature, free, pro]) => (
                <div
                  key={feature}
                  className="grid grid-cols-[1.5fr_0.75fr_0.75fr] border-b border-[#222222] p-4 text-sm last:border-0"
                >
                  <span className="text-zinc-300">{feature}</span>
                  <span className="flex justify-center text-zinc-500">
                    {free ? <CheckMark /> : "—"}
                  </span>
                  <span className="flex justify-center text-zinc-500">
                    {pro ? <CheckMark /> : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 md:grid-cols-3">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-lg border border-[#222222] bg-[#111111] p-5 transition duration-200 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-white/[0.03]"
                >
                  <HelpCircle
                    className="h-5 w-5 text-violet-300"
                    aria-hidden="true"
                  />
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto overflow-hidden rounded-lg border border-violet-500/30 bg-[#111111] p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                  Launch a page that feels like a product.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                  Use AI to shape your bio, showcase your work, collect leads,
                  and point every audience to the right destination.
                </p>
                <Button href="/signup" className="mt-6" icon={ArrowRight}>
                  Get Started
                </Button>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <BarChart3 className="h-4 w-4 text-violet-300" />
                  Weekly page activity
                </div>
                <div className="mt-6 grid grid-cols-7 items-end gap-2">
                  {[42, 58, 46, 72, 64, 88, 96].map((height) => (
                    <div
                      key={height}
                      className="rounded-t bg-gradient-to-t from-violet-700 to-fuchsia-400"
                      style={{ height: `${height}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function CheckMark() {
  return <Check className="h-4 w-4 text-violet-300" aria-hidden="true" />;
}

function Metric({ icon: Icon, label }) {
  return (
    <div className="hidden items-center gap-2 rounded-md border border-[#222222] bg-[#111111] px-3 py-2 text-xs text-zinc-400 sm:flex">
      <Icon className="h-4 w-4 text-violet-300" aria-hidden="true" />
      {label}
    </div>
  );
}
