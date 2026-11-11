import { db } from "@/lib/db";

/**
 * SQLite-backed sliding-window rate limiter
 * Eliminates Redis / Upstash dependency while providing reliable rate-limiting.
 */
export async function checkRateLimit(
  key: string,
  limit: number = 10,
  windowSeconds: number = 60
): Promise<{ success: boolean; remaining: number; resetAt: Date }> {
  const now = new Date();

  // Periodically clean up expired keys (fire-and-forget, with error catching)
  try {
    // 5% chance per request to run cleanup to keep SQLite light
    if (Math.random() < 0.05) {
      db.rateLimit.deleteMany({
        where: { expiresAt: { lt: now } },
      }).catch(() => {});
    }

    const record = await db.rateLimit.findUnique({
      where: { key },
    });

    if (record) {
      if (record.expiresAt < now) {
        // Expired window: reset
        const resetAt = new Date(Date.now() + windowSeconds * 1000);
        await db.rateLimit.update({
          where: { key },
          data: {
            points: 1,
            expiresAt: resetAt,
          },
        });
        return { success: true, remaining: limit - 1, resetAt };
      }

      if (record.points >= limit) {
        // Rate limit exceeded
        return { success: false, remaining: 0, resetAt: record.expiresAt };
      }

      // Increment points within current window
      const updated = await db.rateLimit.update({
        where: { key },
        data: { points: { increment: 1 } },
      });

      return {
        success: true,
        remaining: Math.max(0, limit - updated.points),
        resetAt: record.expiresAt,
      };
    }

    // New rate limit window
    const resetAt = new Date(Date.now() + windowSeconds * 1000);
    await db.rateLimit.create({
      data: {
        key,
        points: 1,
        expiresAt: resetAt,
      },
    });

    return { success: true, remaining: limit - 1, resetAt };
  } catch (err) {
    // If DB has temporary issue, fail open to avoid blocking legitimate users
    console.error("Rate limiter check error:", err);
    return { success: true, remaining: limit - 1, resetAt: new Date(Date.now() + windowSeconds * 1000) };
  }
}

/**
 * Extracts client IP from standard Next.js request headers
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Anti-Bot / Anti-Spam validator
 * Checks honeypot field (hp_website) and form fill duration
 */
export function validateAntiBot(params: {
  hp_website?: string | null;
  formTimestamp?: number | null;
  minDurationSeconds?: number;
}): { isBot: boolean; reason?: string } {
  const { hp_website, formTimestamp, minDurationSeconds = 1.5 } = params;

  // 1. Honeypot check: Bots fill hidden fields
  if (hp_website && hp_website.trim().length > 0) {
    return { isBot: true, reason: "Honeypot field detected" };
  }

  // 2. Minimum form submission duration check: Submitting under 1.5 seconds is superhuman
  if (formTimestamp && typeof formTimestamp === "number") {
    const elapsedSeconds = (Date.now() - formTimestamp) / 1000;
    if (elapsedSeconds > 0 && elapsedSeconds < minDurationSeconds) {
      return { isBot: true, reason: "Form submitted too quickly for human user" };
    }
  }

  return { isBot: false };
}
