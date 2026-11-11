import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 });
    }

    const promo = await db.promoCode.findUnique({
      where: { code: code.toUpperCase().trim() },
    });

    if (!promo || !promo.isActive) {
      return NextResponse.json({ error: "Invalid or inactive promo code" }, { status: 404 });
    }

    const now = new Date();
    if (promo.validUntil < now) {
      return NextResponse.json({ error: "This promo code has expired" }, { status: 400 });
    }

    if (promo.usageLimit && promo.timesUsed >= promo.usageLimit) {
      return NextResponse.json({ error: "This promo code has reached its usage limit" }, { status: 400 });
    }

    const total = Number(cartTotal) || 0;
    if (total < promo.minOrderValue) {
      return NextResponse.json(
        {
          error: `Minimum order value of ₹${promo.minOrderValue} required for this coupon`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (promo.discountType === "PERCENTAGE") {
      let calc = (total * promo.discountValue) / 100;
      if (promo.maxDiscount && calc > promo.maxDiscount) {
        calc = promo.maxDiscount;
      }
      discountAmount = Math.round(calc);
    } else {
      // FIXED
      discountAmount = Math.min(promo.discountValue, total);
    }

    return NextResponse.json({
      valid: true,
      code: promo.code,
      description: promo.description,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      discountAmount,
      newTotal: Math.max(0, total - discountAmount),
    });
  } catch (error: any) {
    console.error("Promo validation error:", error);
    return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 });
  }
}
