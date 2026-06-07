-- Run this migration in Supabase SQL Editor to support the checkout flow.
-- Adds payment tracking and subscription lifecycle fields to the subscriptions table.

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS plan_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Optional: index for payment lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay_order_id
  ON subscriptions (razorpay_order_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay_payment_id
  ON subscriptions (razorpay_payment_id);
