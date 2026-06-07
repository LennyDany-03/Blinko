import type { Metadata } from "next";
import LegalPageShell from "@/components/layout/LegalPageShell";
import ContactForm, { ContactInfo } from "@/components/contact/ContactForm";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact the Blinko team by Ascendry. We respond to support inquiries within 24–48 hours.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalPageShell contentClassName="max-w-4xl">
      <div className="space-y-10">
        <header className="space-y-4 border-b border-black/5 pb-10 text-center md:text-left">
          <h1 className="font-display-xl text-[40px] leading-tight tracking-tight text-on-surface md:text-[48px]">
            Contact
          </h1>
          <p className="max-w-2xl font-body-md text-body-md leading-relaxed text-on-surface-variant">
            Have a question about Blinko, billing, or your account? Send us a
            message and our team will get back to you within 24–48 hours.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <ContactInfo />
          <div className="rounded-[32px] border border-white/60 bg-white/40 p-6 backdrop-blur-xl shadow-[0_8px_32px_rgba(159,65,34,0.04)] sm:p-8">
            <h2 className="mb-6 font-headline-md text-[22px] font-semibold text-on-surface">
              Send a Message
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </LegalPageShell>
  );
}
