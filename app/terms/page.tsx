import type { Metadata } from "next";
import LegalPageShell from "@/components/layout/LegalPageShell";
import LegalDocument, { LegalSection } from "@/components/layout/LegalDocument";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Terms of Service",
  description:
    "Read the Terms of Service for Blinko, the AI-powered link-in-bio platform by Ascendry.",
  path: "/terms",
});

const LAST_UPDATED = "June 8, 2026";

export default function TermsOfServicePage() {
  return (
    <LegalPageShell>
      <LegalDocument title="Terms of Service" lastUpdated={LAST_UPDATED}>
        <LegalSection title="1. Acceptance of Terms">
          <p>
            By accessing or using Blinko (&quot;the Service&quot;), operated by
            Ascendry, you agree to be bound by these Terms of Service. If you do
            not agree to these terms, you may not use the Service.
          </p>
          <p>
            These terms apply to all users, including free and paid (Blinko Pro)
            subscribers.
          </p>
        </LegalSection>

        <LegalSection title="2. Account Responsibilities">
          <p>When you create a Blinko account, you agree to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Provide accurate and complete registration information.</li>
            <li>Maintain the security of your login credentials.</li>
            <li>Accept responsibility for all activity under your account.</li>
            <li>Notify us promptly of any unauthorized access or security breach.</li>
            <li>Ensure content published on your Blinko page complies with these terms and applicable laws.</li>
          </ul>
        </LegalSection>

        <LegalSection title="3. Prohibited Activities">
          <p>You may not use Blinko to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Upload malicious content or harmful code.</li>
            <li>Upload phishing links or deceptive content designed to mislead users.</li>
            <li>Upload malware, viruses, or any software intended to damage systems or data.</li>
            <li>Abuse services, including spamming, scraping, or circumventing usage limits.</li>
            <li>Violate any applicable local, national, or international laws or regulations.</li>
            <li>Infringe on the intellectual property or privacy rights of others.</li>
            <li>Harass, threaten, or harm other users or third parties.</li>
          </ul>
          <p>
            Blinko reserves the right to remove content and suspend accounts
            that violate these prohibitions.
          </p>
        </LegalSection>

        <LegalSection title="4. Subscription Terms">
          <p>
            <strong className="text-on-surface">Blinko Pro</strong> is a
            recurring subscription service billed on a monthly basis. By
            subscribing to Blinko Pro, you authorize Ascendry to charge your
            selected payment method at the then-current rate (currently ₹299/month)
            until you cancel.
          </p>
          <p>
            Subscription benefits, pricing, and features may be updated from
            time to time. Material changes will be communicated through the
            platform or via email where appropriate.
          </p>
          <p>
            Payments are processed securely through Razorpay. Please refer to
            our Refund Policy for billing and cancellation details.
          </p>
        </LegalSection>

        <LegalSection title="5. Account Suspension">
          <p>
            Blinko may suspend or terminate accounts that violate these Terms of
            Service, engage in prohibited activities, or pose a risk to the
            platform or other users. We may also suspend accounts pending
            investigation of reported abuse.
          </p>
          <p>
            Upon suspension or termination, your access to the Service may be
            restricted. Content may be removed at our discretion. Subscription
            fees are generally non-refundable except as outlined in our Refund
            Policy.
          </p>
        </LegalSection>

        <LegalSection title="6. Limitation of Liability">
          <p>
            Blinko is provided on an &quot;as is&quot; and &quot;as available&quot;
            basis. To the fullest extent permitted by law, Ascendry disclaims all
            warranties, express or implied, including merchantability and fitness
            for a particular purpose.
          </p>
          <p>
            Ascendry shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the
            Service, including loss of data, revenue, or business opportunities.
            Our total liability for any claim related to the Service shall not
            exceed the amount you paid to Blinko in the twelve (12) months
            preceding the claim.
          </p>
        </LegalSection>

        <LegalSection title="7. Changes to Terms">
          <p>
            We may update these Terms of Service from time to time. When we make
            material changes, we will update the &quot;Last Updated&quot; date at
            the top of this page and, where appropriate, notify you via email or
            in-app notice.
          </p>
          <p>
            Continued use of Blinko after changes take effect constitutes
            acceptance of the revised terms.
          </p>
        </LegalSection>

        <LegalSection title="8. Contact Information">
          <p>For questions about these Terms of Service, contact us at:</p>
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
