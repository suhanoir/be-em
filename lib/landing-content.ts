export interface LandingStat {
  value: number;
  suffix: string;
  label: string;
  description: string;
}

export interface LandingCategory {
  id: string;
  name: string;
  shortDesc: string;
  priceStarting: number;
  durationMin: number;
  iconName: string;
  slug: string;
  tag?: string;
  accentColor: string;
}

export interface BridalPackageItem {
  id: string;
  name: string;
  tier: "Silver" | "Gold" | "Platinum";
  price: number;
  durationMin: number;
  description: string;
  popular?: boolean;
  inclusions: string[];
  idealFor: string;
}

export interface MehendiItem {
  id: string;
  title: string;
  style: "Arabic" | "Rajasthani" | "Indo-Arabic" | "Minimal" | "Bridal Full-Hand";
  price: number;
  durationMin: number;
  description: string;
  tag: string;
  colorScheme: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  occasion: string;
  quote: string;
  rating: number;
  verified: boolean;
  service: string;
}

export interface StylistHighlight {
  id: string;
  name: string;
  role: string;
  experienceYears: number;
  specialty: string;
  bio: string;
  rating: number;
  bookingSlug: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: "booking" | "bridal" | "hygiene" | "payments";
}

export interface TransformationItem {
  id: string;
  title: string;
  category: string;
  service: string;
  stylist: string;
  beforeLabel: string;
  afterLabel: string;
  description: string;
}

export const LANDING_CONTENT = {
  salon: {
    brandName: "BEEM",
    fullName: "BEEM (Beauty Empire)",
    tagline: "Where Every Look Becomes Royal",
    subline: "Hair, makeup, bridal & mehendi artistry in Indiranagar, Bengaluru. Book your luxury beauty experience in under 60 seconds.",
    phone: "+91 98765 43210",
    phoneNumeric: "919876543210",
    email: "concierge@beem.luxury",
    address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
    mapsUrl: "https://maps.google.com/?q=Indiranagar+Bengaluru",
    hours: "Monday – Sunday: 9:00 AM – 9:00 PM",
    whatsappPrefill: "Hello BEEM! I would like to book a luxury beauty consultation.",
  },

  hero: {
    badge: "Bengaluru's Premier Beauty Sanctuary",
    titlePrefix: "Where Every Look",
    titleEmphasized: "Becomes Royal",
    description:
      "Indulge in artisanal haircuts, glowing balayage, custom bridal makeovers, and authentic Rajasthani henna. Luxury care tailored to your unique beauty.",
    primaryCta: {
      text: "Book Your Appointment",
      href: "/book",
    },
    secondaryCta: {
      text: "Explore Services",
      href: "#services",
    },
    trustMetrics: [
      { label: "Client Rating", value: "4.9 ★", subtext: "2,000+ reviews" },
      { label: "Happy Beauties", value: "15,000+", subtext: "Since 2018" },
      { label: "Bridal Specialist", value: "100%", subtext: "Cruelty-free & clean" },
    ],
    floatingPills: [
      { title: "Royal Bridal Makeover", category: "Bridal Couture", time: "300 min", icon: "Sparkles" },
      { title: "Rajasthani Organic Henna", category: "Mehendi Art", time: "180 min", icon: "Flower2" },
      { title: "HydraGlow Diamond Facial", category: "Skin Clinic", time: "75 min", icon: "Flame" },
    ],
  },

  marqueeStrip: [
    "Bespoke Haircuts",
    "Royal Bridal Makeovers",
    "Organic Rajasthani Henna",
    "HydraGlow Facials",
    "Russian Gel Nails",
    "Pain-Free Luxury Waxing",
    "Deep Scalp Spa",
    "Sunkissed Balayage",
    "Pre-Bridal Glow Rituals",
    "Keratin Silk Therapy",
  ],

  stats: [
    {
      value: 15000,
      suffix: "+",
      label: "Royal Makeovers",
      description: "Delighted clients across Bengaluru",
    },
    {
      value: 12,
      suffix: "+",
      label: "Artisanal Categories",
      description: "From micro-styling to wedding couture",
    },
    {
      value: 4,
      suffix: "",
      label: "Master Artists",
      description: "Certified senior beauty directors",
    },
    {
      value: 8,
      suffix: "+",
      label: "Years of Excellence",
      description: "Pioneering salon luxury in Indiranagar",
    },
  ],

  servicesCategories: [
    {
      id: "haircut",
      name: "Haircuts & Styling",
      shortDesc: "Face-framing cuts, precision layers, and blowouts customized to your hair texture.",
      priceStarting: 800,
      durationMin: 45,
      iconName: "Scissors",
      slug: "haircut-and-styling",
      tag: "Most Popular",
      accentColor: "#6D28D9",
    },
    {
      id: "color",
      name: "Hair Color & Balayage",
      shortDesc: "Ammonia-free French balayage, gloss treatments, and dimensional root meltdowns.",
      priceStarting: 3500,
      durationMin: 120,
      iconName: "Palette",
      slug: "hair-color",
      tag: "Trending",
      accentColor: "#7C3AED",
    },
    {
      id: "bridal",
      name: "Bridal Couture Makeover",
      shortDesc: "HD & Airbrush bridal looks, jewelry setting, dupatta draping, and trial sessions.",
      priceStarting: 14999,
      durationMin: 240,
      iconName: "Crown",
      slug: "bridal-makeup",
      tag: "Signature",
      accentColor: "#D4AF37",
    },
    {
      id: "mehendi",
      name: "Organic Henna Artistry",
      shortDesc: "Triple-filtered dark stain organic henna: Arabic, Rajasthani, and minimal motifs.",
      priceStarting: 1200,
      durationMin: 90,
      iconName: "Feather",
      slug: "mehendi",
      tag: "Artisanal",
      accentColor: "#B76E79",
    },
    {
      id: "facial",
      name: "Facial & Skin Radiance",
      shortDesc: "HydraGlow dermaplaning, 24K gold facial, and gentle botanical peels for luminous skin.",
      priceStarting: 2200,
      durationMin: 60,
      iconName: "Sparkles",
      slug: "facial-and-skin",
      tag: "Restorative",
      accentColor: "#6D28D9",
    },
    {
      id: "nails",
      name: "Russian Gel Nails",
      shortDesc: "Flawless cuticle care, long-wear gel extensions, chrome finishes, and nail art.",
      priceStarting: 1500,
      durationMin: 60,
      iconName: "Hand",
      slug: "nails",
      tag: "Chic",
      accentColor: "#A78BFA",
    },
    {
      id: "waxing",
      name: "Comfort Waxing & Threading",
      shortDesc: "Rica Italian wax with soothing aloe vera gel for sensitive and delicate skin.",
      priceStarting: 600,
      durationMin: 30,
      iconName: "Flame",
      slug: "waxing",
      tag: "Gentle",
      accentColor: "#B76E79",
    },
    {
      id: "spa",
      name: "Aromatherapy Hair Spa",
      shortDesc: "Warm Ayurvedic oil infusions, deep scalp detox, and therapeutic shoulder massage.",
      priceStarting: 1800,
      durationMin: 60,
      iconName: "HeartPulse",
      slug: "spa-wellness",
      tag: "Relaxing",
      accentColor: "#4C1D95",
    },
  ],

  bridalSpotlight: {
    badge: "The Bride's Dream Experience",
    title: "Curated Bridal Ceremonies",
    subtitle: "From confidential consultation to the final dupatta pin, we ensure your wedding radiance is completely unforgettable.",
    weddingDateLockNote: "Wedding dates are strictly reserved on advance payment to guarantee 100% artist exclusivity.",
    packages: [
      {
        id: "silver-bridal",
        name: "Silver Elegance",
        tier: "Silver",
        price: 14999,
        durationMin: 180,
        description: "Ideal for intimate ceremonies, receptions, or engagement looks.",
        inclusions: [
          "Full HD Waterproof Makeup",
          "Designer Hair Styling & Real Floral Setting",
          "Dupatta Draping & Jewelry Placement",
          "Premium Lashes & Touch-Up Kit",
          "Salon Studio Experience",
        ],
        idealFor: "Sangeet, Reception & Court Weddings",
      },
      {
        id: "gold-bridal",
        name: "Gold Radiance",
        tier: "Gold",
        price: 24999,
        durationMin: 300,
        popular: true,
        description: "Our signature bridal package featuring Airbrush artistry and pre-bridal glow.",
        inclusions: [
          "Temptu Pro Airbrush Makeup",
          "Advanced Hair Architecture with Extensions",
          "Full Trial Session & Style Consultation",
          "Pre-Bridal Gold Glow Facial (3 days prior)",
          "On-Venue Availability in Bengaluru (Tier 1)",
          "Complimentary Mother-of-the-Bride Express Touch-Up",
        ],
        idealFor: "Traditional Hindu, Muslim & Christian Nuptials",
      },
      {
        id: "royal-bridal",
        name: "Imperial Maharani",
        tier: "Platinum",
        price: 39999,
        durationMin: 420,
        description: "The ultimate 360-degree bridal pampering with full entourage care and venue styling.",
        inclusions: [
          "Master Stylist Ananya Sharma Exclusive",
          "Ultra-HD Airbrush with 24-Hour Staying Power",
          "Full Pre-Bridal 3-Day Spa, Wax & Facial Ritual",
          "Full Bridal Henna & 2 Bridesmaids Mehendi",
          "Unlimited Draping Changes for Morning & Evening",
          "Dedicated Personal Assistant on Venue",
        ],
        idealFor: "Multi-Day Destination & Grand Palace Weddings",
      },
    ] as BridalPackageItem[],
  },

  mehendiStyles: [
    {
      id: "meh-1",
      title: "Royal Rajasthani Heritage",
      style: "Rajasthani",
      price: 3500,
      durationMin: 150,
      description: "Intricate peacocks, doli palanquin motifs, and dense jali work with dark mahogany stain.",
      tag: "Bridal Classic",
      colorScheme: "from-amber-900 to-amber-700",
    },
    {
      id: "meh-2",
      title: "Gulf Chic Arabic Fusion",
      style: "Arabic",
      price: 1800,
      durationMin: 75,
      description: "Bold floral strokes, free-flowing negative space, and contemporary cuff bracelets.",
      tag: "Modern & Bold",
      colorScheme: "from-purple-900 to-purple-700",
    },
    {
      id: "meh-3",
      title: "Indo-Arabic Symmetry",
      style: "Indo-Arabic",
      price: 2400,
      durationMin: 90,
      description: "Delicate mandalas transitioning into trailing vine fingertips with shading effects.",
      tag: "Most Loved",
      colorScheme: "from-violet-900 to-violet-700",
    },
    {
      id: "meh-4",
      title: "Botanical Minimalist",
      style: "Minimal",
      price: 1200,
      durationMin: 45,
      description: "Finger accents, crescent moon wreaths, and understated wrist cuffs for minimalist aesthetics.",
      tag: "Effortless",
      colorScheme: "from-rose-900 to-rose-700",
    },
    {
      id: "meh-5",
      title: "Elbow-Length Bridal Maharani",
      style: "Bridal Full-Hand",
      price: 6500,
      durationMin: 240,
      description: "Custom couple initials, baraat procession, and wedding vows inscribed into the palms.",
      tag: "Couture",
      colorScheme: "from-amber-950 to-purple-950",
    },
  ] as MehendiItem[],

  howItWorks: [
    {
      step: "01",
      title: "Choose Your Luxury Treatment",
      desc: "Browse our transparent menu with upfront prices, realistic durations, and verified real client photos.",
      icon: "Sparkles",
    },
    {
      step: "02",
      title: "Select Your Senior Stylist",
      desc: "Pick your preferred master artist or choose 'Any Available' for the earliest convenient opening.",
      icon: "UserCheck",
    },
    {
      step: "03",
      title: "Lock Your Instant Slot",
      desc: "Our real-time engine ensures zero double-booking and sends instant calendar reminders to your phone.",
      icon: "Calendar",
    },
    {
      step: "04",
      title: "Pay Online or at Salon",
      desc: "Secure with UPI, Cards, or pay at the front desk. Enjoy complimentary artisan tea upon arrival.",
      icon: "ShieldCheck",
    },
  ],

  smartFeatures: [
    {
      id: "looks",
      title: "Curated Looks Inspiration",
      badge: "Trending Styles",
      tagline: "Explore signature hair, bridal & makeup looks",
      desc: "Browse high-definition salon inspirations crafted by our master stylists, save to your personal board, or book directly in one click.",
      cta: "Explore Curated Looks",
      href: "/looks",
      accent: "from-purple-600 to-pink-600",
    },
    {
      id: "quiz",
      title: "Signature Style & Face-Shape Quiz",
      badge: "Diagnostic Tool",
      tagline: "Find your signature look in 2 mins",
      desc: "Answer 4 questions about your skin undertone, hair texture, and event to get rule-based stylist and service recommendations.",
      cta: "Take Style Quiz",
      href: "/quiz",
      accent: "from-violet-600 to-indigo-600",
    },
    {
      id: "concierge",
      title: "Instant Salon Help Desk",
      badge: "Direct Support",
      tagline: "Answers, pricing & WhatsApp chat",
      desc: "Have a question about bridal schedules, hygiene, or policies? Get instant answers from our FAQ database or tap to chat directly on WhatsApp.",
      cta: "Open Help Desk",
      href: "#help",
      accent: "from-rose-600 to-purple-600",
    },
    {
      id: "lookboard",
      title: "Personal Look Board",
      badge: "Client Favorite",
      tagline: "Save dream inspirations for your artist",
      desc: "Curate your favorite styles into your personal board so your stylist recreates the exact look with complete confidence.",
      cta: "Open My Look Board",
      href: "/lookboard",
      accent: "from-amber-600 to-purple-700",
    },
  ],

  loyaltyAndOffers: {
    badge: "Royalty Rewards Program",
    title: "Every Visit Pampered. Every Rupee Rewarded.",
    pointsSummary: "Earn 10% instant loyalty cashback on every booking to redeem on upcoming treatments.",
    tenthVisitBenefit: "10th Salon Visit Reward: Receive a complimentary 60-minute Aromatherapy Spa or HydraGlow Facial!",
    activeFestivalOffers: [
      {
        code: "ROYALWELCOME",
        discount: "₹500 OFF",
        desc: "On your first booking above ₹1,500. Valid for new guests.",
      },
      {
        code: "BRIDALGLOW",
        discount: "15% OFF",
        desc: "On all Bridal & Pre-Bridal packages booked 30+ days in advance.",
      },
      {
        code: "HENNALOVE",
        discount: "FREE Nails",
        desc: "Complimentary Gel Polish manicure with any Bridal Mehendi booking.",
      },
    ],
    membershipsTeaser: "Explore Silver, Gold, and Platinum monthly memberships for priority slot bookings & exclusive 20% savings.",
  },

  transformations: [
    {
      id: "trans-1",
      title: "Sun-Drenched Honey Balayage",
      category: "Hair Architecture",
      service: "Signature Balayage & Olaplex Glaze",
      stylist: "Priya Nair",
      beforeLabel: "Brassy & Uneven",
      afterLabel: "Seamless Dimension",
      description: "Corrected brassy orange undertones into seamless honey blonde ribbons with zero breakage.",
    },
    {
      id: "trans-2",
      title: "Regal Muhurtham Bridal Radiance",
      category: "Bridal Couture",
      service: "Gold Radiance Airbrush & Traditional Draping",
      stylist: "Ananya Sharma",
      beforeLabel: "Bare Skin & Waves",
      afterLabel: "Imperial Radiance",
      description: "Glowing, sweat-proof base with classic south-Indian temple jewelry setting and jasmine florals.",
    },
    {
      id: "trans-3",
      title: "Glass-Skin HydraGlow Revitalization",
      category: "Skin Clinic",
      service: "HydraGlow Diamond Dermabrasion",
      stylist: "Kavita Patel",
      beforeLabel: "Dehydrated & Congested",
      afterLabel: "Poreless Dewy Glow",
      description: "Deep ultrasonic pore extraction infused with peptide serums for an instant red-carpet reflection.",
    },
  ] as TransformationItem[],

  testimonials: [
    {
      id: "test-1",
      name: "Dr. Radhika Menon",
      role: "Bride",
      occasion: "Wedding Reception at The Leela Palace",
      quote:
        "BEEM made my wedding day effortless! Ananya’s airbrush technique didn't budge through 8 hours of dancing and photos. My dupatta was pinned so comfortably I forgot it was heavy. Highly recommended!",
      rating: 5,
      verified: true,
      service: "Imperial Maharani Bridal Package",
    },
    {
      id: "test-2",
      name: "Sneha Kapoor",
      role: "Creative Director",
      occasion: "Balayage & Hair Spa",
      quote:
        "Hands down the best colorist in Bangalore. Priya understood my olive skin tone perfectly and gave me the most delicate, expensive-looking caramel balayage without damaging my curls.",
      rating: 5,
      verified: true,
      service: "French Balayage & Gloss",
    },
    {
      id: "test-3",
      name: "Ayesha Siddiqui",
      role: "Bride's Sister",
      occasion: "Eid & Family Wedding",
      quote:
        "Meera's henna is sheer poetry. The organic cone gave the deepest maroon-black stain within 24 hours with zero chemicals. Booking on the website took under a minute!",
      rating: 5,
      verified: true,
      service: "Rajasthani Heritage Henna",
    },
    {
      id: "test-4",
      name: "Tanvi Deshmukh",
      role: "Architect",
      occasion: "Monthly HydraGlow Routine",
      quote:
        "I’ve been a member for 2 years. The salon is pristine, calm, smells like lavender and jasmine, and the staff treats you like royalty. The online slot booking is silky smooth.",
      rating: 5,
      verified: true,
      service: "HydraGlow Diamond Facial",
    },
  ] as TestimonialItem[],

  stylists: [
    {
      id: "ananya",
      name: "Ananya Sharma",
      role: "Creative Director & Bridal Lead",
      experienceYears: 10,
      specialty: "High-Definition Bridal, Airbrush & Sabyasachi-Style Draping",
      bio: "Trained in London and Mumbai, Ananya has styled over 400 brides across South India with a focus on luminous, skin-like radiance.",
      rating: 4.95,
      bookingSlug: "ananya-sharma",
    },
    {
      id: "priya",
      name: "Priya Nair",
      role: "Senior Hair Alchemist",
      experienceYears: 8,
      specialty: "French Balayage, Textured Bobs & Hair Botoplex",
      bio: "Master of dimensional color and effortless cuts. Priya believes great hair looks just as good waking up as it does walking out of the salon.",
      rating: 4.9,
      bookingSlug: "priya-nair",
    },
    {
      id: "meera",
      name: "Meera Rao",
      role: "Master Henna Artist",
      experienceYears: 12,
      specialty: "Fine-Line Rajasthani & Contemporary Indo-Arabic Henna",
      bio: "Third-generation henna artist who concocts her own 100% natural eucalyptus-infused henna pastes for guaranteed dark stains.",
      rating: 5.0,
      bookingSlug: "meera-rao",
    },
    {
      id: "kavita",
      name: "Kavita Patel",
      role: "Lead Clinical Aesthetician",
      experienceYears: 7,
      specialty: "Korean Glass-Skin, HydraGlow & Lymphatic Drainage",
      bio: "Certified clinical aesthetician passionate about barrier repair and tailored non-invasive facial therapies for all Indian skin types.",
      rating: 4.88,
      bookingSlug: "kavita-patel",
    },
  ] as StylistHighlight[],

  pwa: {
    title: "Experience BEEM on Your Phone",
    subtitle: "Install our Progressive Web App for instant 1-tap bookings, offline appointment cards, and exclusive member flash offers.",
    benefits: [
      "Book appointments in under 30 seconds",
      "Offline access to your upcoming appointment passes",
      "Instant WhatsApp & push reminders 24h before",
      "No App Store download or memory hogging",
    ],
  },

  faqs: [
    {
      question: "How far in advance should I book my bridal makeover?",
      answer: "We recommend booking bridal dates 2 to 6 months in advance, especially for auspicious Muhurtham dates and peak wedding season (October to March). A date is held exclusively once the advance deposit is completed.",
      category: "bridal",
    },
    {
      question: "What is your appointment cancellation and rescheduling policy?",
      answer: "We offer 100% free rescheduling or cancellation up to 4 hours before regular salon appointments. For bridal packages, cancellations made 7+ days prior receive a full deposit refund or free reschedule.",
      category: "booking",
    },
    {
      question: "Do you offer trial makeup sessions?",
      answer: "Yes! All Gold and Platinum bridal packages include a complimentary full trial session where we test foundation matches, eye looks, and hairstyle architecture before your big day.",
      category: "bridal",
    },
    {
      question: "Are your mehendi cones 100% organic and chemical-free?",
      answer: "Absolutely. Our master artist Meera hand-mixes our henna paste fresh each week using certified organic Sojat henna leaves, Nilgiri eucalyptus oil, and lemon juice. We never use black henna (PPD) or harsh synthetic dyes.",
      category: "hygiene",
    },
    {
      question: "Can I pay at the salon or do I have to pay online?",
      answer: "You have complete freedom! You can either pay online via UPI, Credit/Debit cards, and NetBanking, or choose 'Pay at Salon' during checkout to pay after your service is completed.",
      category: "payments",
    },
    {
      question: "Do you offer home visits or venue styling for bridal parties?",
      answer: "Yes, our bridal entourage team travels to wedding venues, five-star hotels, and residences across Bengaluru with portable lighting, professional makeup kits, and hair equipment. Venue distance tiers are transparently calculated at booking.",
      category: "bridal",
    },
  ] as FaqItem[],
};
