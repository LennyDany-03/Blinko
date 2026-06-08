import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import ReceiptClient from "@/components/billing/receipt/ReceiptClient";

export const metadata: Metadata = createPageMetadata({
  title: "Payment Receipt",
  description: "View and print your Blinko Pro payment receipt.",
  path: "/billing/receipt",
});

export default function ReceiptPage() {
  return <ReceiptClient />;
}
