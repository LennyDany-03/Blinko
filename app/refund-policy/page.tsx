import type { Metadata } from "next";
import LegalPageShell from "@/components/layout/LegalPageShell";
import LegalDocument, { LegalSection } from "@/components/layout/LegalDocument";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Refund Policy",
  description:
    "Understand Blinko Pro subscription billing, cancellation, and refund eligibility.",
  path: "/refund-policy",
});

const LAST_UPDATED = "June 8, 2026";

export default function RefundPolicyPage() {
  return (
    <LegalPageShell>
      <LegalDocument title="Refund Policy" lastUpdated={LAST_UPDATED}>
        <LegalSection title="1. Subscription Purchases">
          <p>
            <strong className="text-on-surface">Blinko Pro</strong> subscriptions
            are billed on a recurring monthly basis. When you upgrade to Blinko
            Pro, your payment is processed securely through Razorpay, our
            authorized payment gateway partner.
          </p>
          <p>
            Each billing cycle grants access to Pro features for one month from
            the date of successful payment. Your subscription renews
            automatically unless cancelled before the next billing date.
          </p>
        </LegalSection>

        <LegalSection title="2. Cancellation">
          <p>
            You may cancel future renewals at any time through your account
            billing settings or by contacting our support team. Cancellation
            stops subsequent charges but does not retroactively refund the
            current billing period.
          </p>
          <p>
            After cancellation, you will retain Pro access until the end of
            your current paid billing cycle, after which your account will
            revert to the Free plan.
          </p>
        </LegalSection>

        <LegalSection title="3. Refund Eligibility">
          <p>
            Blinko Pro is a digital subscription service. Refunds are generally
            not provided for change of mind or partial usage. However, refunds
            may be considered on a case-by-case basis for the following
            situations:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-on-surface">Duplicate charges</strong> —
              when the same subscription payment was processed more than once
              in error.
            </li>
            <li>
              <strong className="text-on-surface">Technical billing errors</strong>{" "}
              — when a charge was applied incorrectly due to a system or payment
              processing malfunction verified by our team.
            </li>
          </ul>
          <p>
            Refund requests must be submitted within 7 days of the charge in
            question. Approved refunds are processed back to the original payment
            method via Razorpay and may take 5–10 business days to appear on
            your statement.
          </p>
        </LegalSection>

        <LegalSection title="4. Non-refundable Situations">
          <p>The following are not eligible for refunds:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong className="text-on-surface">Partial usage</strong> — if
              you used Pro features during the billing period, even for a short
              time.
            </li>
            <li>
              <strong className="text-on-surface">Change of mind</strong> — deciding
              you no longer need or want the subscription after purchase.
            </li>
            <li>
              <strong className="text-on-surface">Unused subscription time</strong>{" "}
              — remaining days in a billing cycle after cancellation or account
              downgrade.
            </li>
            <li>
              Account suspension or termination due to violation of our Terms of
              Service.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="5. Contact Information">
          <p>
            To request a refund review, cancel your subscription, or ask billing
            questions, contact our support team:
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
          <p>
            Please include your registered email address, transaction date, and
            a brief description of the issue. We aim to respond within 24–48
            hours.
          </p>
        </LegalSection>
      </LegalDocument>
    </LegalPageShell>
  );
}
