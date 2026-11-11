import { NextResponse } from "next/server";
import { chatMessageSchema } from "@/lib/validators";

const SALON_KNOWLEDGE = `
You are the AI Beauty Concierge for "BEEM (Beauty Empire)", a luxury beauty parlor in Indiranagar, Bengaluru.
Tone: Warm, luxurious, polite, knowledgeable, and helpful.
Location: Shop 12-14, Luxury Promenade, 100 Feet Road, Indiranagar, Bengaluru 560038.
Phone/WhatsApp: +91 98765 43210
Opening Hours: 09:00 AM to 08:00 PM daily.

Top Services & Pricing:
- Signature Haircut & Blowdry: ₹1,299 (45 mins)
- Layered Butterfly Cut: ₹1,699 (60 mins)
- Sun-Kissed Balayage & Gloss: ₹4,899 (150 mins)
- HydraGlow Oxygen Luxury Facial: ₹2,999 (75 mins)
- 24K Gold Imperial Radiance Facial: ₹4,299 (90 mins)
- Party Glam HD Makeup: ₹2,599 (60 mins)
- Gel Extensions & Nail Art: ₹2,199 (90 mins)
- Rica Italian White Chocolate Wax: ₹2,499 (75 mins)
- Intricate Arabic Henna: ₹1,299 (60 mins)

Bridal Packages:
- Silver Radiance: ₹14,999 (3.5 hrs, Pre-bridal, HD makeup, hair, draping)
- Gold Empress Luxury: ₹29,999 (5 hrs, Airbrush makeup, trial included, 24K gold facial, henna)
- Diamond Imperial Royal: ₹49,999 (8 hrs, 3 event looks, home/venue visit within 25km, celebrity artist Priya)

Master Stylists:
- Aisha Sharma (Hair Creative Director, precision cuts & balayage)
- Priya Kapoor (Celebrity Bridal Artist & Skincare Alchemist)
- Fatima Noor (Royal Mehendi Artisan)
- Natasha Rao (CIDESCO Esthetician & Sculpted Nails)

Active Coupons:
- WELCOME10: 10% off first visit
- BRIDAL2026: ₹2,000 off bridal packages
- DIWALI500: ₹500 off festive grooming
`;

function getRuleBasedResponse(userQuery: string): string {
  const q = userQuery.toLowerCase();

  if (q.includes("bridal") || q.includes("wedding") || q.includes("trousseau") || q.includes("dulhan")) {
    return "✨ Our Royal Bridal Lounge offers 3 tiers:\n• **Silver Radiance (₹14,999)**: Essential wedding day glam & pre-bridal cleanup.\n• **Gold Empress (₹29,999)**: Our most coveted airbrush bridal look with complimentary trial makeup.\n• **Diamond Imperial (₹49,999)**: Complete 3-event royal trousseau with on-venue VIP artist team.\n\nWould you like to explore our bridal packages or book a consultation trial?";
  }

  if (q.includes("mehendi") || q.includes("henna") || q.includes("mehndi")) {
    return "🌸 Master Artisan Fatima Noor creates bespoke 100% natural Sojat henna designs:\n• Minimalist Lace & Cuffs: from ₹899\n• Intricate Arabic Vines: ₹1,299\n• Indo-Arabic & Rajasthani Mandalas: from ₹2,499\n• Royal Bridal Full-Hand: from ₹4,999\n\nAll our henna uses organic herbal cones guaranteeing deep mahogany stains!";
  }

  if (q.includes("haircut") || q.includes("hair cut") || q.includes("styling") || q.includes("hair")) {
    return "💇‍♀️ Our Creative Director Aisha Sharma specializes in face-flattering cuts:\n• BEEM Signature Haircut & Blowdry: ₹1,299\n• Layered Butterfly Cut: ₹1,699\n• Sun-Kissed Balayage with Olaplex: ₹4,899\n• Deep Scalp Detox & Keratin Spa: ₹1,699\n\nAll cuts include a personalized face-shape consultation & styling session!";
  }

  if (q.includes("facial") || q.includes("skin") || q.includes("glow") || q.includes("hydra")) {
    return "🌟 For an irresistible glass-skin glow, we recommend:\n• **HydraGlow Oxygen Facial (₹2,999)**: 6-step deep extraction & cryo-globe infusion.\n• **24K Gold Imperial Facial (₹4,299)**: Pure 24K gold leaf & collagen boost.\n\nBoth are gentle, non-invasive, and deliver immediate radiant results!";
  }

  if (q.includes("price") || q.includes("cost") || q.includes("rate") || q.includes("menu")) {
    return "💎 Here is a quick snapshot of our most loved services:\n• Signature Haircut: ₹1,299\n• HydraGlow Facial: ₹2,999\n• Party Glam Makeup: ₹2,599\n• Gel Extensions: ₹2,199\n• Arabic Mehendi: ₹1,299\n• Bridal Packages: ₹14,999 - ₹49,999\n\nYou can also use coupon **WELCOME10** for 10% off your first appointment!";
  }

  if (q.includes("discount") || q.includes("offer") || q.includes("coupon") || q.includes("promo")) {
    return "🎉 Here are today's exclusive offers:\n• **WELCOME10**: 10% off first visit (min ₹999)\n• **BRIDAL2026**: Flat ₹2,000 off Bridal Packages\n• **DIWALI500**: ₹500 off festive grooming\n• Earn **10% Loyalty Cash points** automatically on every service!";
  }

  if (q.includes("time") || q.includes("hour") || q.includes("open") || q.includes("sunday")) {
    return "⏰ BEEM is open all 7 days from **09:00 AM to 08:00 PM**.\nWe recommend booking 24 hours in advance, especially for weekend slots and bridal trials.";
  }

  if (q.includes("where") || q.includes("location") || q.includes("address") || q.includes("direction")) {
    return "📍 We are located at:\n**Shop 12-14, Luxury Promenade, 100 Feet Road, Indiranagar, Bengaluru 560038**\n(Valet parking & private bridal suites available).";
  }

  if (q.includes("book") || q.includes("appointment") || q.includes("slot")) {
    return "📅 You can book right away! Tap the **'Book Now'** button at the top to choose your service, select your favorite stylist or 'Any Available', pick a convenient time slot, and confirm in under 60 seconds!";
  }

  return "✨ Welcome to BEEM (Beauty Empire)! I can help you with:\n1. Recommending haircuts, facials, or makeup for your face shape\n2. Bridal packages and wedding date availability\n3. Mehendi designs and dark stain tips\n4. Booking an appointment or applying discount codes\n\nHow may I pamper you today?";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = chatMessageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid chat payload" }, { status: 400 });
    }

    const messages = result.data.messages;
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Intelligent Rule-Based Fallback
      const reply = getRuleBasedResponse(lastUserMessage);
      return NextResponse.json({
        reply,
        model: "BEEM Rule-Based Beauty Concierge (Offline Mode)",
      });
    }

    // Call Anthropic API if key is provided
    try {
      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 500,
          system: SALON_KNOWLEDGE,
          messages: messages.map((m) => ({
            role: m.role === "system" ? "assistant" : m.role,
            content: m.content,
          })),
        }),
      });

      if (!anthropicRes.ok) {
        throw new Error(`Anthropic error: ${anthropicRes.statusText}`);
      }

      const data = await anthropicRes.json();
      const reply = data.content?.[0]?.text || getRuleBasedResponse(lastUserMessage);
      return NextResponse.json({ reply, model: "Claude 3 Haiku" });
    } catch (apiErr) {
      console.warn("Anthropic API failed, falling back to rule-based:", apiErr);
      const reply = getRuleBasedResponse(lastUserMessage);
      return NextResponse.json({ reply, model: "BEEM Beauty Concierge (Fallback)" });
    }
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Chat service unavailable", message: error.message }, { status: 500 });
  }
}
