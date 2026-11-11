import React from "react";
import { db } from "@/lib/db";
import { Users, Sparkles, Phone, Mail, Heart, AlertCircle } from "lucide-react";

export default async function AdminCustomersPage() {
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      profile: true,
      appointments: {
        include: { items: true },
        orderBy: { date: "desc" },
      },
      memberships: { include: { plan: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">
          Client Directory &amp; Beauty Profiles
        </h1>
        <p className="text-xs text-brand-muted">
          Access client allergy records, hair/skin diagnostic profiles, lifetime spend, and service history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {customers.map((c) => {
          const totalSpend = c.appointments
            .filter((a) => a.status !== "CANCELLED")
            .reduce((sum, a) => sum + a.advancePaid, 0);

          return (
            <div
              key={c.id}
              className="rounded-3xl bg-white dark:bg-[#120822] p-6 border border-purple-100 dark:border-purple-900 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-brand-violet text-white flex items-center justify-center font-bold text-lg">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
                      {c.name}
                    </h3>
                    <p className="text-xs text-brand-muted">{c.email} • {c.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-brand-muted block">Lifetime Spend:</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    ₹{totalSpend.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Beauty Profile Matrix */}
              {c.profile && (
                <div className="p-3.5 rounded-2xl bg-[#FAF7FD] dark:bg-purple-950/40 text-xs space-y-1.5 border border-purple-100 dark:border-purple-900/60">
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-brand-deep dark:text-purple-200">
                    <div className="p-1 rounded-lg bg-white dark:bg-[#150D27]">
                      Skin: {c.profile.skinType || "Normal"}
                    </div>
                    <div className="p-1 rounded-lg bg-white dark:bg-[#150D27]">
                      Hair: {c.profile.hairType || "Wavy"}
                    </div>
                    <div className="p-1 rounded-lg bg-white dark:bg-[#150D27]">
                      Points: {c.loyaltyPoints}
                    </div>
                  </div>

                  {c.profile.allergies && (
                    <div className="flex items-start gap-1.5 text-red-600 text-[11px] font-medium pt-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>Allergies: {c.profile.allergies}</span>
                    </div>
                  )}

                  {c.profile.notes && (
                    <p className="text-[11px] text-brand-muted italic pt-1">
                      Staff Note: &quot;{c.profile.notes}&quot;
                    </p>
                  )}
                </div>
              )}

              {/* Recent Bookings summary */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-muted mb-1.5">
                  Recent Visits ({c.appointments.length}):
                </p>
                {c.appointments.length === 0 ? (
                  <p className="text-xs text-brand-muted italic">No visits recorded yet</p>
                ) : (
                  <div className="space-y-1">
                    {c.appointments.slice(0, 2).map((a) => (
                      <div key={a.id} className="flex justify-between text-xs text-brand-muted">
                        <span className="line-clamp-1">{a.items.map((i) => i.name).join(", ")}</span>
                        <span className="font-semibold text-brand-ink dark:text-white shrink-0">
                          ₹{a.totalAmount}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
