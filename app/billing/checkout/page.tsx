import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import CheckoutClient from "@/components/billing/checkout/CheckoutClient";

export const metadata: Metadata = createPageMetadata({
  title: "Blinko Pro Checkout",
  description:
    "Upgrade to Blinko Pro and unlock unlimited links, premium themes, analytics, and custom domains.",
  path: "/billing/checkout",
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
