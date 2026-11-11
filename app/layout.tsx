import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Great_Vibes } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { StickyContactButtons } from "@/components/ui/StickyContactButtons";
import { AIChatbotWidget } from "@/components/features/AIChatbotWidget";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BEEM (Beauty Empire) | Luxury Salon, Bridal Makeover & Mehendi Artistry",
  description:
    "Indulge in Bengaluru's finest beauty sanctuary. Specializing in bespoke haircuts, balayage, HydraGlow facials, royal bridal packages, and organic Rajasthani henna.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "BEEM (Beauty Empire) - Luxury Beauty Parlor",
    description:
      "Signature Haircuts, Balayage, Royal Bridal Packages, and Organic Henna Artistry in Indiranagar, Bengaluru.",
    url: "https://beem.test",
    siteName: "BEEM (Beauty Empire)",
    images: [
      {
        url: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "BEEM Luxury Beauty Sanctuary",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${greatVibes.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-purple-200 selection:text-purple-900 dark:selection:bg-purple-900 dark:selection:text-purple-100">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <StickyContactButtons />
          <AIChatbotWidget />
        </Providers>
      </body>
    </html>
  );
}
