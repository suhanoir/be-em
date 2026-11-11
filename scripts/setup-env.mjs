import fs from "fs";
import path from "path";
import crypto from "crypto";

const envPath = path.resolve(process.cwd(), ".env");

function generateRandomHex(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

console.log("=== BEEM (Beauty Empire) Zero-Key Environment Setup ===");

const authSecret = generateRandomHex(32); // 64 hex characters
const encryptionKey = generateRandomHex(32); // 32 bytes (64 hex) for AES-256

const envContent = `# ==============================================================================
# BEEM (Beauty Empire) - Key-Free & AI-Free Configuration
# Generated automatically by scripts/setup-env.mjs
# Zero third-party accounts, APIs, or external tokens required.
# ==============================================================================

# 1. Local Database (SQLite default; can be replaced with PostgreSQL)
DATABASE_URL="file:./dev.db"

# 2. Local Session Signing & Field Encryption (Self-Generated Secrets)
NEXTAUTH_SECRET="${authSecret}"
AUTH_SECRET="${authSecret}"
NEXTAUTH_URL="http://localhost:3000"
DATA_ENCRYPTION_KEY="${encryptionKey}"

# 3. Application URLs & Metadata
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 4. Salon Contact & Local UPI Configuration (No Payment Gateway Needed)
NEXT_PUBLIC_SALON_NAME="BEEM (Beauty Empire)"
NEXT_PUBLIC_SALON_PHONE="+919876543210"
NEXT_PUBLIC_SALON_WHATSAPP="919876543210"
NEXT_PUBLIC_SALON_EMAIL="contact@beem.luxury"
NEXT_PUBLIC_SALON_ADDRESS="Shop 12-14, Luxury Promenade, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038"
NEXT_PUBLIC_SALON_UPI_ID="beem.luxury@upi"
NEXT_PUBLIC_SALON_UPI_NAME="BEEM Beauty Empire"

# 5. Disable Next.js Telemetry
NEXT_TELEMETRY_DISABLED="1"
`;

fs.writeFileSync(envPath, envContent, "utf8");
console.log(`[SUCCESS] Fresh .env generated successfully at ${envPath}`);
console.log("- Self-generated AUTH_SECRET: [configured]");
console.log("- Self-generated DATA_ENCRYPTION_KEY: [configured]");
console.log("- Local Database URL: file:./dev.db");
console.log("- Third-Party API Keys: NONE (100% key-free and AI-free)");
