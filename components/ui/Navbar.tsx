"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Sparkles,
  Calendar,
  User as UserIcon,
  Sun,
  Moon,
  Crown,
  Heart,
  Flower2,
  Wand2,
  Camera,
  LogOut,
  ChevronDown,
  Phone,
} from "lucide-react";
import { useTheme } from "@/components/providers/Providers";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const loyaltyPoints = (session?.user as any)?.loyaltyPoints || 0;

  const navLinks = [
    { href: "/services", label: "Services" },
    { href: "/bridal", label: "Bridal", highlight: true },
    { href: "/mehendi", label: "Mehendi" },
    { href: "/gallery", label: "Gallery" },
    { href: "/stylists", label: "Stylists" },
    { href: "/quiz", label: "Style Quiz", icon: Wand2 },
    { href: "/try-on", label: "Try-On", icon: Camera },
    { href: "/offers", label: "Offers" },
    { href: "/contact", label: "Contact" },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Skip to Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-royal focus:text-white focus:rounded-xl focus:shadow-glow focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 border-b ${
          scrolled
            ? "border-purple-200/50 bg-white/80 backdrop-blur-xl shadow-soft dark:border-purple-900/50 dark:bg-[#0F081D]/85"
            : "border-purple-100/60 bg-white/95 backdrop-blur-md dark:border-purple-900/40 dark:bg-[#0F081D]/90"
        }`}
      >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={closeMenu}>
          <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-brand-deep via-brand-royal to-brand-violet flex items-center justify-center text-brand-softgold shadow-soft group-hover:scale-105 transition-transform">
            <Crown className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-script text-3xl sm:text-4xl text-brand-royal dark:text-brand-orchid leading-none font-bold tracking-wide">
              BEEM
            </span>
            <span className="text-[10px] tracking-[0.25em] font-medium text-brand-muted uppercase -mt-0.5">
              Beauty Empire
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "text-brand-violet font-semibold dark:text-brand-orchid"
                    : link.highlight
                    ? "text-amber-700 dark:text-amber-400 font-semibold hover:text-amber-800"
                    : "text-brand-ink/80 hover:text-brand-violet dark:text-purple-200 dark:hover:text-white"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {link.label}
                {link.highlight && (
                  <span className="inline-block px-1.5 py-0.2 text-[9px] font-bold text-amber-900 bg-amber-100 rounded-full dark:bg-amber-900/60 dark:text-amber-200">
                    Royal
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-violet rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-xl text-brand-muted hover:text-brand-violet hover:bg-brand-lavender/50 dark:hover:bg-purple-950 transition-colors"
          >
            {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* User Account / Auth Dropdown */}
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-purple-200 bg-brand-lavender/40 hover:bg-brand-lavender text-sm font-medium text-brand-deep dark:border-purple-800 dark:bg-purple-950/60 dark:text-purple-200 transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-brand-violet text-white flex items-center justify-center text-xs font-bold">
                  {session.user.name?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">
                  {session.user.name?.split(" ")[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-brand-muted" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-purple-100 text-sm dark:bg-[#1A102F] dark:border-purple-900 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-purple-50 dark:border-purple-900/60">
                    <p className="font-semibold text-brand-ink dark:text-white truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-brand-muted truncate">{session.user.email}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{loyaltyPoints} Loyalty Points</span>
                    </div>
                  </div>

                  <Link
                    href="/account"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-ink hover:bg-brand-lavender/60 dark:text-purple-200 dark:hover:bg-purple-900/40 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-brand-violet" />
                    My Account & Bookings
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-brand-deep font-semibold bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-brand-orchid dark:hover:bg-purple-900/60 transition-colors"
                    >
                      <Crown className="h-4 w-4 text-amber-500" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-brand-royal hover:text-brand-violet dark:text-brand-orchid px-2 py-1.5"
            >
              Sign In
            </Link>
          )}

          {/* Book Now Primary Button */}
          <Link
            href="/book"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-brand-royal via-brand-violet to-purple-600 text-white text-xs sm:text-sm font-semibold shadow-soft hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Calendar className="h-4 w-4" />
            <span>Book Now</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl text-brand-ink hover:bg-brand-lavender/50 dark:text-white dark:hover:bg-purple-950 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-purple-100 bg-white/95 px-4 pt-3 pb-6 dark:border-purple-900 dark:bg-[#0F081D]/95 backdrop-blur-lg">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium text-brand-ink hover:bg-brand-lavender/60 dark:text-purple-200 dark:hover:bg-purple-900/40"
                >
                  <span className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-brand-violet" />}
                    {link.label}
                  </span>
                  {link.highlight && (
                    <span className="px-2 py-0.5 text-xs font-bold text-amber-900 bg-amber-100 rounded-full">
                      Royal
                    </span>
                  )}
                </Link>
              );
            })}
            <div className="border-t border-purple-100 pt-3 mt-1 flex flex-col gap-2">
              <Link
                href="/about"
                onClick={closeMenu}
                className="px-3 py-2 text-sm text-brand-muted hover:text-brand-royal"
              >
                About Our Empire
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="px-3 py-2 text-sm text-brand-muted hover:text-brand-royal"
              >
                Location & Hours
              </Link>
              <Link
                href="/memberships"
                onClick={closeMenu}
                className="px-3 py-2 text-sm text-brand-muted hover:text-brand-royal"
              >
                Memberships & Gift Cards
              </Link>
            </div>
          </nav>
        </div>
      )}
      </header>
    </>
  );
}
