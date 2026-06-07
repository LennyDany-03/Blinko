import type { ReactNode } from "react";

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="font-headline-md text-[22px] font-semibold text-on-surface">
        {title}
      </h2>
      <div className="space-y-3 font-body-md text-body-md leading-relaxed text-on-surface-variant">
        {children}
      </div>
    </section>
  );
}

type LegalDocumentProps = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
  contactEmail?: string;
};

export default function LegalDocument({
  title,
  lastUpdated,
  children,
  contactEmail = "support@blinko.app",
}: LegalDocumentProps) {
  return (
    <article className="space-y-10">
      <header className="space-y-4 border-b border-black/5 pb-10">
        <h1 className="font-display-xl text-[40px] leading-tight tracking-tight text-on-surface md:text-[48px]">
          {title}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Last Updated: {lastUpdated}
        </p>
      </header>

      <div className="space-y-10">{children}</div>

      <footer className="rounded-2xl border border-black/5 bg-white/40 p-6 backdrop-blur-sm">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Questions? Contact us at{" "}
          <a
            href={`mailto:${contactEmail}`}
            className="font-semibold text-primary transition-colors hover:text-primary-container"
          >
            {contactEmail}
          </a>
        </p>
      </footer>
    </article>
  );
}
