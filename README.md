# BEEM (Beauty Empire) — Luxury Salon, Bridal & Mehendi Web Application

**BEEM (Beauty Empire)** is an ultra-luxurious, production-grade beauty salon web application and PWA engineered for modern salons offering precision haircuts, bespoke hair styling & balayage, clinical HydraGlow facials, royal bridal trousseau makeovers, and heirloom organic Rajasthani mehendi artistry.

---

## ✨ Key Highlights

- **Under-60-Second Booking Engine**: 4-step wizard with real-time slot generation in `Asia/Kolkata` timezone, conflict prevention, and past-time buffers.
- **Zero-Key Out-Of-The-Box Execution**: Includes an automatic **Mock Payment Mode** (simulates Razorpay card, netbanking & UPI), and an intelligent **Rule-Based Beauty Concierge** that falls back seamlessly when `ANTHROPIC_API_KEY` is not present.
- **Imperial Bridal Section**: 3 bespoke tiers (*Silver Radiance*, *Gold Empress*, *Diamond Imperial*), interactive multi-person entourage calculator with group discounts, date hold advance protection, and venue travel surcharge tiers.
- **Organic Mehendi Catalog**: 100% natural dark-stain Sojat henna designs filterable by style (*Arabic*, *Rajasthani*, *Indo-Arabic*, *Minimal*, *Bridal Full-hand*, *Kids*).
- **Interactive Style Quiz**: Diagnostic beauty blueprint evaluating face shape, skin undertone, and lifestyle demands.
- **Virtual Try-On Studio**: Client-side AR canvas simulator for selfie uploads and balayage/rose-gold hair color previewing.
- **Customer Account & Beauty Profile**: Tracks allergies, hair/skin diagnostics, loyalty points (10% cash back per spend), referral codes (+200 points), and printable tax invoices.
- **Full-Featured Admin Dashboard (`/admin`)**:
  - Live revenue trajectory and service popularity charts (Recharts)
  - Interactive appointment calendar with quick status actions (*Confirm*, *Complete*, *Cancel*, *No-Show*)
  - Full CRUD for services, packages, mehendi designs, and stylists
  - Low-stock inventory alert banners with 1-click restocking
  - Audited reports with one-click **CSV Export**
  - Time-off and salon-wide holiday date blocking
- **PWA Ready**: Manifest, responsive mobile layout (360px, 768px, 1280px), service worker offline support, and installable app capabilities.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router) + TypeScript (Strict)
- **Styling**: Tailwind CSS + Custom CSS Variables + Cormorant Garamond & Inter Typography
- **Database & ORM**: Prisma ORM with SQLite for development (easily switchable to PostgreSQL by updating datasource provider in `prisma/schema.prisma`)
- **Authentication**: NextAuth.js (Email/Password with bcrypt + Phone OTP mock + Session claims)
- **Payments**: Razorpay with automatic Mock Payment Gateway fallback
- **Charts**: Recharts
- **Testing**: Vitest unit & integration test suites
- **Validation**: Zod + React Hook Form

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (tested on Node v24.17.0)
- npm 9+

### 2. Clone & Install
```bash
git clone <repository-url>
cd "BEEM (Beauty Empire)"
npm install
```

### 3. Database Initialization & Seeding
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Logins

| Role | Email | Password | Phone OTP Code |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@beem.test` | `Admin@123` | - |
| **Customer** | `customer@beem.test` | `Customer@123` | `123456` |

*Note: The login screen also features 1-click Demo buttons for instant sign-in.*

---

## ⚙️ Environment Variables (`.env`)

The application comes preconfigured to run out of the box with zero keys:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="beem-beauty-empire-super-secret-key-2026-secure"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Razorpay Payments (Mock mode triggers when empty)
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
NEXT_PUBLIC_RAZORPAY_KEY_ID=""

# Optional: Anthropic Claude for AI Concierge (Rule-based bot triggers when empty)
ANTHROPIC_API_KEY=""

# Optional: Cloudinary Media Storage
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Salon Information
NEXT_PUBLIC_SALON_WHATSAPP="+919876543210"
NEXT_PUBLIC_SALON_PHONE="+919876543210"
NEXT_PUBLIC_SALON_EMAIL="contact@beem.test"
NEXT_PUBLIC_SALON_ADDRESS="Shop 12-14, Luxury Promenade, 100 Feet Road, Indiranagar, Bengaluru 560038"
```

---

## 🧪 Running Automated Tests

Run the full test suite covering slot calculations, pricing, discounts, distance surcharges, and double-booking prevention:

```bash
npm test
```

Run end-to-end database & transaction verification:
```bash
npx tsx scripts/test-e2e-api.ts
```

Run production build check:
```bash
npm run build
```

---

## 🏛️ Project Directory Structure

```
├── app/
│   ├── (public)/         # Public landing, services, bridal, mehendi, gallery, quiz, try-on, lookboard
│   ├── (account)/        # Client portal, beauty profile, login, register
│   ├── admin/            # Admin console, analytics, calendar, inventory, reports
│   ├── api/              # RESTful API routes (appointments, slots, chat, promo, reviews)
│   ├── layout.tsx        # Cormorant & Inter typography, theme provider, sticky contact
│   └── globals.css       # Tailwind directives, print stylesheets for invoices
├── components/
│   ├── features/         # BookingWizard, VirtualTryOn, StyleQuiz, AdminDashboard, AIChatbot
│   ├── providers/        # SessionProvider & ThemeProvider
│   └── ui/               # Navbar, Footer, StickyContactButtons
├── lib/
│   ├── auth.ts           # NextAuth credentials & OTP handlers
│   ├── db.ts             # Prisma singleton instance
│   ├── notifications.ts  # WhatsApp link builder & server notification logger
│   ├── payments.ts       # Razorpay client & Mock Payment Engine
│   ├── pricing.ts        # Pricing calculations, promo codes, distance tiers, loyalty
│   ├── slots.ts          # Asia/Kolkata slot generator & collision detector
│   ├── timezone.ts       # Date and timezone helpers
│   └── validators.ts     # Zod validation schemas
├── prisma/
│   ├── schema.prisma     # 31 Prisma models with relations and indexes
│   └── seed.ts           # Realistic seed script
├── public/
│   ├── icon.svg          # Royal purple & gold logo emblem
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Offline caching service worker
└── tests/
    ├── double-booking.test.ts
    ├── pricing.test.ts
    └── slots.test.ts
```

---

## 📄 License
BEEM (Beauty Empire) proprietary software. Crafted with passion for luxury salon experiences.
