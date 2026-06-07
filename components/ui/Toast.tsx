"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

type ToastVariant = "success" | "error";

type ToastProps = {
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  variant = "success",
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = variant === "success";

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-2.5 rounded-xl border border-black/5 bg-white px-4 py-3 text-sm shadow-2xl animate-in fade-in slide-in-from-bottom-4"
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden="true" />
      )}
      <span className={isSuccess ? "text-on-surface" : "text-error"}>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-1 rounded-md p-0.5 text-on-surface-variant hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
