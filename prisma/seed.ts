import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BEEM (Beauty Empire) key-free & AI-free database...");

  // 1. Password Hashes
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
  const customerPasswordHash = await bcrypt.hash("Customer@123", 10);

  // 2. Users
  const admin = await prisma.user.upsert({
    where: { email: "admin@beem.test" },
    update: {
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
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
    update: {
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
    },
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

  // Customer Profile (Beauty Profile)
  await prisma.customerProfile.upsert({
    where: { userId: customer.id },
    update: {},
    create: {
      userId: customer.id,
      allergies: "Slight sensitivity to ammonia-based hair colors; prefers organic/ammonia-free.",
      skinType: "Combination",
      hairType: "Wavy",
      hairConcerns: "Frizz, Mild dryness",
      preferences: "Warm herbal tea, quiet appointments, soft rose blush tones",
      birthdayDate: new Date("1996-08-15"),
      anniversaryDate: new Date("2022-12-04"),
      notes: "Likes soft natural blush and sculpted brow shaping.",
    },
  });

  // 3. Stylists
  const stylistsData = [
    {
      name: "Ananya Sharma",
      roleTitle: "Creative Director & Bridal Lead",
      slug: "ananya-sharma",
      bio: "Trained in London and Mumbai, Ananya has styled over 400 brides across South India with a focus on luminous, skin-like radiance.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
      specialties: JSON.stringify(["High-Definition Bridal", "Airbrush Couture", "Sabyasachi-Style Draping"]),
      experienceYears: 10,
      rating: 4.95,
      reviewCount: 142,
      commissionRate: 0.2,
    },
    {
      name: "Priya Nair",
      roleTitle: "Senior Hair Alchemist",
      slug: "priya-nair",
      bio: "Master of dimensional color and effortless cuts. Priya believes great hair looks just as good waking up as it does walking out of the salon.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
      specialties: JSON.stringify(["French Balayage", "Textured Bobs", "Hair Botoplex"]),
      experienceYears: 8,
      rating: 4.9,
      reviewCount: 189,
      commissionRate: 0.22,
    },
    {
      name: "Meera Rao",
      roleTitle: "Master Henna Artist",
      slug: "meera-rao",
      bio: "Third-generation henna artist who concocts her own 100% natural eucalyptus-infused henna pastes for guaranteed dark stains.",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
      specialties: JSON.stringify(["Fine-Line Rajasthani", "Contemporary Indo-Arabic", "Organic Sojat Henna"]),
      experienceYears: 12,
      rating: 5.0,
      reviewCount: 118,
      commissionRate: 0.18,
    },
    {
      name: "Kavita Patel",
      roleTitle: "Lead Clinical Aesthetician",
      slug: "kavita-patel",
      bio: "Certified clinical aesthetician passionate about barrier repair and tailored non-invasive facial therapies for all Indian skin types.",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80",
      specialties: JSON.stringify(["Korean Glass-Skin", "HydraGlow", "Lymphatic Drainage"]),
      experienceYears: 7,
      rating: 4.88,
      reviewCount: 94,
      commissionRate: 0.15,
    },
  ];

  for (const st of stylistsData) {
    const s = await prisma.stylist.upsert({
      where: { slug: st.slug },
      update: st,
      create: st,
    });

    // Create 7-day schedule (Mon-Sun 09:00 to 19:00, Tuesday off for some)
    for (let day = 0; day <= 6; day++) {
      const isDayOff = (st.name === "Meera Rao" && day === 1) || (st.name === "Kavita Patel" && day === 2);
      await prisma.stylistSchedule.upsert({
        where: {
          stylistId_dayOfWeek: {
            stylistId: s.id,
            dayOfWeek: day,
          },
        },
        update: {
          startTime: "09:00",
          endTime: "19:00",
          isWorking: !isDayOff,
        },
        create: {
          stylistId: s.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "19:00",
          isWorking: !isDayOff,
        },
      });
    }
  }

  // 4. Categories & Services
  const categories = [
    { name: "Haircut & Styling", slug: "haircut-and-styling", icon: "Scissors", sortOrder: 1 },
    { name: "Hair Color & Balayage", slug: "hair-color", icon: "Palette", sortOrder: 2 },
    { name: "Bridal Couture", slug: "bridal-makeup", icon: "Crown", sortOrder: 3 },
    { name: "Organic Henna", slug: "mehendi", icon: "Feather", sortOrder: 4 },
    { name: "Facial & Skin", slug: "facial-and-skin", icon: "Sparkles", sortOrder: 5 },
    { name: "Russian Gel Nails", slug: "nails", icon: "Hand", sortOrder: 6 },
    { name: "Comfort Waxing", slug: "waxing", icon: "Flame", sortOrder: 7 },
    { name: "Hair Spa & Wellness", slug: "spa-wellness", icon: "HeartPulse", sortOrder: 8 },
  ];

  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  const haircutCat = await prisma.serviceCategory.findUnique({ where: { slug: "haircut-and-styling" } });
  const colorCat = await prisma.serviceCategory.findUnique({ where: { slug: "hair-color" } });
  const facialCat = await prisma.serviceCategory.findUnique({ where: { slug: "facial-and-skin" } });
  const hennaCat = await prisma.serviceCategory.findUnique({ where: { slug: "mehendi" } });
  const nailsCat = await prisma.serviceCategory.findUnique({ where: { slug: "nails" } });

  const services = [
    {
      categoryId: haircutCat!.id,
      name: "Signature Precision Haircut & Blowout",
      slug: "signature-precision-haircut",
      description: "Face-framing layers, split-end removal, and high-volume bouncy blowout tailored to your natural bone structure.",
      durationMinutes: 45,
      price: 1200,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&q=80",
    },
    {
      categoryId: colorCat!.id,
      name: "French Sunkissed Balayage & Gloss",
      slug: "french-sunkissed-balayage",
      description: "Ammonia-free hand-painted dimensional highlights with botanical gloss tone and bond-repair treatment.",
      durationMinutes: 150,
      price: 5500,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
    },
    {
      categoryId: facialCat!.id,
      name: "HydraGlow Diamond Dermabrasion",
      slug: "hydraglow-diamond-facial",
      description: "Non-invasive vortex deep-pore extraction, peptide infusion, and chilled cryogenic sculpting for instant red-carpet glass skin.",
      durationMinutes: 60,
      price: 3200,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    },
    {
      categoryId: hennaCat!.id,
      name: "Royal Rajasthani Heritage Henna",
      slug: "royal-rajasthani-heritage-henna",
      description: "Traditional peacock, doli palanquin, and jali motifs drawn with organic eucalyptus-infused Sojat henna paste.",
      durationMinutes: 120,
      price: 2500,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
    },
    {
      categoryId: nailsCat!.id,
      name: "Russian E-File Gel Nails with Chrome Finish",
      slug: "russian-gel-nails-chrome",
      description: "Ultra-precise dry cuticle cleanup, reinforced rubber base gel, and mirror-finish glazed donut chrome overlay.",
      durationMinutes: 75,
      price: 2200,
      isPopular: false,
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // 5. Bridal Packages
  const bridalPackages = [
    {
      name: "Silver Elegance Bridal Package",
      slug: "silver-elegance-bridal",
      tier: "BASIC",
      tagline: "Intimate Ceremonies, Receptions & Sangeet",
      description: "Full HD waterproof bridal makeover, designer hair architecture, real floral setting, and dupatta placement.",
      price: 14999,
      advanceDeposit: 5000,
      durationHours: 3.5,
      inclusions: JSON.stringify([
        "Full HD Waterproof Makeup",
        "Designer Hair Architecture & Fresh Floral Setting",
        "Dupatta Draping & Jewelry Setting",
        "Premium Mink Lashes & Touch-Up Kit",
      ]),
      highlights: JSON.stringify(["Intimate weddings", "Zero flashback", "4h hold"]),
      isPopular: false,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
    },
    {
      name: "Gold Radiance Airbrush Package",
      slug: "gold-radiance-airbrush",
      tier: "PREMIUM",
      tagline: "Our Most Coveted Signature Bridal Ceremony",
      description: "Temptu Pro Airbrush artistry, pre-bridal gold facial, full makeup & hair trial, and on-venue availability.",
      price: 24999,
      advanceDeposit: 10000,
      durationHours: 5.0,
      inclusions: JSON.stringify([
        "Temptu Pro Airbrush Makeup",
        "Full Makeup & Hairstyle Trial Session",
        "Pre-Bridal 24K Gold Facial (3 days prior)",
        "Advanced Hair Architecture with Extensions",
        "On-Venue Availability in Bengaluru",
      ]),
      highlights: JSON.stringify(["Complete Trial Included", "Sweat-Proof 16h Base", "On-Venue Option"]),
      isPopular: true,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    },
    {
      name: "Imperial Maharani Royal Package",
      slug: "imperial-maharani-royal",
      tier: "ROYAL",
      tagline: "The Pinnacle 360-Degree Royal Bridal Experience",
      description: "Creative Director Ananya Sharma exclusive, 3-day pre-bridal luxury spa ritual, full bridal henna, and entourage care.",
      price: 39999,
      advanceDeposit: 15000,
      durationHours: 7.0,
      inclusions: JSON.stringify([
        "Creative Director Ananya Sharma Exclusive",
        "Ultra-HD Airbrush with 24-Hour Staying Power",
        "Full Pre-Bridal 3-Day Spa, Wax & Facial Ritual",
        "Full Bridal Henna & 2 Bridesmaids Mehendi",
        "Unlimited Draping Changes for Morning & Evening",
      ]),
      highlights: JSON.stringify(["Creative Director Solo", "Full Entourage Care", "Pre-Bridal 3-Day Spa"]),
      isPopular: false,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    },
  ];

  for (const pkg of bridalPackages) {
    await prisma.bridalPackage.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }

  // 6. Curated Looks (Replaces Virtual Try-On)
  const curatedLooks = [
    {
      title: "French Caramel Balayage",
      category: "Hair",
      imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
      description: "Seamless sun-kissed honey ribbons blended over rich espresso base.",
      stylistName: "Priya Nair",
      tags: "Balayage, Honey, Waves, Low-Maintenance",
      isTrending: true,
      serviceSlug: "french-sunkissed-balayage",
    },
    {
      title: "Royal Muhurtham Bridal Radiance",
      category: "Bridal",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
      description: "Regal airbrush complexion with temple jewelry setting and fragrant jasmine blooms.",
      stylistName: "Ananya Sharma",
      tags: "Bridal, Airbrush, Traditional, South Indian",
      isTrending: true,
      serviceSlug: "gold-radiance-airbrush",
    },
    {
      title: "Intricate Arabic Henna Cuffs",
      category: "Mehendi",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
      description: "Negative space botanical strokes with delicate shaded fingertips.",
      stylistName: "Meera Rao",
      tags: "Arabic, Modern, Cuffs, Dark Stain",
      isTrending: true,
      serviceSlug: "royal-rajasthani-heritage-henna",
    },
    {
      title: "Dewy Korean Glass-Skin",
      category: "Skin",
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
      description: "Hydra-dermabrasion with peptide glow infusion for radiant bare skin.",
      stylistName: "Kavita Patel",
      tags: "Glass-Skin, HydraGlow, Barrier Repair",
      isTrending: true,
      serviceSlug: "hydraglow-diamond-facial",
    },
  ];

  for (const look of curatedLooks) {
    const existing = await prisma.curatedLook.findFirst({ where: { title: look.title } });
    if (!existing) {
      await prisma.curatedLook.create({ data: look });
    }
  }

  // 7. Static FAQ Items (for Key-Free Help Assistant & FAQ page)
  const faqItems = [
    {
      question: "How do I book an appointment?",
      answer: "Select your preferred service, choose an available stylist (or 'Any Available'), select a convenient time slot, and confirm. The entire booking takes under 60 seconds.",
      category: "booking",
      sortOrder: 1,
    },
    {
      question: "What payment methods do you support?",
      answer: "We support 'Pay at Salon' (cash or card at our front desk) as well as direct UPI payment (GPay, PhonePe, Paytm, BHIM). For UPI, transfer to our salon UPI ID, enter the 12-digit UTR number, and our reception confirms it.",
      category: "payments",
      sortOrder: 2,
    },
    {
      question: "How does the bridal wedding date hold work?",
      answer: "Bridal dates are tentatively held for 24 hours after booking. Once your advance deposit is submitted via UPI or at the salon and confirmed by our team, your wedding date is 100% locked exclusively.",
      category: "bridal",
      sortOrder: 3,
    },
    {
      question: "What is your appointment cancellation policy?",
      answer: "You can reschedule or cancel any regular salon appointment up to 4 hours before your slot with zero fees. Bridal advance deposits are refundable up to 7 days prior to the wedding date.",
      category: "booking",
      sortOrder: 4,
    },
    {
      question: "Are your mehendi cones chemical-free?",
      answer: "Yes, our master artist Meera hand-mixes our henna paste fresh every week using certified 100% organic Sojat henna leaves, Nilgiri eucalyptus oil, and lemon juice. We never use synthetic dyes or black PPD.",
      category: "hygiene",
      sortOrder: 5,
    },
    {
      question: "Where are you located and what are your opening hours?",
      answer: "We are located at 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038. We are open Monday through Sunday from 9:00 AM to 9:00 PM with complimentary valet parking.",
      category: "general",
      sortOrder: 6,
    },
  ];

  for (const faq of faqItems) {
    const existing = await prisma.faqItem.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faqItem.create({ data: faq });
    }
  }

  // 8. Promo Codes
  const promoCodes = [
    { code: "ROYALWELCOME", description: "First visit welcome credit", discountType: "FIXED", discountValue: 500, minOrderValue: 1500, validUntil: new Date("2028-12-31") },
    { code: "BRIDALGLOW", description: "Advance bridal package discount", discountType: "PERCENTAGE", discountValue: 15, minOrderValue: 10000, maxDiscount: 3500, validUntil: new Date("2028-12-31") },
    { code: "HENNALOVE", description: "Special celebration henna discount", discountType: "PERCENTAGE", discountValue: 20, minOrderValue: 2000, maxDiscount: 1000, validUntil: new Date("2028-12-31") },
  ];

  for (const pc of promoCodes) {
    await prisma.promoCode.upsert({
      where: { code: pc.code },
      update: pc,
      create: pc,
    });
  }

  // 9. Default Settings
  const defaultSettings = [
    { key: "salon_name", value: "BEEM (Beauty Empire)", description: "Salon brand name" },
    { key: "salon_phone", value: "+919876543210", description: "Primary salon contact number" },
    { key: "salon_whatsapp", value: "919876543210", description: "WhatsApp click-to-chat business number" },
    { key: "salon_email", value: "contact@beem.luxury", description: "Salon official email" },
    { key: "salon_address", value: "Shop 12-14, Luxury Promenade, 100 Feet Road, Indiranagar, Bengaluru 560038", description: "Physical address" },
    { key: "salon_upi_id", value: "beem.luxury@upi", description: "Salon primary UPI ID for customer transfers" },
    { key: "salon_upi_name", value: "BEEM Beauty Empire", description: "Salon account name for UPI" },
    { key: "working_hours_open", value: "09:00", description: "Salon opening time" },
    { key: "working_hours_close", value: "21:00", description: "Salon closing time" },
    { key: "deposit_percentage", value: "25", description: "Standard booking deposit percentage" },
    { key: "bridal_deposit_percentage", value: "40", description: "Bridal date hold advance percentage" },
    { key: "cancellation_window_hours", value: "4", description: "Minimum hours before slot to cancel/reschedule without penalty" },
    {
      key: "distance_tier_pricing",
      value: JSON.stringify([
        { maxKm: 5, price: 500, label: "Up to 5 km" },
        { maxKm: 15, price: 1200, label: "5 - 15 km" },
        { maxKm: 30, price: 2500, label: "15 - 30 km" },
        { maxKm: 50, price: 4500, label: "30 - 50 km" },
      ]),
      description: "Home and venue visit surcharge tiers in INR",
    },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }

  // 10. Sample Appointment with Manual UPI Verification
  const sampleAppointment = await prisma.appointment.upsert({
    where: { appointmentNumber: "BEEM-2026-0001" },
    update: {},
    create: {
      appointmentNumber: "BEEM-2026-0001",
      userId: customer.id,
      customerName: "Ananya Roy",
      customerPhone: "+919876500002",
      customerEmail: "customer@beem.test",
      date: new Date("2026-11-15T00:00:00.000Z"),
      startTime: "10:00",
      endTime: "10:45",
      status: "CONFIRMED",
      totalAmount: 1200,
      discountAmount: 0,
      advancePaid: 1200,
      balanceDue: 0,
      paymentStatus: "COMPLETED",
      paymentMethod: "UPI",
      utrNumber: "UPI20261115001",
      notes: "Prefers herbal tea upon arrival.",
    },
  });

  await prisma.payment.upsert({
    where: { utrNumber: "UPI20261115001" },
    update: {},
    create: {
      appointmentId: sampleAppointment.id,
      amount: 1200,
      currency: "INR",
      status: "CONFIRMED",
      method: "UPI",
      utrNumber: "UPI20261115001",
      verifiedAt: new Date(),
      verifiedBy: "admin@beem.test",
    },
  });

  // Sample Audit Log
  await prisma.auditLog.create({
    data: {
      action: "PAYMENT_CONFIRM",
      entityType: "PAYMENT",
      entityId: sampleAppointment.id,
      performedBy: "admin@beem.test",
      details: JSON.stringify({ utr: "UPI20261115001", amount: 1200, status: "CONFIRMED" }),
      ipAddress: "127.0.0.1",
    },
  });

  console.log("Seeding completed successfully with zero API keys and zero AI!");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
