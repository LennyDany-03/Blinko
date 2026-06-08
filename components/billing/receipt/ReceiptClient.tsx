"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, CheckCircle2 } from "lucide-react";
import type { Session, User } from "@supabase/supabase-js";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { PRO_PLAN } from "@/lib/billing/constants";

export default function ReceiptClient() {
  const auth = useAuth() as {
    user: User | null;
    session: Session | null;
    loading: boolean;
  };
  const { user, loading: authLoading } = auth;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login?next=/billing/receipt");
      return;
    }

    const fetchReceiptData = async () => {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;
        setSubscription(data);
      } catch (err) {
        console.error("Error fetching receipt details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptData();
  }, [authLoading, user, router]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const invoiceId = subscription?.id 
    ? `INV-2026-${subscription.id.slice(0, 4).toUpperCase()}` 
    : `INV-2026-${user?.id.slice(0, 4).toUpperCase()}`;

  const transactionId = 
    subscription?.razorpay_payment_id || 
    subscription?.razorpay_order_id || 
    "pay_mock_direct_checkout";

  return (
    <div className="mx-auto max-w-md px-4 py-4 sm:py-6">
      {/* Back Link - Hidden on print */}
      <div className="mb-6 print:hidden">
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-md px-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Billing
        </Link>
      </div>

      {/* Printable Receipt Slip */}
      <div className="bg-white border border-black/5 shadow-2xl p-6 sm:p-8 rounded-2xl relative overflow-hidden select-none font-sans text-xs text-zinc-700 print:shadow-none print:border-none print:p-0 print:my-0">
        
        {/* Receipt Cut Line decoration at the top */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent opacity-50" />

        {/* Header Section */}
        <div className="text-center space-y-2">
          {/* Logo element resembling the 2nd image outline B */}
          <div className="inline-flex items-center justify-center gap-1.5 text-primary text-lg font-bold select-none font-sans">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-primary text-xs font-semibold text-primary">
              B
            </span>
            <span>Blinko</span>
          </div>
          <p className="text-[10px] text-zinc-400">AI-Powered Link-in-Bio Platform</p>
          <h2 className="text-sm font-bold text-zinc-800 tracking-wide uppercase pt-2">
            Payment Receipt
          </h2>
        </div>

        {/* Divider */}
        <div className="border-b border-dashed border-zinc-200 my-4" />

        {/* Invoice Metadata details */}
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-zinc-400">Date:</span>
            <span className="font-semibold text-zinc-700">
              {formatDate(subscription?.created_at)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Invoice Code:</span>
            <span className="font-mono font-semibold text-zinc-800">{invoiceId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Transaction ID:</span>
            <span className="font-mono text-zinc-700 truncate max-w-[180px]" title={transactionId}>
              {transactionId}
            </span>
          </div>
          {user?.email && (
            <div className="flex justify-between">
              <span className="text-zinc-400">Billed To:</span>
              <span className="text-zinc-700 font-medium truncate max-w-[180px]" title={user.email}>
                {user.email}
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-b border-dashed border-zinc-200 my-4" />

        {/* Item Table */}
        <div className="space-y-3">
          <div className="flex justify-between font-bold text-zinc-800 text-[10px] uppercase tracking-wider">
            <span>Description</span>
            <span className="text-right">Price</span>
          </div>
          
          <div className="flex justify-between items-start pt-1">
            <div className="space-y-0.5">
              <div className="font-semibold text-zinc-800">Blinko Pro Plan Upgrade</div>
              <div className="text-[10px] text-zinc-400">1 Month Subscription ({PRO_PLAN.billingCycle})</div>
            </div>
            <span className="font-mono font-semibold text-zinc-800">{PRO_PLAN.priceDisplay}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-zinc-100 my-4" />

        {/* Summary pricing list */}
        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between">
            <span className="text-zinc-400">Subtotal:</span>
            <span className="font-mono text-zinc-700">{PRO_PLAN.priceDisplay}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Tax / VAT (0%):</span>
            <span className="font-mono text-zinc-700">₹0.00</span>
          </div>
          <div className="flex justify-between border-t border-dashed border-zinc-100 pt-2 font-bold text-zinc-800">
            <span>Total Paid:</span>
            <span className="font-mono text-primary text-sm">{PRO_PLAN.priceDisplay}</span>
          </div>
        </div>

        {/* Status Badge inside receipt */}
        <div className="mt-5 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-500/20 uppercase tracking-wider">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Paid & Completed
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-dashed border-zinc-200 my-5" />

        {/* Barcode section */}
        <div className="flex flex-col items-center justify-center space-y-1">
          {/* Custom vector bars representing a barcode */}
          <div className="flex items-center h-8 gap-[1px]" aria-hidden="true">
            <div className="w-[2px] h-full bg-zinc-800" />
            <div className="w-[1px] h-full bg-zinc-800" />
            <div className="w-[3px] h-full bg-zinc-800" />
            <div className="w-[1px] h-full bg-zinc-800" />
            <div className="w-[2px] h-full bg-zinc-800" />
            <div className="w-[4px] h-full bg-zinc-800" />
            <div className="w-[1px] h-full bg-zinc-800" />
            <div className="w-[2px] h-full bg-zinc-800" />
            <div className="w-[3px] h-full bg-zinc-800" />
            <div className="w-[1px] h-full bg-zinc-800" />
            <div className="w-[4px] h-full bg-zinc-800" />
            <div className="w-[2px] h-full bg-zinc-800" />
            <div className="w-[1px] h-full bg-zinc-800" />
            <div className="w-[3px] h-full bg-zinc-800" />
            <div className="w-[2px] h-full bg-zinc-800" />
          </div>
          <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">
            {invoiceId}
          </span>
        </div>

        {/* Footer Note */}
        <div className="mt-5 text-center text-[10px] text-zinc-400 italic">
          Thank you for supporting Blinko!
        </div>
      </div>

      {/* Action panel at the bottom - Hidden on print */}
      <div className="mt-6 flex gap-3 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-white/80 hover:bg-white text-zinc-700 px-4 py-3 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
        >
          <Printer className="h-4 w-4" />
          Print Receipt
        </button>
        <Link
          href="/dashboard"
          className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/95 text-white px-4 py-3 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm text-center"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
