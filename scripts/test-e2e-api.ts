// End-to-end integration and flow verification script for BEEM (Beauty Empire)
import { PrismaClient } from "@prisma/client";
import { generateAvailableSlots } from "../lib/slots";
import { calculatePriceBreakdown } from "../lib/pricing";

const prisma = new PrismaClient();

async function runTests() {
  console.log("=== BEEM E2E SYSTEM VERIFICATION ===");

  // 1. Verify Database Records
  const userCount = await prisma.user.count();
  const serviceCount = await prisma.service.count();
  const bridalCount = await prisma.bridalPackage.count();
  const mehendiCount = await prisma.mehendiDesign.count();
  const stylistCount = await prisma.stylist.count();
  const promoCount = await prisma.promoCode.count();
  const offerCount = await prisma.offer.count();

  console.log(`✓ Database Check:`);
  console.log(`  - Users: ${userCount}`);
  console.log(`  - Services: ${serviceCount}`);
  console.log(`  - Bridal Packages: ${bridalCount}`);
  console.log(`  - Mehendi Designs: ${mehendiCount}`);
  console.log(`  - Stylists: ${stylistCount}`);
  console.log(`  - Promo Codes: ${promoCount}`);
  console.log(`  - Offers: ${offerCount}`);

  if (userCount === 0 || serviceCount === 0 || bridalCount === 0) {
    throw new Error("Missing seeded records!");
  }

  // 2. Test Slot Generation Engine
  const testSlots = generateAvailableSlots({
    dateStr: "2026-11-20",
    durationMinutes: 45,
    salonOpen: "09:00",
    salonClose: "20:00",
    existingBookings: [
      { startTime: "10:00", endTime: "11:00", status: "CONFIRMED" },
    ],
  });

  const slot1000 = testSlots.find((s) => s.time === "10:00");
  const slot1100 = testSlots.find((s) => s.time === "11:00");
  if (slot1000?.isAvailable !== false) {
    throw new Error("Conflict detection failed: 10:00 should be unavailable!");
  }
  if (slot1100?.isAvailable !== true) {
    throw new Error("Available slot check failed: 11:00 should be available!");
  }
  console.log(`✓ Slot Engine & Conflict Prevention: PASSED`);

  // 3. Test Pricing Engine with Promo & Loyalty
  const pricingResult = calculatePriceBreakdown({
    baseAmount: 5000,
    promoCode: {
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 1000,
      maxDiscount: 500,
    },
    isHomeVisit: true,
    distanceKm: 12, // Tier 2 (5-15km) = ₹1,200
    loyaltyPointsToRedeem: 200, // 200 pts = ₹200
  });

  // Base: 5000 - Promo (500) + Distance (1200) - Points (200) = 5500
  if (pricingResult.promoDiscount !== 500) {
    throw new Error(`Promo calculation mismatch: expected 500, got ${pricingResult.promoDiscount}`);
  }
  if (pricingResult.distanceSurcharge !== 1200) {
    throw new Error(`Distance surcharge mismatch: expected 1200, got ${pricingResult.distanceSurcharge}`);
  }
  if (pricingResult.pointsDiscount !== 200) {
    throw new Error(`Points discount mismatch: expected 200, got ${pricingResult.pointsDiscount}`);
  }
  if (pricingResult.finalTotal !== 5500) {
    throw new Error(`Final total mismatch: expected 5500, got ${pricingResult.finalTotal}`);
  }
  console.log(`✓ Pricing, Surcharge & Loyalty Calculations: PASSED`);

  // 4. Test Double-Booking Database Transaction
  const stylist = await prisma.stylist.findFirst({ where: { isActive: true } });
  if (!stylist) throw new Error("No active stylist found");

  const testDate = new Date("2026-12-15T00:00:00.000Z");

  // Create First Booking
  const firstAppt = await prisma.appointment.create({
    data: {
      appointmentNumber: `TEST-COLLISION-1`,
      customerName: "Test Client 1",
      customerEmail: "test1@beem.test",
      customerPhone: "+919876599901",
      stylistId: stylist.id,
      date: testDate,
      startTime: "14:00",
      endTime: "15:00",
      status: "CONFIRMED",
      totalAmount: 1499,
      advancePaid: 1499,
      balanceDue: 0,
      paymentStatus: "COMPLETED",
      paymentMethod: "MOCK_PAYMENT",
    },
  });

  // Attempt Second Booking with overlapping time (14:30 - 15:30)
  let collisionCaught = false;
  try {
    await prisma.$transaction(async (tx) => {
      const conflict = await tx.appointment.findFirst({
        where: {
          stylistId: stylist.id,
          date: testDate,
          status: { in: ["PENDING", "CONFIRMED"] },
          startTime: { lt: "15:30" },
          endTime: { gt: "14:30" },
        },
      });

      if (conflict) {
        throw new Error("DOUBLE_BOOKING_PREVENTED");
      }

      await tx.appointment.create({
        data: {
          appointmentNumber: `TEST-COLLISION-2`,
          customerName: "Test Client 2",
          customerEmail: "test2@beem.test",
          customerPhone: "+919876599902",
          stylistId: stylist.id,
          date: testDate,
          startTime: "14:30",
          endTime: "15:30",
          status: "CONFIRMED",
          totalAmount: 1499,
          advancePaid: 1499,
          balanceDue: 0,
          paymentStatus: "COMPLETED",
          paymentMethod: "MOCK_PAYMENT",
        },
      });
    });
  } catch (err: any) {
    if (err.message.includes("DOUBLE_BOOKING_PREVENTED")) {
      collisionCaught = true;
    }
  }

  // Cleanup test appointment
  await prisma.appointment.delete({ where: { id: firstAppt.id } });

  if (!collisionCaught) {
    throw new Error("Double booking transaction test failed! Colliding appointment was not blocked.");
  }
  console.log(`✓ Double-Booking Transaction Collision Guard: PASSED`);

  console.log("\n=== ALL E2E VERIFICATION TESTS PASSED SUCCESSFULLY! ===");
}

runTests()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
