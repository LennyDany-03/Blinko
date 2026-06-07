import Razorpay from "razorpay";
import crypto from "crypto";

export function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  const isConfigured =
    Boolean(keyId && keySecret) &&
    keyId !== "rzp_test_yourKeyId" &&
    keySecret !== "yourRazorpayKeySecret";

  return { keyId, keySecret, isConfigured };
}

export function createRazorpayClient() {
  const { keyId, keySecret, isConfigured } = getRazorpayCredentials();

  if (!isConfigured || !keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const { keySecret, isConfigured } = getRazorpayCredentials();

  if (!isConfigured || !keySecret) {
    return orderId.startsWith("order_mock_") && paymentId.startsWith("pay_mock_");
  }

  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");
  return expected === signature;
}

export function createMockOrderId(): string {
  return `order_mock_${Date.now()}`;
}

export function createMockPaymentId(): string {
  return `pay_mock_${Date.now()}`;
}
