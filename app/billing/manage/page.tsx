import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import ManageSubscriptionClient from "@/components/billing/manage/ManageSubscriptionClient";

export const metadata: Metadata = createPageMetadata({
  title: "Manage Blinko Pro",
  description: "View details of your active Blinko Pro subscription and manage billing options.",
  path: "/billing/manage",
});

export default function ManageSubscriptionPage() {
  return <ManageSubscriptionClient />;
}
