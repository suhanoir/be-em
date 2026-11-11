import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// 5MB limit
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Validates image magic bytes to prevent malicious file uploads
 */
function validateImageMagicBytes(buffer: Buffer): { valid: boolean; ext: string } {
  if (buffer.length < 12) return { valid: false, ext: "" };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: ".jpg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, ext: ".png" };
  }

  // WebP: 'RIFF'....'WEBP'
  const isRiff = buffer.toString("ascii", 0, 4) === "RIFF";
  const isWebp = buffer.toString("ascii", 8, 12) === "WEBP";
  if (isRiff && isWebp) {
    return { valid: true, ext: ".webp" };
  }

  return { valid: false, ext: "" };
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    // Rate limit: 20 uploads per 10 minutes per IP
    const rateCheck = await checkRateLimit(`ip:${ip}:upload`, 20, 600);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Upload rate limit reached. Please wait a few moments." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5MB size limit" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate magic bytes
    const { valid, ext } = validateImageMagicBytes(buffer);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP images are permitted." },
        { status: 400 }
      );
    }

    // Save to public/uploads directory
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const randomName = `${Date.now()}_${crypto.randomBytes(12).toString("hex")}${ext}`;
    const filePath = path.join(uploadsDir, randomName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${randomName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      size: buffer.length,
    });
  } catch (error: any) {
    console.error("Local file upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file locally", message: error.message },
      { status: 500 }
    );
  }
}
