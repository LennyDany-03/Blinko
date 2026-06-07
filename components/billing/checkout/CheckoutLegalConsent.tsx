import Link from "next/link";

type ConsentState = {
  terms: boolean;
  privacy: boolean;
  renewal: boolean;
};

type CheckoutLegalConsentProps = {
  consent: ConsentState;
  onChange: (key: keyof ConsentState, value: boolean) => void;
};

const consentItems: {
  key: keyof ConsentState;
  label: React.ReactNode;
}[] = [
  {
    key: "terms",
    label: (
      <>
        I agree to the{" "}
        <Link href="/terms" className="font-semibold text-primary hover:underline" target="_blank">
          Terms of Service
        </Link>
        .
      </>
    ),
  },
  {
    key: "privacy",
    label: (
      <>
        I have read the{" "}
        <Link href="/privacy" className="font-semibold text-primary hover:underline" target="_blank">
          Privacy Policy
        </Link>
        .
      </>
    ),
  },
  {
    key: "renewal",
    label: (
      <>
        I understand this subscription renews monthly. See our{" "}
        <Link
          href="/refund-policy"
          className="font-semibold text-primary hover:underline"
          target="_blank"
        >
          Refund Policy
        </Link>
        .
      </>
    ),
  },
];

export default function CheckoutLegalConsent({ consent, onChange }: CheckoutLegalConsentProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Legal consent</legend>
      {consentItems.map(({ key, label }) => {
        const id = `consent-${key}`;
        return (
          <label
            key={key}
            htmlFor={id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-black/5 bg-white/50 p-3 text-xs leading-relaxed text-on-surface-variant transition hover:border-primary/20 focus-within:ring-2 focus-within:ring-primary/30"
          >
            <input
              id={id}
              type="checkbox"
              checked={consent[key]}
              onChange={(e) => onChange(key, e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-black/20 text-primary focus:ring-primary/40"
            />
            <span>{label}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

export type { ConsentState };
