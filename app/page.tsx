import React from "react";
import type { Metadata } from "next";
import { BrandIntroOverlay } from "@/components/landing/BrandIntroOverlay";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarqueeStrip } from "@/components/landing/MarqueeStrip";
import { IntroStatsSection } from "@/components/landing/IntroStatsSection";
import { ServicesShowcase } from "@/components/landing/ServicesShowcase";
import { BridalSpotlight } from "@/components/landing/BridalSpotlight";
import { MehendiShowcase } from "@/components/landing/MehendiShowcase";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SmartFeaturesSection } from "@/components/landing/SmartFeaturesSection";
import { LoyaltyOffersSection } from "@/components/landing/LoyaltyOffersSection";
import { BeforeAfterSection } from "@/components/landing/BeforeAfterSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { StylistsSection } from "@/components/landing/StylistsSection";
import { PwaInstallSection } from "@/components/landing/PwaInstallSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { MobileStickyBar } from "@/components/landing/MobileStickyBar";
import { ScrollToTop } from "@/components/landing/ScrollToTop";

export const metadata: Metadata = {
  title: "BEEM (Beauty Empire) | Luxury Salon, Bridal Makeover & Mehendi Artistry",
  description:
    "Where Every Look Becomes Royal. Indiranagar, Bengaluru's premier beauty sanctuary for bespoke haircuts, French balayage, HydraGlow facials, royal bridal couture, and organic Rajasthani henna.",
  openGraph: {
    title: "BEEM (Beauty Empire) | Luxury Beauty Sanctuary",
    description:
      "Where Every Look Becomes Royal. Book your luxury haircut, bridal makeover, or organic mehendi in under 60 seconds.",
    url: "https://beem.test",
    siteName: "BEEM (Beauty Empire)",
    images: [
      {
        url: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "BEEM Beauty Empire Salon",
      },
    ],
  },
};

export default function LandingPage() {
  return (
    <div id="main-content" className="flex flex-col min-h-screen">
      {/* 1. Fast Initial Logo Draw Intro (Skipped on repeat visits or reduced motion) */}
      <BrandIntroOverlay />

      {/* 2. Full-Height 100svh Hero with Staggered Word Reveal & Arch Canvas */}
      <HeroSection />

      {/* 3. Smooth Infinite Marquee Strip */}
      <MarqueeStrip />

      {/* 4. "What is BEEM" & Animated Viewport Counters */}
      <IntroStatsSection />

      {/* 5. Services Showcase Grid & Mobile Carousel */}
      <ServicesShowcase />

      {/* 6. Gold-Accented Bridal Ceremony Packages & Advance Date Hold */}
      <BridalSpotlight />

      {/* 7. Organic Rajasthani & Arabic Mehendi Catalog with Micro-Saves */}
      <MehendiShowcase />

      {/* 8. 4-Step Animated Booking Journey */}
      <HowItWorksSection />

      {/* 9. Smart Innovations: Try-On, Style Quiz, Concierge, Look Board */}
      <SmartFeaturesSection />

      {/* 10. Loyalty Rewards Circle & Active Festival Coupons */}
      <LoyaltyOffersSection />

      {/* 11. Interactive Before/After Comparison Slider & Gallery */}
      <BeforeAfterSection />

      {/* 12. Auto-Playing 4.9-Star Verified Client Testimonials */}
      <TestimonialsSection />

      {/* 13. Meet the Master Stylists */}
      <StylistsSection />

      {/* 14. Zero-Overhead PWA Installation Guide */}
      <PwaInstallSection />

      {/* 15. Accessible Frequently Asked Questions Accordion */}
      <FaqSection />

      {/* 16. Royal Final Call-to-Action */}
      <FinalCtaSection />

      {/* 17. Sticky Mobile Action Bar (Scroll-triggered) */}
      <MobileStickyBar />

      {/* 18. Scroll to Top Floating Trigger */}
      <ScrollToTop />
    </div>
  );
}
