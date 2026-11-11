// Key-Free Local UPI & Salon Payment Engine
// 100% self-hosted: generates offline UPI URLs and QR codes without any external APIs.
import QRCode from "qrcode";

export const SALON_UPI_ID = process.env.SALON_UPI_ID || "beem.luxury@upi";
export const SALON_PAYEE_NAME = process.env.SALON_PAYEE_NAME || "BEEM Beauty Empire";

export interface GenerateUpiUrlParams {
  amount: number;
  transactionRef: string;
  note?: string;
  upiId?: string;
  payeeName?: string;
}

/**
 * Builds a standard UPI deep-link URI compatible with all Indian UPI apps
 * (Google Pay, PhonePe, Paytm, BHIM, etc.)
 */
export function buildUpiPayUrl(params: GenerateUpiUrlParams): string {
  const {
    amount,
    transactionRef,
    note = "BEEM Salon Booking",
    upiId = SALON_UPI_ID,
    payeeName = SALON_PAYEE_NAME,
  } = params;

  const cleanAmount = amount.toFixed(2);
  const encodedNote = encodeURIComponent(note.slice(0, 50));
  const encodedPayee = encodeURIComponent(payeeName);

  return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodedPayee}&am=${cleanAmount}&cu=INR&tr=${encodeURIComponent(
    transactionRef
  )}&tn=${encodedNote}`;
}

/**
 * Generates an offline data URL (PNG) for the given UPI pay URI.
 * Zero external calls, 100% local rendering using pure JavaScript.
 */
export async function generateUpiQrDataUrl(upiUrl: string): Promise<string> {
  return QRCode.toDataURL(upiUrl, {
    width: 280,
    margin: 2,
    color: {
      dark: "#4C1D95", // Brand Deep Purple
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "M",
  });
}
