import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid registration data", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, password, referralCode } = result.data;
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
          type: "REFERRAL",
          description: `Referral Reward for inviting ${user.name}`,
          balanceAfter: 0, // will reflect in total
        },
      });
    }

    return NextResponse.json(
      { message: "Account created successfully", user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration", message: error.message },
      { status: 500 }
    );
  }
}
