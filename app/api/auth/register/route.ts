import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validators";
import { checkRateLimit, getClientIp, validateAntiBot } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateCheck = await checkRateLimit(`ip:${ip}:register`, 5, 300);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please wait." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid registration data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, password, referralCode, hp_website, formTimestamp } = result.data;

    const botCheck = validateAntiBot({ hp_website, formTimestamp, minDurationSeconds: 1.5 });
    if (botCheck.isBot) {
      return NextResponse.json({ error: "Registration security check failed." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check existing email
    const existingEmail = await db.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Check existing phone
    const existingPhone = await db.user.findFirst({
      where: { phone },
    });
    if (existingPhone) {
      return NextResponse.json(
        { error: "An account with this phone number already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Check referral
    let referrerId: string | null = null;
    let welcomeBonusPoints = 100; // standard 100 points on signup

    if (referralCode) {
      const referrer = await db.user.findUnique({
        where: { referralCode },
      });
      if (referrer) {
        referrerId = referrer.id;
        welcomeBonusPoints += 150; // extra 150 points for using a referral code (250 total)
      }
    }

    // Create user and profile
    const user = await db.user.create({
      data: {
        name,
        email: cleanEmail,
        phone,
        passwordHash,
        role: "CUSTOMER",
        loyaltyPoints: welcomeBonusPoints,
        referredById: referrerId,
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        loyaltyPoints: true,
      },
    });

    // Record welcome loyalty transaction
    await db.loyaltyTransaction.create({
      data: {
        userId: user.id,
        points: welcomeBonusPoints,
        type: "BONUS",
        description: referrerId
          ? "Welcome Bonus & Referral Reward"
          : "Welcome Loyalty Sign-Up Bonus",
        balanceAfter: welcomeBonusPoints,
      },
    });

    // If referred, reward the referrer
    if (referrerId) {
      await db.user.update({
        where: { id: referrerId },
        data: { loyaltyPoints: { increment: 200 } },
      });
      await db.loyaltyTransaction.create({
        data: {
          userId: referrerId,
          points: 200,
          type: "BONUS",
          description: `Referral Reward for welcoming ${name}`,
          balanceAfter: 200,
        },
      });
    }

    return NextResponse.json(
      {
        message: "Account created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account", message: error.message },
      { status: 500 }
    );
  }
}
