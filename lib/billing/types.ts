export type CheckoutOrderResponse = {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
};

export type VerifyPaymentRequest = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type SubscriptionRecord = {
  user_id: string;
  status: string;
  plan?: string | null;
  plan_id?: string | null;
  subscription_started_at?: string | null;
  current_period_end?: string | null;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_customer_id?: string | null;
  razorpay_subscription_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

export type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type RazorpayInstance = {
  open: () => void;
  on: (event: string, callback: (response: { error: { description: string } }) => void) => void;
};
