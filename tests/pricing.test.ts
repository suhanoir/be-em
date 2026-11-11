import { describe, it, expect } from "vitest";
import { calculatePriceBreakdown, calculateDistanceSurcharge } from "../lib/pricing";

describe("Pricing, Discount & Loyalty Points Engine", () => {
  it("calculates distance surcharge accurately across tiers", () => {
    expect(calculateDistanceSurcharge(0)).toBe(0);
    expect(calculateDistanceSurcharge(4)).toBe(500);   // Tier 1: <= 5 km
    expect(calculateDistanceSurcharge(12)).toBe(1200); // Tier 2: <= 15 km
    expect(calculateDistanceSurcharge(25)).toBe(2500); // Tier 3: <= 30 km
    expect(calculateDistanceSurcharge(45)).toBe(4500); // Tier 4: <= 50 km
    expect(calculateDistanceSurcharge(55)).toBe(5000); // > 50km: 4500 + (5 * 100)
  });

  it("applies percentage promo code with max discount cap", () => {
    const res = calculatePriceBreakdown({
      baseAmount: 3000,
      promoCode: {
        code: "WELCOME10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 1000,
        maxDiscount: 200,
      },
    });

    // 10% of 3000 = 300, capped at maxDiscount 200
    expect(res.promoDiscount).toBe(200);
    expect(res.finalTotal).toBe(2800);
    expect(res.pointsEarned).toBe(280); // 10% back in points
  });

  it("applies fixed promo discount when min order value is satisfied", () => {
    const res = calculatePriceBreakdown({
      baseAmount: 4000,
      promoCode: {
        code: "DIWALI500",
        discountType: "FIXED",
        discountValue: 500,
        minOrderValue: 2000,
      },
    });

    expect(res.promoDiscount).toBe(500);
    expect(res.finalTotal).toBe(3500);
  });

  it("applies membership discount (e.g. 20%)", () => {
    const res = calculatePriceBreakdown({
      baseAmount: 5000,
      membershipDiscountPercent: 20,
    });

    expect(res.membershipDiscount).toBe(1000);
    expect(res.finalTotal).toBe(4000);
  });

  it("applies 10% entourage discount for groups of 3 or more", () => {
    const res = calculatePriceBreakdown({
      baseAmount: 10000,
      groupSize: 4,
    });

    expect(res.groupDiscount).toBe(1000);
    expect(res.finalTotal).toBe(9000);
  });

  it("enforces loyalty points redemption cap (maximum 20% of cart total)", () => {
    const res = calculatePriceBreakdown({
      baseAmount: 2000,
      loyaltyPointsToRedeem: 1000, // User wants to redeem 1000 points
    });

    // 20% of 2000 is 400 INR (400 points)
    expect(res.pointsRedeemed).toBe(400);
    expect(res.pointsDiscount).toBe(400);
    expect(res.finalTotal).toBe(1600);
  });
});
