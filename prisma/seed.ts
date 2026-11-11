import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding BEEM (Beauty Empire) database...");

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
      scalpType: "Normal",
      beautyGoals: "Hydration glow, frizz-free hair, long-lasting wedding makeup.",
      emergencyContact: "+919876599999 (Rohan Roy - Spouse)",
      birthday: new Date("1996-08-15"),
      anniversary: new Date("2022-12-04"),
      notes: "Prefers herbal tea during services. Likes soft natural blush and contoured brow shaping.",
    },
  });

  // 3. Stylists
  const stylistsData = [
    {
      name: "Aisha Sharma",
      email: "aisha.stylist@beem.test",
      phone: "+919876510001",
      bio: "Senior Creative Director with 9+ years experience trained at Toni&Guy London. Master of precision cuts and luxury balayage.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
      specialties: "Precision Haircut, Balayage, Keratin Rituals, Hollywood Blowout",
      experienceYears: 9,
      rating: 4.95,
      reviewCount: 142,
      commissionRate: 0.2,
    },
    {
      name: "Priya Kapoor",
      email: "priya.bridal@beem.test",
      phone: "+919876510002",
      bio: "Celebrity Bridal Artist and Skin Alchemist. Featured in Vogue India for bespoke bridal looks and HD glass-skin finishes.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
      specialties: "Bridal Makeup, HD Airbrush, HydraGlow Facials, Pre-Bridal Prep",
      experienceYears: 8,
      rating: 4.98,
      reviewCount: 189,
      commissionRate: 0.22,
    },
    {
      name: "Fatima Noor",
      email: "fatima.henna@beem.test",
      phone: "+919876510003",
      bio: "Generational Mehendi Artisan specializing in Rajasthani bridal figures, organic dark-stain henna, and modern Indo-Arabic lace.",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
      specialties: "Rajasthani Bridal Henna, Arabic Lace, Organic Cones, Kids Henna",
      experienceYears: 7,
      rating: 4.92,
      reviewCount: 118,
      commissionRate: 0.18,
    },
    {
      name: "Natasha Rao",
      email: "natasha.spa@beem.test",
      phone: "+919876510004",
      bio: "CIDESCO certified esthetician and nail artist. Expert in therapeutic deep-tissue spa therapies and sculpted gel nail art.",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80",
      specialties: "Gel Nail Art, French Spa Manicure, Moroccan Bath, Rica Waxing",
      experienceYears: 6,
      rating: 4.88,
      reviewCount: 94,
      commissionRate: 0.15,
    },
  ];

  const createdStylists = [];
  for (const st of stylistsData) {
    const s = await prisma.stylist.upsert({
      where: { email: st.email },
      update: st,
      create: st,
    });
    createdStylists.push(s);

    // Create 7-day schedule (Mon-Sun 09:00 to 19:00, Tuesday off for some)
    for (let day = 0; day <= 6; day++) {
      const isDayOff = (st.name === "Fatima Noor" && day === 1) || (st.name === "Natasha Rao" && day === 2);
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
          isWorkingDay: !isDayOff,
        },
        create: {
          stylistId: s.id,
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "19:00",
          isWorkingDay: !isDayOff,
        },
      });
    }
  }

  // 4. Service Categories
  const categoriesData = [
    { name: "Haircut", slug: "haircut", description: "Precision haircuts tailored to face shape & lifestyle", icon: "Scissors", orderIndex: 1 },
    { name: "Hair Styling", slug: "hair-styling", description: "Red-carpet blowouts, curls, waves & updos", icon: "Sparkles", orderIndex: 2 },
    { name: "Hair Color", slug: "hair-color", description: "Ammonia-free tints, balayage, gloss & ombre", icon: "Palette", orderIndex: 3 },
    { name: "Facial and Skin", slug: "facial-and-skin", description: "Clinical facials, HydraGlow & 24K gold rituals", icon: "Smile", orderIndex: 4 },
    { name: "Makeup", slug: "makeup", description: "HD party glam, cocktail & destination looks", icon: "HeartHandshake", orderIndex: 5 },
    { name: "Bridal", slug: "bridal", description: "Luxury full bridal makeover, trousseau & trial sessions", icon: "Crown", orderIndex: 6 },
    { name: "Mehendi", slug: "mehendi", description: "100% natural herbal dark-stain henna designs", icon: "Flower2", orderIndex: 7 },
    { name: "Nails", slug: "nails", description: "Gel extensions, French tips, nail art & luxury mani-pedi", icon: "Gem", orderIndex: 8 },
    { name: "Waxing", slug: "waxing", description: "Italian Rica wax & painless gentle peel waxing", icon: "Feather", orderIndex: 9 },
    { name: "Spa", slug: "spa", description: "Aromatherapy, Moroccan steam rituals & head spas", icon: "Waves", orderIndex: 10 },
  ];

  const categoryMap = new Map();
  for (const cat of categoriesData) {
    const c = await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap.set(cat.slug, c.id);
  }

  // 5. Services (15+ services across all categories)
  const servicesData = [
    {
      categorySlug: "haircut",
      name: "BEEM Signature Haircut & Blowdry",
      slug: "beem-signature-haircut",
      description: "In-depth face-shape consultation, nourishing hair wash, precision bespoke cut, and salon-finish blowout.",
      durationMinutes: 45,
      price: 1499,
      discountedPrice: 1299,
      image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&q=80",
      isPopular: true,
      prepInstructions: "Arrive 10 minutes early. No prior hair wash needed.",
    },
    {
      categorySlug: "haircut",
      name: "Layered Butterfly Cut & Texture Styling",
      slug: "layered-butterfly-cut",
      description: "Trending voluminous layers that frame cheekbones with effortless movement and bounce.",
      durationMinutes: 60,
      price: 1899,
      discountedPrice: 1699,
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80",
      isPopular: true,
      prepInstructions: "Bring your favorite reference photo or select one from our Look Board.",
    },
    {
      categorySlug: "hair-styling",
      name: "Red Carpet Hollywood Waves Blowout",
      slug: "hollywood-waves-blowout",
      description: "Ultra-sleek glossy vintage waves using luxury ceramic barrels and anti-humidity serum.",
      durationMinutes: 50,
      price: 1599,
      discountedPrice: 1399,
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
      isPopular: true,
      prepInstructions: "Wash hair with a clarifying shampoo the night before.",
    },
    {
      categorySlug: "hair-color",
      name: "Sun-Kissed Balayage & Gloss Melt",
      slug: "sun-kissed-balayage",
      description: "Hand-painted dimensional highlights blended seamlessly into your natural root base with Olaplex bond repair.",
      durationMinutes: 150,
      price: 5499,
      discountedPrice: 4899,
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
      isPopular: true,
      prepInstructions: "Do not shampoo hair 24 hours prior to service to protect natural scalp oils.",
    },
    {
      categorySlug: "facial-and-skin",
      name: "HydraGlow Oxygen Luxury Facial",
      slug: "hydraglow-oxygen-facial",
      description: "6-step vortex deep pore extraction, lactic exfoliation, hyaluronic infusion, and chilled cryo-globe massage.",
      durationMinutes: 75,
      price: 3499,
      discountedPrice: 2999,
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
      isPopular: true,
      prepInstructions: "Avoid retinol, active acids, or sunburns 48 hours before treatment.",
    },
    {
      categorySlug: "facial-and-skin",
      name: "24K Gold Imperial Radiance Facial",
      slug: "24k-gold-imperial-radiance-facial",
      description: "Pure 24-karat gold leaf sheet application, collagen booster, and lymphatic drainage massage for glowing, luminous skin.",
      durationMinutes: 90,
      price: 4999,
      discountedPrice: 4299,
      image: "https://images.unsplash.com/photo-1512290900672-1f02e6467332?w=600&q=80",
      isPopular: false,
      prepInstructions: "Perfect 2-3 days before weddings or major festivals.",
    },
    {
      categorySlug: "makeup",
      name: "Party Glam HD Cocktail Makeup",
      slug: "party-glam-hd-makeup",
      description: "Flawless HD foundation base, waterproof eye artistry, mink false lashes, and customized nude or statement lips.",
      durationMinutes: 60,
      price: 2999,
      discountedPrice: 2599,
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80",
      isPopular: true,
      prepInstructions: "Arrive with a cleansed, moisturized bare face. Wear a button-down shirt.",
    },
    {
      categorySlug: "bridal",
      name: "Bridal Consultation & Trial Makeup Session",
      slug: "bridal-consultation-trial",
      description: "Comprehensive 90-minute trial testing two distinct looks, jewelry placement analysis, and personalized skin timeline.",
      durationMinutes: 90,
      price: 3500,
      discountedPrice: 2999,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
      isPopular: true,
      prepInstructions: "Bring dupatta, lehenga swatches, and reference jewelry pictures.",
    },
    {
      categorySlug: "mehendi",
      name: "Intricate Arabic Henna (Both Palms & Wrists)",
      slug: "intricate-arabic-henna-palms",
      description: "Flowing floral vines, shaded mandalas, and contemporary negative-space Arabic cuffs.",
      durationMinutes: 60,
      price: 1499,
      discountedPrice: 1299,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
      isPopular: true,
      prepInstructions: "Wash hands with soap and do not apply any lotion, oils, or wax.",
    },
    {
      categorySlug: "nails",
      name: "Gel Sculpted Extensions with Luxe Nail Art",
      slug: "gel-sculpted-extensions-nail-art",
      description: "Lightweight, long-lasting builder gel tips with chrome glazed finish, French ombre, or bespoke hand-painted nail art.",
      durationMinutes: 90,
      price: 2499,
      discountedPrice: 2199,
      image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&q=80",
      isPopular: true,
      prepInstructions: "Inform your stylist if you have preexisting acrylics or gel polish.",
    },
    {
      categorySlug: "waxing",
      name: "Rica Italian White Chocolate Full Body Wax",
      slug: "rica-full-body-wax",
      description: "Colophony-free Italian wax enriched with beeswax and cocoa butter. 80% less redness and irritation.",
      durationMinutes: 75,
      price: 2999,
      discountedPrice: 2499,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
      isPopular: false,
      prepInstructions: "Hair length should be at least a quarter-inch (approx. 2-3 weeks growth).",
    },
    {
      categorySlug: "spa",
      name: "Aromatic Deep Scalp Detox & Keratin Spa",
      slug: "aromatic-scalp-detox-keratin-spa",
      description: "Warm steam micro-mist, tea tree scalp scrub, essential oil head & shoulder pressure point massage, and gloss mask.",
      durationMinutes: 60,
      price: 1999,
      discountedPrice: 1699,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
      isPopular: true,
      prepInstructions: "Relax and unwind. Turn your mobile on silent mode.",
    },
  ];

  for (const svc of servicesData) {
    const categoryId = categoryMap.get(svc.categorySlug);
    if (!categoryId) continue;
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {
        categoryId,
        name: svc.name,
        description: svc.description,
        durationMinutes: svc.durationMinutes,
        price: svc.price,
        discountedPrice: svc.discountedPrice,
        image: svc.image,
        isPopular: svc.isPopular,
        prepInstructions: svc.prepInstructions,
      },
      create: {
        categoryId,
        name: svc.name,
        slug: svc.slug,
        description: svc.description,
        durationMinutes: svc.durationMinutes,
        price: svc.price,
        discountedPrice: svc.discountedPrice,
        image: svc.image,
        isPopular: svc.isPopular,
        prepInstructions: svc.prepInstructions,
      },
    });
  }

  // 6. Bridal Packages
  const bridalPackages = [
    {
      name: "Silver Radiance Bridal Package",
      slug: "silver-radiance-bridal",
      tier: "BASIC",
      tagline: "The essential modern bride beauty package",
      description: "Complete pre-bridal cleanup, HD wedding makeup, hair styling, dupatta draping, and complimentary touch-up kit.",
      price: 14999,
      advanceDeposit: 5000,
      durationHours: 3.5,
      isPopular: false,
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      inclusions: JSON.stringify([
        "HD Wedding Day Makeup",
        "Designer Hair Styling & Real Floral Placement",
        "Dupatta & Saree Draping",
        "Pre-Bridal Glow Facial & Full Waxing",
        "Classic Gel Manicure & Pedicure",
        "Touch-up Lipstick & Powder Kit",
      ]),
      highlights: JSON.stringify([
        "Top-grade MAC & Huda Beauty products",
        "Single dedicated senior stylist",
        "35% booking advance to lock date",
      ]),
    },
    {
      name: "Gold Empress Bridal Luxury Package",
      slug: "gold-empress-bridal",
      tier: "PREMIUM",
      tagline: "Our most coveted luxury bridal celebration package",
      description: "Everything in Silver plus 24K gold facial, airbrush makeup, premium mehendi, trial makeup, and bridesmaid makeup for one guest.",
      price: 29999,
      advanceDeposit: 10000,
      durationHours: 5.0,
      isPopular: true,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      inclusions: JSON.stringify([
        "Airbrush 18-Hour Waterproof Bridal Makeup",
        "Bridal Consultation & Full Makeup Trial",
        "Bridal Henna (Both Hands Up to Elbows & Feet)",
        "24K Gold Imperial Radiance Facial (Pre-Bridal)",
        "Rica Chocolate Full Body Wax & Polishing",
        "Luxe Gel Extensions with Swarovski Crystals",
        "1 Complimentary Saree Draping for Mother/Sister",
      ]),
      highlights: JSON.stringify([
        "Trial session included",
        "Dior, Charlotte Tilbury & NARS kits",
        "Dedicated bridal suite access",
      ]),
    },
    {
      name: "Diamond Imperial Royal Trousseau",
      slug: "diamond-imperial-royal",
      tier: "ROYAL",
      tagline: "The ultimate royal bridal luxury with on-venue VIP artist team",
      description: "Complete 3-event transformation (Mehendi/Sangeet, Muhurtham/Pheras, Reception), venue travel within 25km, master artist Priya Kapoor, and 3 guest makeovers.",
      price: 49999,
      advanceDeposit: 20000,
      durationHours: 8.0,
      isPopular: false,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      inclusions: JSON.stringify([
        "3 Event Looks: Sangeet Glam + Wedding Ceremony + Reception Royalty",
        "Senior Celebrity Artist (Priya Kapoor) Lead Team",
        "Home/Wedding Venue Visit within 25 km included",
        "Full Royal Bridal Rajasthani Henna with Story Motifs",
        "Complete 7-day Pre-Bridal Skin, Hair & Body Spa Calendar",
        "3 Complimentary Party Makeovers for Bridal Entourage",
        "Personal Bridal Concierge on Call",
      ]),
      highlights: JSON.stringify([
        "On-venue VIP service",
        "Full bridal party support",
        "Unlimited touch-ups throughout the ceremony",
      ]),
    },
  ];

  for (const bp of bridalPackages) {
    await prisma.bridalPackage.upsert({
      where: { slug: bp.slug },
      update: bp,
      create: bp,
    });
  }

  // 7. Mehendi Designs (12 designs across styles)
  const mehendiDesigns = [
    {
      title: "Royal Rajasthani Dulha-Dulhan Full-Hand",
      slug: "royal-rajasthani-dulha-dulhan",
      style: "Rajasthani",
      complexity: "Bridal Luxury",
      estimatedTime: "180 mins",
      price: 5999,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
      tags: "Bridal, Rajasthani, Storybook, Intricate, Traditional",
      isFeatured: true,
    },
    {
      title: "Modern Gulf Arabic Floral Trail",
      slug: "modern-gulf-arabic-trail",
      style: "Arabic",
      complexity: "Medium",
      estimatedTime: "45 mins",
      price: 1299,
      image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=80",
      tags: "Arabic, Modern, Bold, Quick, Festive",
      isFeatured: true,
    },
    {
      title: "Minimalist Finger Lace & Geometric Cuff",
      slug: "minimalist-finger-lace-cuff",
      style: "Minimal",
      complexity: "Simple",
      estimatedTime: "30 mins",
      price: 899,
      image: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=600&q=80",
      tags: "Minimal, Chic, Western, Office-ready, Subtle",
      isFeatured: true,
    },
    {
      title: "Indo-Arabic Peacock & Lotus Fusion",
      slug: "indo-arabic-peacock-lotus",
      style: "Indo-Arabic",
      complexity: "Intricate",
      estimatedTime: "90 mins",
      price: 2499,
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",
      tags: "Lotus, Peacock, Shaded, Sangeet, Indo-Arabic",
      isFeatured: true,
    },
    {
      title: "Bridal Full-Hand & Forearm Heritage Grid",
      slug: "bridal-full-hand-forearm-grid",
      style: "Bridal Full-hand",
      complexity: "Bridal Luxury",
      estimatedTime: "150 mins",
      price: 4999,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
      tags: "Bridal, Jaal, Grid, Heavy, Traditional",
      isFeatured: true,
    },
    {
      title: "Kids Floral Cartoon & Butterfly Henna",
      slug: "kids-floral-butterfly-henna",
      style: "Kids",
      complexity: "Simple",
      estimatedTime: "20 mins",
      price: 499,
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80",
      tags: "Kids, Fast-drying, Gentle, Butterflies, Stars",
      isFeatured: false,
    },
    {
      title: "Marwari Dhol & Shehnai Ceremony Henna",
      slug: "marwari-dhol-shehnai-henna",
      style: "Rajasthani",
      complexity: "Intricate",
      estimatedTime: "120 mins",
      price: 3499,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
      tags: "Rajasthani, Wedding, Instruments, Festive",
      isFeatured: false,
    },
    {
      title: "Symmetric Mandala with Ring Accents",
      slug: "symmetric-mandala-ring-accents",
      style: "Minimal",
      complexity: "Simple",
      estimatedTime: "40 mins",
      price: 999,
      image: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?w=600&q=80",
      tags: "Mandala, Symmetry, Contemporary, Boho",
      isFeatured: false,
    },
    {
      title: "Dubai Bold Leaf Vine Hand Back",
      slug: "dubai-bold-leaf-vine",
      style: "Arabic",
      complexity: "Medium",
      estimatedTime: "50 mins",
      price: 1399,
      image: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=80",
      tags: "Dubai, Arabic, Negative Space, Chic",
      isFeatured: false,
    },
    {
      title: "Zardozi Lace Bridal Palms & Feet Combo",
      slug: "zardozi-lace-bridal-combo",
      style: "Bridal Full-hand",
      complexity: "Bridal Luxury",
      estimatedTime: "210 mins",
      price: 6999,
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80",
      tags: "Feet, Palms, Full Set, Zardozi, Royal",
      isFeatured: false,
    },
    {
      title: "Paisley Motif Contemporary Cuff",
      slug: "paisley-motif-contemporary-cuff",
      style: "Indo-Arabic",
      complexity: "Medium",
      estimatedTime: "60 mins",
      price: 1599,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
      tags: "Kalka, Paisley, Modern Indo, Cocktail",
      isFeatured: false,
    },
    {
      title: "Little Princess Sparkling Glitter Henna",
      slug: "little-princess-glitter-henna",
      style: "Kids",
      complexity: "Simple",
      estimatedTime: "25 mins",
      price: 599,
      image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80",
      tags: "Kids, Glitter, Washable, Safe, Fun",
      isFeatured: false,
    },
  ];

  for (const md of mehendiDesigns) {
    await prisma.mehendiDesign.upsert({
      where: { slug: md.slug },
      update: md,
      create: md,
    });
  }

  // 8. Gallery Items (10+ high-quality images)
  const galleryItems = [
    {
      title: "Royal Emerald Reception Bridal Look",
      category: "Bridal",
      imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=700&q=80",
      description: "HD airbrush base, smokey bronze eyes, and real jasmine gajra placement.",
      isFeatured: true,
      likesCount: 184,
    },
    {
      title: "Caramel Honey Balayage on Dark Brown Curls",
      category: "Hair",
      imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=700&q=80",
      description: "Seamless sun-drenched gradient with gloss treatment.",
      isFeatured: true,
      likesCount: 229,
    },
    {
      title: "Intricate Bridal Full-Hand Henna with Dulha Portrait",
      category: "Mehendi",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=80",
      description: "100% natural sojat henna with rich mahogany stain after 48 hours.",
      isFeatured: true,
      likesCount: 312,
    },
    {
      title: "Chic Glazed Donut Chrome Nails",
      category: "Nails",
      imageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=700&q=80",
      description: "Almond shaped extensions with pearl iridescent dusting.",
      isFeatured: true,
      likesCount: 156,
    },
    {
      title: "Fresh Dewy Glass-Skin Post HydraFacial",
      category: "Skin",
      imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=700&q=80",
      description: "Immediate hydration and pore reduction with no downtime.",
      isFeatured: false,
      likesCount: 98,
    },
    {
      title: "Sunset Peach Sangeet Cocktail Glam",
      category: "Makeup",
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=700&q=80",
      description: "Monochromatic peach palette with champagne shimmer and glossy pout.",
      isFeatured: true,
      likesCount: 147,
    },
    {
      title: "Effortless Textured French Bob",
      category: "Hair",
      imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=700&q=80",
      description: "Jawline-skimming cut with airy curtain fringe.",
      isFeatured: false,
      likesCount: 110,
    },
    {
      title: "Traditional South Indian Muhurtham Look",
      category: "Bridal",
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=700&q=80",
      description: "Winged eyeliner, terracotta lips, temple jewelry styling and poola jada hair.",
      isFeatured: true,
      likesCount: 265,
    },
  ];

  for (const gi of galleryItems) {
    await prisma.galleryItem.create({
      data: gi,
    });
  }

  // 9. Promo Codes & Offers
  const promoCodes = [
    {
      code: "WELCOME10",
      description: "10% off your first appointment at BEEM",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 999,
      maxDiscount: 500,
      validUntil: new Date("2027-12-31"),
    },
    {
      code: "BRIDAL2026",
      description: "Flat ₹2,000 off any Bridal Package booked 30+ days in advance",
      discountType: "FIXED",
      discountValue: 2000,
      minOrderValue: 12000,
      maxDiscount: 2000,
      validUntil: new Date("2027-12-31"),
    },
    {
      code: "DIWALI500",
      description: "₹500 festive discount on festive grooming",
      discountType: "FIXED",
      discountValue: 500,
      minOrderValue: 2499,
      maxDiscount: 500,
      validUntil: new Date("2027-12-31"),
    },
    {
      code: "FESTIVE20",
      description: "20% off on all Spa and Facial services",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minOrderValue: 1999,
      maxDiscount: 1000,
      validUntil: new Date("2027-12-31"),
    },
  ];

  const createdPromoMap = new Map();
  for (const pc of promoCodes) {
    const promo = await prisma.promoCode.upsert({
      where: { code: pc.code },
      update: pc,
      create: pc,
    });
    createdPromoMap.set(pc.code, promo.id);
  }

  const offers = [
    {
      title: "Diwali Sparkle & Glow Special",
      discountText: "Flat ₹500 OFF",
      description: "Pair our HydraGlow Luxury Facial with any Haircut for instant radiant glow this festive season.",
      promoCodeId: createdPromoMap.get("DIWALI500"),
      bannerImage: "https://images.unsplash.com/photo-1512290900672-1f02e6467332?w=800&q=80",
      isFestival: true,
      festivalName: "Diwali Special",
      validUntil: new Date("2027-11-30"),
    },
    {
      title: "Grand Wedding Season Bridal Advance",
      discountText: "Flat ₹2000 OFF",
      description: "Lock your auspicious wedding dates today and get ₹2,000 off our Gold Empress or Diamond Imperial packages.",
      promoCodeId: createdPromoMap.get("BRIDAL2026"),
      bannerImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      isFestival: true,
      festivalName: "Wedding Season",
      validUntil: new Date("2027-12-31"),
    },
    {
      title: "First Visit Warm Welcome",
      discountText: "10% OFF Sitewide",
      description: "Experience luxury grooming at BEEM. Enjoy 10% off your entire first invoice with code WELCOME10.",
      promoCodeId: createdPromoMap.get("WELCOME10"),
      bannerImage: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80",
      isFestival: false,
      festivalName: null,
      validUntil: new Date("2027-12-31"),
    },
  ];

  for (const off of offers) {
    await prisma.offer.create({
      data: off,
    });
  }

  // 10. Memberships and Gift Cards
  const membershipPlans = [
    {
      name: "BEEM Silver Glow Privilege",
      slug: "silver-glow",
      period: "YEARLY",
      price: 4999,
      discountPercent: 15,
      description: "Priority booking, 15% off all regular services, and a complimentary birthday blowout.",
      perks: JSON.stringify([
        "15% off all haircuts, facials, and styling",
        "Complimentary Birthday Blowout & Head Massage",
        "10% off retail products & gift cards",
        "Zero cancellation charge window",
      ]),
    },
    {
      name: "BEEM Gold Empress Imperial Club",
      slug: "gold-empress",
      period: "YEARLY",
      price: 11999,
      discountPercent: 25,
      description: "VIP private suite access, 25% discount, complimentary HydraFacial every quarter, and priority wedding hold.",
      perks: JSON.stringify([
        "25% off all services including bridal & mehendi",
        "4 Complimentary HydraGlow Facials per year (1 per quarter)",
        "VIP Private Suite bookings with complimentary beverages",
        "Priority hold on auspicious wedding dates",
        "Family sharing allowed for up to 2 immediate members",
      ]),
    },
  ];

  for (const mp of membershipPlans) {
    await prisma.membershipPlan.upsert({
      where: { slug: mp.slug },
      update: mp,
      create: mp,
    });
  }

  // Sample Gift Card
  await prisma.giftCard.upsert({
    where: { code: "BEEM-GIFT-5000" },
    update: {},
    create: {
      code: "BEEM-GIFT-5000",
      purchaserId: customer.id,
      recipientName: "Meera Sen",
      recipientEmail: "meera.sen@example.com",
      recipientPhone: "+919876544444",
      initialAmount: 5000,
      balanceAmount: 5000,
      message: "Happy 30th Birthday dearest Meera! Treat yourself to a royal pampering day at BEEM.",
      expiryDate: new Date("2027-12-31"),
      isRedeemed: false,
    },
  });

  // 11. Sample Verified Reviews
  const reviewsData = [
    {
      customerName: "Rhea Singhania",
      rating: 5,
      comment: "Aisha gave me the best haircut of my life! The consultation was super thorough. She understood my curl pattern immediately.",
      isVerified: true,
      ownerReply: "Thank you so much Rhea! It was an absolute delight working with your lovely curls. See you for your gloss treatment soon!",
      repliedAt: new Date(),
    },
    {
      customerName: "Dr. Tanvi Kulkarni",
      rating: 5,
      comment: "Priya handled my wedding makeup. It stayed flawless through 8 hours of emotional ceremonies and tears. Absolute perfection.",
      isVerified: true,
      ownerReply: "Congratulations once again Tanvi! You made an ethereal bride. Wishing you and Siddharth a lifetime of joy!",
      repliedAt: new Date(),
    },
    {
      customerName: "Kavya Menon",
      rating: 5,
      comment: "The 24K Gold facial left my skin glowing for days. The ambiance is peaceful, smells heavenly of lavender and rose gold luxury.",
      isVerified: true,
    },
    {
      customerName: "Sneha Reddy",
      rating: 4,
      comment: "Loved Fatima's henna work! The color turned into such a deep rich burgundy. Took slightly longer than expected but totally worth it.",
      isVerified: true,
      ownerReply: "Thank you Sneha! Traditional dark stain natural henna needs patience and Fatima takes supreme care with detail.",
      repliedAt: new Date(),
    },
  ];

  for (const rev of reviewsData) {
    await prisma.review.create({
      data: rev,
    });
  }

  // 12. Sample Appointment with Customer
  const sampleAppointment = await prisma.appointment.create({
    data: {
      appointmentNumber: "BEEM-2026-0001",
      userId: customer.id,
      customerName: "Ananya Roy",
      customerPhone: "+919876500002",
      customerEmail: "customer@beem.test",
      stylistId: createdStylists[0].id,
      date: new Date("2026-11-15T00:00:00Z"),
      startTime: "11:00",
      endTime: "11:45",
      status: "CONFIRMED",
      totalAmount: 1299,
      discountAmount: 0,
      advancePaid: 1299,
      balanceDue: 0,
      paymentStatus: "COMPLETED",
      paymentMethod: "MOCK_PAYMENT",
      items: {
        create: [
          {
            name: "BEEM Signature Haircut & Blowdry",
            price: 1299,
            durationMinutes: 45,
          },
        ],
      },
      payments: {
        create: [
          {
            amount: 1299,
            currency: "INR",
            status: "SUCCESS",
            method: "MOCK_PAYMENT",
            transactionRef: "MOCK-TXN-20261111001",
            isMock: true,
          },
        ],
      },
      invoice: {
        create: {
          invoiceNumber: "INV-2026-0001",
          subtotal: 1100.85,
          taxAmount: 198.15,
          discountAmount: 0,
          totalAmount: 1299,
          status: "PAID",
        },
      },
    },
  });

  // Loyalty transaction for customer
  await prisma.loyaltyTransaction.create({
    data: {
      userId: customer.id,
      points: 130, // 10% back in points
      type: "EARNED",
      description: "Points earned for Appointment #BEEM-2026-0001",
      appointmentId: sampleAppointment.id,
      balanceAfter: 350,
    },
  });

  // 13. Inventory Items
  const inventoryData = [
    { name: "L'Oréal Professionnel Inoa Ammonia-Free 5.3", sku: "LOR-INOA-53", category: "Hair Color", currentStock: 24, minStockAlert: 5, unit: "tubes", costPrice: 480, supplier: "L'Oréal India Ltd." },
    { name: "Rica Italian White Chocolate Wax Tub 800ml", sku: "RICA-CHOC-800", category: "Wax", currentStock: 12, minStockAlert: 3, unit: "tubs", costPrice: 950, supplier: "Rica Cosmetics" },
    { name: "HydraDerm Hyaluronic Booster Serum 250ml", sku: "HYD-SERUM-250", category: "Skincare", currentStock: 8, minStockAlert: 2, unit: "bottles", costPrice: 2200, supplier: "Dermaceuticals" },
    { name: "OPI ProSpa Gel Color French White", sku: "OPI-GEL-WHT", category: "Nails", currentStock: 15, minStockAlert: 4, unit: "bottles", costPrice: 650, supplier: "OPI Nails" },
    { name: "100% Organic Rajasthani Sojat Henna Powder", sku: "HENNA-SOJAT-1KG", category: "Henna", currentStock: 30, minStockAlert: 10, unit: "kg", costPrice: 350, supplier: "Sojat Farmers Co." },
  ];

  for (const inv of inventoryData) {
    await prisma.inventoryItem.upsert({
      where: { sku: inv.sku },
      update: inv,
      create: inv,
    });
  }

  // 14. Blog Posts
  const blogPosts = [
    {
      title: "The Ultimate Pre-Bridal Skincare Countdown: 6 Months to the Big Day",
      slug: "ultimate-pre-bridal-skincare-countdown",
      excerpt: "From tackling hyperpigmentation to locking in that glass-skin glow, here is our master timeline for every bride-to-be.",
      author: "Priya Kapoor (Celebrity Bridal Artist)",
      coverImage: "https://images.unsplash.com/photo-1512290900672-1f02e6467332?w=800&q=80",
      tags: "Bridal, Skincare, Glow, Wedding Prep",
      readingTimeMinutes: 5,
      content: `Planning your dream wedding involves hundreds of decisions, but your bridal glow should never be left to chance. At BEEM, we guide hundreds of brides through custom radiance roadmaps.\n\n### 6 Months Out: Foundation & Assessment\nStart with an in-depth dermatological analysis. If you have acne scarring, pigmentation, or uneven texture, this is when chemical peels or laser toning have enough healing buffer. Switch to medical-grade sunscreen (SPF 50 PA++++).\n\n### 3 Months Out: Hydration & Texture Refinement\nBegin monthly HydraGlow treatments to decongest pores without causing flare-ups. Drink 3 liters of water infused with cucumber and mint.\n\n### 1 Month Out: Trial Makeup & Color Lockdown\nNever try a new skincare active or facial within 3 weeks of your wedding! Lock your trial makeup look, finalize your lip shade, and complete all waxing 4-5 days prior.\n\n### The Final 48 Hours\nSleep 8 hours, apply cold eye gel masks, and let our BEEM bridal team handle everything else!`,
    },
    {
      title: "Secrets to a Long-Lasting Dark Henna Stain Naturally",
      slug: "secrets-to-dark-henna-stain-naturally",
      excerpt: "Discover traditional artisan techniques to achieve a rich, royal mahogany stain that lasts over two weeks without chemicals.",
      author: "Fatima Noor (Master Mehendi Artist)",
      coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
      tags: "Mehendi, Henna, Natural Care, Bridal Tips",
      readingTimeMinutes: 4,
      content: `Many brides ask us how celebrity henna stains look almost pitch-black in wedding photos. The secret is not synthetic black dye (which can cause severe chemical burns), but authentic organic henna care.\n\n1. **Clean Canvas**: Wash hands with soap and dry completely. Avoid lotions or oils before henna application.\n2. **Lemon-Sugar Glaze**: Once the henna dries slightly, dab a warm mix of lemon juice and sugar to seal the paste to your skin.\n3. **Clove Smoke (Laung Ki Bhaap)**: Heat 4-5 cloves in a pan and gently let the aromatic smoke warm your hands. The heat activates henna essential oils.\n4. **Keep It On Overnight**: Scrape off with mustard oil or coconut oil — never wash off with water for the first 24 hours!`,
    },
    {
      title: "Balayage vs. Highlights: What Truly Suits Your Hair & Routine?",
      slug: "balayage-vs-highlights-guide",
      excerpt: "Confused between hand-painted balayage and foil highlights? Here is how to choose based on your salon visit frequency and hair texture.",
      author: "Aisha Sharma (Creative Hair Director)",
      coverImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
      tags: "Hair Color, Balayage, Haircare, Styling",
      readingTimeMinutes: 4,
      content: `Choosing the right hair color technique determines not just how you look walking out of the salon, but how your hair looks 3 months down the line.\n\n### Balayage: Low Maintenance Royalty\nBalayage is the French art of freehand painting. Because color starts softly lower down the hair shaft rather than right at the root, regrowth is soft and seamless. You only need a salon touchup every 4 to 6 months!\n\n### Traditional Foil Highlights: High Impact Uniformity\nFoil highlights work right from the root, giving maximum brightness and uniform lift. However, noticeable demarcation lines appear after 6-8 weeks.\n\nBook a consultation with our master colorists at BEEM to test our hair shade swatches against your undertone!`,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  // 15. Default Settings
  const defaultSettings = [
    { key: "salon_name", value: "BEEM (Beauty Empire)", description: "Salon brand name" },
    { key: "salon_phone", value: "+919876543210", description: "Primary salon contact number" },
    { key: "salon_whatsapp", value: "+919876543210", description: "WhatsApp click-to-chat business number" },
    { key: "salon_email", value: "contact@beem.test", description: "Salon official email" },
    { key: "salon_address", value: "Shop 12-14, Luxury Promenade, 100 Feet Road, Indiranagar, Bengaluru 560038", description: "Physical address" },
    { key: "working_hours_open", value: "09:00", description: "Salon opening time" },
    { key: "working_hours_close", value: "20:00", description: "Salon closing time" },
    { key: "deposit_percentage", value: "25", description: "Standard booking deposit percentage (if requested)" },
    { key: "bridal_deposit_percentage", value: "40", description: "Bridal date hold advance percentage" },
    { key: "cancellation_window_hours", value: "4", description: "Minimum hours before slot to cancel/reschedule for full refund" },
    { key: "distance_tier_pricing", value: JSON.stringify([
      { maxKm: 5, price: 500, label: "Up to 5 km" },
      { maxKm: 15, price: 1200, label: "5 - 15 km" },
      { maxKm: 30, price: 2500, label: "15 - 30 km" },
      { maxKm: 50, price: 4500, label: "30 - 50 km" },
    ]), description: "Home and venue visit surcharge tiers in INR" },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
