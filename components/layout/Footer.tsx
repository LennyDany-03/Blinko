import Link from "next/link";

const footerLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Contact", href: "/contact" },
] as const;

type FooterProps = {
  className?: string;
};

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      className={`relative z-20 w-full border-t border-black/5 bg-surface/80 backdrop-blur-sm ${className}`}
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-[1515px] px-container-padding py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-16 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            <p className="font-display-xl text-headline-md text-on-surface">
              Blinko{" "}
              <span className="font-body-md text-body-md font-medium text-on-surface-variant">
                by Ascendry
              </span>
            </p>
            <p className="max-w-md font-body-md text-body-md leading-relaxed text-on-surface-variant">
              Build your online presence with a powerful AI-powered link-in-bio
              platform.
            </p>
          </div>

          <nav
            aria-label="Legal and support links"
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap md:flex-col md:items-start lg:gap-3"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body-md text-body-md font-medium text-on-surface-variant transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 rounded-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-black/5 pt-8 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
          <p className="font-medium">
            © 2026 Blinko. All rights reserved.
          </p>
          <p className="font-medium">
            Powered by{" "}
            <span className="text-on-surface">Ascendry</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
