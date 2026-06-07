import { Loader2, Lock } from "lucide-react";

type CheckoutPaymentButtonProps = {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
};

export default function CheckoutPaymentButton({
  disabled,
  loading,
  onClick,
}: CheckoutPaymentButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary-container px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      aria-busy={loading}
    >
      <span className="absolute inset-0 -translate-x-full bg-white/20 transition group-hover:translate-x-full duration-700" />
      <span className="relative inline-flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Preparing secure checkout…
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" aria-hidden="true" />
            Proceed to Secure Payment
          </>
        )}
      </span>
    </button>
  );
}
