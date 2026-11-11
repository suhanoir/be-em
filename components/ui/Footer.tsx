import React from "react";
import Link from "next/link";
import { Crown, Phone, Mail, MapPin, Clock, Heart, Sparkles } from "lucide-react";
import { getSalonWhatsAppUrl } from "@/lib/notifications";

export function Footer() {
  const whatsappUrl = getSalonWhatsAppUrl();

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "BEEM (Beauty Empire)",
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80",
    "@id": "https://beem.test",
    url: "https://beem.test",
    telephone: "+919876543210",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop 12-14, Luxury Promenade, 100 Feet Road",
      addressLocality: "Indiranagar, Bengaluru",
      postalCode: "560038",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.9784,
      longitude: 77.6408,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "09:00",
        closes: "20:00",
      },
    ],
  };

  return (
    <footer className="border-t border-purple-100 bg-[#FAF7FD] text-brand-ink dark:border-purple-900/60 dark:bg-[#0A0514] dark:text-purple-100 transition-colors">
      {/* JSON-LD LocalBusiness Schema for Google SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Story Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-deep to-brand-violet flex items-center justify-center text-brand-softgold shadow-soft">
                <Crown className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-script text-3xl text-brand-royal dark:text-brand-orchid leading-none font-bold">
                  BEEM
                </span>
                <span className="text-[9px] tracking-[0.2em] font-medium text-brand-muted uppercase">
                  Beauty Empire
                </span>
              </div>
            </Link>
            <p className="text-sm text-brand-muted max-w-md leading-relaxed">
              Bengaluru&apos;s premier destination for luxury haircare, bespoke bridal transformations, 
              organic Rajasthani mehendi artistry, and clinical HydraGlow skin therapies. Dedicated to 
              uncompromising craftsmanship and empowering your authentic radiance.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-sm transition-colors"
              >
                <span>WhatsApp Official</span>
              </a>
              <span className="text-xs text-brand-muted">Valet Parking Available</span>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h3 className="font-heading text-lg font-bold text-brand-deep dark:text-brand-orchid mb-4">
              Signature Services
            </h3>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              <li>
                <Link href="/services#haircut" className="hover:text-brand-violet transition-colors">
                  Signature Haircuts & Blowdry
                </Link>
              </li>
              <li>
                <Link href="/services#hair-color" className="hover:text-brand-violet transition-colors">
                  Sun-Kissed Balayage & Gloss
                </Link>
              </li>
              <li>
                <Link href="/services#facial-and-skin" className="hover:text-brand-violet transition-colors">
                  HydraGlow Oxygen Facials
                </Link>
              </li>
              <li>
                <Link href="/services#makeup" className="hover:text-brand-violet transition-colors">
                  HD Cocktail & Party Makeup
                </Link>
              </li>
              <li>
                <Link href="/bridal" className="hover:text-brand-violet text-amber-700 dark:text-amber-400 font-semibold transition-colors">
                  Royal Bridal Packages
                </Link>
              </li>
              <li>
                <Link href="/mehendi" className="hover:text-brand-violet transition-colors">
                  Artisan Mehendi Catalog
                </Link>
              </li>
            </ul>
          </div>

          {/* Smart Features & Explore */}
          <div>
            <h3 className="font-heading text-lg font-bold text-brand-deep dark:text-brand-orchid mb-4">
              Smart Experience
            </h3>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              <li>
                <Link href="/quiz" className="hover:text-brand-violet flex items-center gap-1.5 transition-colors">
                  <Sparkles className="h-3.5 w-3.5 text-brand-violet" />
                  AI Style Quiz
                </Link>
              </li>
              <li>
                <Link href="/try-on" className="hover:text-brand-violet transition-colors">
                  Virtual Try-On Studio
                </Link>
              </li>
              <li>
                <Link href="/lookboard" className="hover:text-brand-violet transition-colors">
                  Inspiration Look Board
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-brand-violet transition-colors">
                  Offers & Promo Codes
                </Link>
              </li>
              <li>
                <Link href="/memberships" className="hover:text-brand-violet transition-colors">
                  Memberships & Gift Cards
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-brand-violet transition-colors">
                  Verified Client Reviews
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-brand-violet transition-colors">
                  Beauty Blog & Care Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="font-heading text-lg font-bold text-brand-deep dark:text-brand-orchid mb-4">
              Visit Our Sanctuary
            </h3>
            <div className="space-y-3 text-sm text-brand-muted">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-violet mt-0.5 shrink-0" />
                <span>Shop 12-14, Luxury Promenade, 100 Feet Rd, Indiranagar, Bengaluru 560038</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-brand-violet shrink-0" />
                <span>Mon - Sun: 09:00 AM - 08:00 PM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-violet shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-violet shrink-0" />
                <span>contact@beem.test</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-purple-200/50 dark:border-purple-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <p>© {new Date().getFullYear()} BEEM (Beauty Empire). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-brand-violet">About Us</Link>
            <Link href="/contact" className="hover:text-brand-violet">Contact</Link>
            <Link href="/login" className="hover:text-brand-violet">Client Portal</Link>
            <Link href="/admin" className="text-purple-600 dark:text-purple-400 hover:underline">
              Staff & Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
