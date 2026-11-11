// Pricing, Discounts, Distance Surcharges & Loyalty Calculation Engine

export interface PriceBreakdownInput {
  baseAmount: number;
  promoCode?: {
    code: string;
    discountType: string; // "PERCENTAGE" | "FIXED"
    discountValue: number;
    minOrderValue?: number;
    maxDiscount?: number | null;
  } | null;
  membershipDiscountPercent?: number; // e.g. 15 or 25
  isHomeVisit?: boolean;
  distanceKm?: number;
  groupSize?: number; // for multi-person bridal/group
  loyaltyPointsToRedeem?: number; // 1 point = ₹1
  isBridal?: boolean;
  bridalDepositRequired?: number; // fixed deposit if bridal package
}

export interface DistanceTier {
  maxKm: number;
  price: number;
  label: string;
}

export const DEFAULT_DISTANCE_TIERS: DistanceTier[] = [
  { maxKm: 5, price: 500, label: "Within 5 km" },
  { maxKm: 15, price: 1200, label: "5 - 15 km" },
  { maxKm: 30, price: 2500, label: "15 - 30 km" },
  { maxKm: 50, price: 4500, label: "30 - 50 km" },
];

export function calculateDistanceSurcharge(distanceKm: number, tiers = DEFAULT_DISTANCE_TIERS): number {
  if (distanceKm <= 0) return 0;
  for (const tier of tiers) {
    if (distanceKm <= tier.maxKm) {
      return tier.price;
    }
  }
  // Exceeding 50 km: last tier + ₹100/km beyond
  const maxTier = tiers[tiers.length - 1];
  const extraKm = Math.ceil(distanceKm - maxTier.maxKm);
  return maxTier.price + extraKm * 100;
}

export function calculatePriceBreakdown(input: PriceBreakdownInput) {
  const {
    baseAmount,
    promoCode,
    membershipDiscountPercent = 0,
    isHomeVisit = false,
    distanceKm = 0,
    groupSize = 1,
    loyaltyPointsToRedeem = 0,
    isBridal = false,
    bridalDepositRequired,
  } = input;

  let currentSubtotal = baseAmount;

  // 1. Group Entourage Discount (e.g. 10% off base if groupSize >= 3)
  let groupDiscount = 0;
  if (groupSize >= 3) {
    groupDiscount = Math.round(baseAmount * 0.1);
  }

  // 2. Membership Discount (applied to base amount)
  let membershipDiscount = 0;
  if (membershipDiscountPercent > 0) {
    membershipDiscount = Math.round((baseAmount - groupDiscount) * (membershipDiscountPercent / 100));
  }

  // 3. Promo Code Discount
  let promoDiscount = 0;
  if (promoCode) {
    const minOrder = promoCode.minOrderValue ?? 0;
    if (baseAmount >= minOrder) {
      if (promoCode.discountType === "PERCENTAGE") {
        let calc = (baseAmount * promoCode.discountValue) / 100;
        if (promoCode.maxDiscount && calc > promoCode.maxDiscount) {
          calc = promoCode.maxDiscount;
        }
        promoDiscount = Math.round(calc);
      } else {
        // FIXED
        promoDiscount = Math.min(promoCode.discountValue, baseAmount);
      }
    }
  }

  const totalDiscount = Math.min(baseAmount, groupDiscount + membershipDiscount + promoDiscount);

  // 4. Distance Surcharge for Venue/Home visits
  const distanceSurcharge = isHomeVisit ? calculateDistanceSurcharge(distanceKm) : 0;

  // 5. Loyalty Points Redemption (max 20% of net or available points, ₹1 per point)
  const netBeforePoints = Math.max(0, baseAmount - totalDiscount + distanceSurcharge);
  const maxPointsAllowed = Math.floor(netBeforePoints * 0.2); // max 20% payable via points
  const pointsRedeemed = Math.min(loyaltyPointsToRedeem, maxPointsAllowed);
  const pointsDiscount = pointsRedeemed; // 1 point = 1 INR

  // Final Total
  const finalTotal = Math.max(0, netBeforePoints - pointsDiscount);

  // GST 18% inclusive breakdown (standard salon tax display)
  const preTaxSubtotal = Math.round((finalTotal / 1.18) * 100) / 100;
  const gstAmount = Math.round((finalTotal - preTaxSubtotal) * 100) / 100;

  // Advance Deposit Calculation
  let depositAmount = 0;
  if (isBridal && bridalDepositRequired && bridalDepositRequired > 0) {
    depositAmount = Math.min(finalTotal, bridalDepositRequired);
  } else {
    // Standard 25% deposit if customer chooses deposit option
    depositAmount = Math.round(finalTotal * 0.25);
  }

  const balanceDue = Math.max(0, finalTotal - depositAmount);

  // Loyalty points earned on this booking: 10% of final spend (1 point per ₹10)
  const pointsEarned = Math.floor(finalTotal / 10);

  return {
    baseAmount,
    groupDiscount,
    membershipDiscount,
    promoDiscount,
    totalDiscount,
    distanceSurcharge,
    pointsRedeemed,
    pointsDiscount,
    finalTotal,
    preTaxSubtotal,
    gstAmount,
    depositAmount,
    balanceDue,
    pointsEarned,
  };
}
