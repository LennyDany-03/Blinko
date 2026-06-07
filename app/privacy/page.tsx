import type { Metadata } from "next";
import LegalPageShell from "@/components/layout/LegalPageShell";
import LegalDocument, { LegalSection } from "@/components/layout/LegalDocument";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Learn how Blinko by Ascendry collects, uses, and protects your personal information.",
  path: "/privacy",
});

const LAST_UPDATED = "June 8, 2026";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell>
      <LegalDocument title="Privacy Policy" lastUpdated={LAST_UPDATED}>
        <LegalSection title="1. Information We Collect">
          <p>
            When you use Blinko, we may collect the following types of
            information to provide and improve our services:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-on-surface">Name</strong> — provided
              during account registration or profile setup.
            </li>
            <li>
              <strong className="text-on-surface">Email</strong> — used for
              account access, notifications, and support communication.
            </li>
            <li>
              <strong className="text-on-surface">Profile data</strong> — such
              as display name, bio, avatar, and public page content you choose
              to publish.
            </li>
            <li>
              <strong className="text-on-surface">Social links</strong> — URLs
              and platform identifiers you add to your Blinko page.
            </li>
            <li>
              <strong className="text-on-surface">Analytics data</strong> — page
              views, link clicks, and usage metrics related to your Blinko
              Trees.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="2. How We Use Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Create and manage your Blinko account and public pages.</li>
            <li>Provide analytics and performance insights for your content.</li>
            <li>Process subscriptions and deliver Pro features.</li>
            <li>Send service-related communications and support responses.</li>
            <li>Improve platform security, reliability, and user experience.</li>
            <li>Comply with applicable legal and regulatory obligations.</li>
          </ul>
        </LegalSection>

        <LegalSection title="3. Authentication">
          <p>
            Blinko supports secure account access through email and password
            authentication, as well as third-party sign-in providers.
          </p>
          <p>
            <strong className="text-on-surface">Google Authentication</strong>{" "}
            may be used for account access. When you sign in with Google, we
            receive basic profile information (such as your name and email
            address) as permitted by your Google account settings. We use this
            information solely to authenticate your account and personalize your
            Blinko experience.
          </p>
        </LegalSection>

        <LegalSection title="4. Payment Information">
          <p>
            Blinko Pro subscriptions are billed through our payment partner,
            Razorpay. When you make a purchase:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Payments are securely processed through{" "}
              <strong className="text-on-surface">Razorpay</strong>.
            </li>
            <li>
              <strong className="text-on-surface">
                Blinko does not store card details
              </strong>{" "}
              or full payment credentials on our servers.
            </li>
            <li>
              Razorpay handles payment data in accordance with applicable
              payment industry security standards.
            </li>
          </ul>
          <p>
            We may retain transaction references (such as payment status,
            subscription plan, and billing dates) for account management,
            invoicing, and support purposes.
          </p>
        </LegalSection>

        <LegalSection title="5. Data Security">
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. These measures include
            encrypted connections (HTTPS), access controls, and secure
            infrastructure provided by our hosting and database partners.
          </p>
          <p>
            While we strive to protect your data, no method of transmission or
            storage is completely secure. You are responsible for maintaining
            the confidentiality of your account credentials.
          </p>
        </LegalSection>

        <LegalSection title="6. Cookies and Analytics">
          <p>
            Blinko uses cookies and similar technologies to maintain sessions,
            remember preferences, and understand how users interact with our
            platform. Analytics tools help us measure page performance, feature
            usage, and overall service health.
          </p>
          <p>
            You can control cookie preferences through your browser settings.
            Disabling certain cookies may limit some platform functionality.
          </p>
        </LegalSection>

        <LegalSection title="7. User Rights">
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate information.</li>
            <li>Request deletion of your account and associated data.</li>
            <li>Object to or restrict certain processing activities.</li>
            <li>Export your data in a portable format where applicable.</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a
              href="mailto:support@blinko.app"
              className="font-semibold text-primary hover:text-primary-container transition-colors"
            >
              support@blinko.app
            </a>
            . We will respond within a reasonable timeframe.
          </p>
        </LegalSection>

        <LegalSection title="8. Contact Information">
          <p>
            Blinko is a product of Ascendry. For privacy-related inquiries,
            please contact:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:support@blinko.app"
              className="font-semibold text-primary hover:text-primary-container transition-colors"
            >
              support@blinko.app
            </a>
          </p>
        </LegalSection>
      </LegalDocument>
    </LegalPageShell>
  );
}
