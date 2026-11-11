import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits for GCM
const TAG_LENGTH = 16; // 128 bits auth tag

function getEncryptionKey(): Buffer {
  const hex = process.env.DATA_ENCRYPTION_KEY || "";
  if (hex.length === 64) {
    return Buffer.from(hex, "hex");
  }
  // Fallback deterministic key derivation if key is different length (dev safety)
  return crypto.createHash("sha256").update(hex || "beem-local-secure-key-default-salt").digest();
}

/**
 * Encrypts plaintext using AES-256-GCM with a random IV and authentication tag.
 * Returns formatted string: iv:authTag:ciphertext (hex encoded)
 */
export function encryptField(plainText: string): string {
  if (!plainText) return plainText;
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts string formatted as iv:authTag:ciphertext using AES-256-GCM.
 */
export function decryptField(encryptedText: string): string {
  if (!encryptedText || !encryptedText.includes(":")) return encryptedText;
  try {
    const [ivHex, tagHex, cipherHex] = encryptedText.split(":");
    if (!ivHex || !tagHex || !cipherHex) return encryptedText;

    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(cipherHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    // If decryption fails (e.g. key changed or legacy plaintext), return original safely
    return encryptedText;
  }
}
