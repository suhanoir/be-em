// Razorpay Integration with Automatic MOCK PAYMENT MODE
// When RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set, mock mode activates seamlessly.

export interface CreateOrderParams {
  amount: number; // in INR
  appointmentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: Record<string, string>;
}

export interface PaymentVerificationParams {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  isMock?: boolean;
}

export const isRazorpayConfigured = (): boolean => {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
};

export async function createPaymentOrder(params: CreateOrderParams) {
  const { amount, appointmentId, customerName, customerEmail, customerPhone } = params;

  if (!isRazorpayConfigured()) {
    // Generate Mock Order
    const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      isMock: true,
      orderId: mockOrderId,
      amount: amount * 100, // paise
      currency: "INR",
      keyId: "mock_key_beem",
      appointmentId,
      customerName,
      customerEmail,
      customerPhone,
      message: "BEEM Mock Payment Gateway active (No external keys needed)",
    };
  }

  // Real Razorpay Orders API
  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: appointmentId.slice(0, 40),
      notes: {
        appointmentId,
        customerName,
        customerEmail,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Razorpay order creation failed: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return {
    isMock: false,
    orderId: data.id,
    amount: data.amount,
    currency: data.currency,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    appointmentId,
    customerName,
    customerEmail,
    customerPhone,
  };
}

export function verifyPaymentSignature(params: PaymentVerificationParams): boolean {
  if (params.isMock || !isRazorpayConfigured()) {
    // Mock payments always pass verification
    return true;
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = params;
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }

  const crypto = require("crypto");
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpaySignature;
}
