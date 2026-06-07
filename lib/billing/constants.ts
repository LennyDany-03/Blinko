export const PRO_PLAN = {
  id: "pro_monthly",
  name: "Blinko Pro",
  priceCents: 29900,
  priceDisplay: "₹299.00",
  priceShort: "₹299",
  priceMo: "₹299/mo",
  currency: "INR",
  billingCycle: "Monthly",
  recurringDisplay: "₹299/month",
  taxDisplay: "₹0.00",
  paymentDescription: "Blinko Pro Subscription - ₹299/month",
  priceHelper: "Less than ₹10/day",
} as const;

export const PRO_FEATURES = [
  "Unlimited Blinko Trees",
  "Unlimited Links",
  "Premium Themes",
  "Analytics Dashboard",
  "CTR Tracking",
  "Custom Domains",
  "Priority Support",
  "Future Premium Features",
] as const;

export const FREE_LIMITS = [
  "2 Trees",
  "2 Links per Tree",
  "Basic Themes",
] as const;

export const PRO_BENEFITS = [
  "Unlimited Trees",
  "Unlimited Links",
  "Premium Themes",
  "Analytics",
  "Custom Domains",
] as const;

export const TRUST_INDICATORS = [
  "Secure Payments via Razorpay",
  "Cancel Anytime",
  "Instant Activation",
  "No Hidden Charges",
] as const;

export const SUCCESS_FEATURES = [
  "Unlimited Trees",
  "Unlimited Links",
  "Premium Themes",
  "Analytics Dashboard",
  "Custom Domains",
] as const;
