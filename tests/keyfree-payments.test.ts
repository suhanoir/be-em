import { describe, it, expect } from "vitest";
import { buildUpiPayUrl, generateUpiQrDataUrl } from "@/lib/payments";
import { validateAntiBot } from "@/lib/rate-limit";
import { encryptField, decryptField } from "@/lib/crypto";

describe("Key-Free UPI Payment Engine", () => {
  it("builds correct standard upi:// URI with amount and transactionRef", () => {
    const url = buildUpiPayUrl({
      amount: 1450,
      transactionRef: "BEEM-TEST-1001",
      note: "Haircut & Blowdry",
    });

    expect(url).toContain("upi://pay?");
    expect(url).toContain("pa=beem.luxury%40upi");
    expect(url).toContain("am=1450.00");
    expect(url).toContain("cu=INR");
    expect(url).toContain("tr=BEEM-TEST-1001");
  });

  it("generates local data URL QR code without any external API calls", async () => {
    const url = buildUpiPayUrl({
      amount: 500,
      transactionRef: "BEEM-TXN-999",
    });
    const qrDataUrl = await generateUpiQrDataUrl(url);

    expect(qrDataUrl).toBeDefined();
    expect(qrDataUrl.startsWith("data:image/png;base64,")).toBe(true);
  });
});

describe("Anti-Bot Protection", () => {
  it("detects bot when honeypot field is filled", () => {
    const check = validateAntiBot({ hp_website: "http://spam.com" });
    expect(check.isBot).toBe(true);
  });

  it("detects bot when form is submitted inhumanly fast (< 1.5s)", () => {
    const check = validateAntiBot({
      hp_website: "",
      formTimestamp: Date.now() - 500, // 0.5s ago
      minDurationSeconds: 1.5,
    });
    expect(check.isBot).toBe(true);
  });

  it("passes legitimate human submission", () => {
    const check = validateAntiBot({
      hp_website: "",
      formTimestamp: Date.now() - 4000, // 4s ago
      minDurationSeconds: 1.5,
    });
    expect(check.isBot).toBe(false);
  });
});

describe("Local AES-256-GCM Field Encryption", () => {
  it("encrypts and decrypts sensitive fields safely", () => {
    const sensitive = "Client has severe ammonia allergy and scalp sensitivity";
    const encrypted = encryptField(sensitive);
    expect(encrypted).not.toEqual(sensitive);
    expect(encrypted).toContain(":");

    const decrypted = decryptField(encrypted);
    expect(decrypted).toEqual(sensitive);
  });
});
