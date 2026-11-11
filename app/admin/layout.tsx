import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Scissors,
  Users,
  UserCheck,
  Package,
  BarChart3,
  Settings,
  Crown,
  LogOut,
  ExternalLink,
  Bell,
} from "lucide-react";
import { getNowInKolkata, formatInKolkata } from "@/lib/timezone";

export const metadata = {
  title: "Admin Sanctuary Control | BEEM (Beauty Empire)",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  const role = (session.user as any)?.role;
  if (role !== "ADMIN" && role !== "STYLIST") {
    redirect("/account");
  }

  const currentTimeKolkata = formatInKolkata(new Date(), "EEEE, MMM dd, yyyy • hh:mm a");

  const navLinks = [
    { href: "/admin", label: "Overview & Analytics", icon: LayoutDashboard },
    { href: "/admin/calendar", label: "Booking Calendar", icon: Calendar },
    { href: "/admin/appointments", label: "All Appointments", icon: Clock },
    { href: "/admin/services", label: "Services CRUD", icon: Scissors },
    { href: "/admin/stylists", label: "Stylists & Schedules", icon: UserCheck },
    { href: "/admin/time-off", label: "Time-Off & Holidays", icon: Calendar },
    { href: "/admin/customers", label: "Customer Database", icon: Users },
    { href: "/admin/inventory", label: "Inventory Tracker", icon: Package },
    { href: "/admin/reports", label: "Reports & CSV Export", icon: BarChart3 },
    { href: "/admin/settings", label: "Salon Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5FC] dark:bg-[#0A0514] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white dark:bg-[#120822] border-r border-purple-100 dark:border-purple-900 flex flex-col justify-between shrink-0 p-4">
        <div>
          {/* Brand */}
          <Link href="/admin" className="flex items-center gap-2 px-2 py-4 mb-4">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-brand-deep to-brand-violet text-brand-softgold flex items-center justify-center shadow-soft">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <span className="font-script text-2xl font-bold text-brand-royal dark:text-brand-orchid leading-none">
                BEEM
              </span>
              <span className="block text-[9px] tracking-widest text-brand-muted uppercase font-semibold">
                Admin Console
              </span>
            </div>
          </Link>

          {/* Links */}
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-brand-ink/80 hover:bg-purple-50 hover:text-brand-violet dark:text-purple-200 dark:hover:bg-purple-950/60 transition-colors"
                >
                  <Icon className="h-4 w-4 text-brand-violet dark:text-brand-orchid shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-purple-100 dark:border-purple-900/60 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-brand-muted hover:text-brand-royal"
          >
            <span>Live Customer Store</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <div className="px-3 py-2 bg-purple-50/60 dark:bg-purple-950/40 rounded-xl text-[11px] text-brand-muted">
            <p className="font-bold text-brand-deep dark:text-white truncate">
              {session.user.name}
            </p>
            <p className="text-[10px] text-brand-violet font-semibold">Administrator</p>
          </div>
        </div>
      </aside>

      {/* Main Admin Viewport */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Admin Header */}
        <header className="h-16 border-b border-purple-100 bg-white/80 dark:border-purple-900 dark:bg-[#120822]/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <Clock className="h-3.5 w-3.5 text-brand-violet" />
            <span>Salon Time (Asia/Kolkata): <strong>{currentTimeKolkata}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              System Live &amp; Operational
            </span>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
