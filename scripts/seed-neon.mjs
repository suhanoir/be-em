import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Use DIRECT_URL for fastest, reliable seeding without pooler limits
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log("Seeding Neon PostgreSQL database directly...");

  // 1. Passwords & Users
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
  const customerPasswordHash = await bcrypt.hash("Customer@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@beem.test" },
    update: { passwordHash: adminPasswordHash, role: "ADMIN" },
    create: {
      name: "Suhani Mehta (Admin)",
      email: "admin@beem.test",
      phone: "+919876500001",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      referralCode: "BEEMADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@beem.test" },
    update: { passwordHash: customerPasswordHash, role: "CUSTOMER" },
    create: {
      name: "Ananya Roy",
      email: "customer@beem.test",
      phone: "+919876500002",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      loyaltyPoints: 350,
      referralCode: "ANANYA25",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    },
  });

  console.log("Users verified:", admin.email, customer.email);

  // 2. Mehendi Designs
  const mehendiDesigns = [
    {
      title: "Royal Peacock Bridal Full-Hand",
      slug: "royal-peacock-bridal",
      style: "Bridal Full-hand",
      complexity: "Bridal Luxury",
      estimatedTime: "180 mins",
      price: 6500,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
      tags: "Bridal, Peacock, Intricate, Traditional",
      isFeatured: true,
    },
    {
      title: "Negative Space Arabic Floral Mandala",
      slug: "arabic-floral-mandala",
      style: "Arabic",
      complexity: "Medium",
      estimatedTime: "60 mins",
      price: 1800,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
      tags: "Arabic, Floral, Contemporary, Fast",
      isFeatured: true,
    },
    {
      title: "Minimalist Finger & Wrist Vine Lace",
      slug: "minimalist-wrist-lace",
      style: "Minimal",
      complexity: "Simple",
      estimatedTime: "30 mins",
      price: 999,
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
      tags: "Minimal, Modern, Office-Friendly",
      isFeatured: false,
    },
    {
      title: "Intricate Rajasthani Doli & Jharokha",
      slug: "rajasthani-doli-jharokha",
      style: "Rajasthani",
      complexity: "Intricate",
      estimatedTime: "120 mins",
      price: 3500,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
      tags: "Rajasthani, Heritage, Doli, Jali",
      isFeatured: true,
    },
  ];

  for (const m of mehendiDesigns) {
    await prisma.mehendiDesign.upsert({
      where: { slug: m.slug },
      update: m,
      create: m,
    });
  }
  console.log("Mehendi designs seeded successfully!");

  // 3. Membership Plans
  const membershipPlans = [
    {
      name: "BEEM Privilege Silver",
      slug: "beem-privilege-silver",
      period: "MONTHLY",
      price: 1999,
      discountPercent: 15.0,
      perks: JSON.stringify(["15% off all salon services", "1 complimentary express hair spa/month", "Priority weekend booking"]),
      description: "Ideal for frequent styling, maintenance trims, and monthly self-care rituals.",
    },
    {
      name: "BEEM Empress Royal Circle",
      slug: "beem-empress-royal-circle",
      period: "YEARLY",
      price: 15999,
      discountPercent: 25.0,
      perks: JSON.stringify(["25% off all services & bridal add-ons", "Quarterly HydraGlow facial", "Free doorstep styling within 10 km", "Dedicated personal stylist"]),
      description: "Our signature VIP membership with maximum rewards, complimentary luxury treatments, and concierge booking.",
    },
  ];

  for (const mp of membershipPlans) {
    await prisma.membershipPlan.upsert({
      where: { slug: mp.slug },
      update: mp,
      create: mp,
    });
  }
  console.log("Membership plans seeded successfully!");

  // 4. Offers
  const offersData = [
    {
      title: "Bridal Season Splendor: 15% Off All Bridal Tiers",
      discountText: "15% OFF",
      description: "Book any Bridal Couture package 30 days in advance and receive 15% off plus a complimentary pre-wedding trial.",
      validUntil: new Date("2028-12-31"),
      isFestival: true,
      festivalName: "Wedding Season",
      isActive: true,
    },
    {
      title: "Midweek Pamper Ritual: Hair Spa + Express Gel Nails",
      discountText: "Flat ₹500 OFF",
      description: "Unwind Tuesday through Thursday with our hair alchemy ritual and high-gloss gel nails combo.",
      validUntil: new Date("2028-12-31"),
      isFestival: false,
      isActive: true,
    },
  ];

  for (const off of offersData) {
    const existing = await prisma.offer.findFirst({ where: { title: off.title } });
    if (!existing) {
      await prisma.offer.create({ data: off });
    }
  }
  console.log("Offers seeded successfully!");

  console.log("Neon database seeding completely finished!");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
