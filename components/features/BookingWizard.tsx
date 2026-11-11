"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Calendar as CalendarIcon,
  Clock,
  Check,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Crown,
  Sparkles,
  CreditCard,
  Building,
  Tag,
  AlertCircle,
  Users,
  MapPin,
  QrCode,
  Upload,
  Copy,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import QRCode from "qrcode";
import { formatInKolkata, getNowInKolkata } from "@/lib/timezone";

interface ServiceItem {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  discountedPrice?: number | null;
  image: string | null;
  category: { name: string };
}

interface BridalPkg {
  id: string;
  name: string;
  price: number;
  advanceDeposit: number;
  durationHours: number;
  image: string | null;
}

interface MehendiDes {
  id: string;
  title: string;
  price: number;
  estimatedTime: string;
  image: string;
}

interface Stylist {
  id: string;
  name: string;
  specialties: string;
  avatar: string | null;
  rating: number;
}

export function BookingWizard({
  services,
  bridalPackages,
  mehendiDesigns,
  stylists,
  initialParams,
}: {
  services: ServiceItem[];
  bridalPackages: BridalPkg[];
  mehendiDesigns: MehendiDes[];
  stylists: Stylist[];
  initialParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const { data: session } = useSession();

  // Wizard state: Step 1 to 4
  const [currentStep, setCurrentStep] = useState(1);

  // Selected Items
  const [selectedServices, setSelectedServices] = useState<string[]>(() => {
    const s = initialParams.service;
    if (typeof s === "string") return [s];
    return [];
  });
  const [selectedBridal, setSelectedBridal] = useState<string | null>(() => {
    const b = initialParams.bridal;
    return typeof b === "string" ? b : null;
  });
  const [selectedMehendi, setSelectedMehendi] = useState<string | null>(() => {
    const m = initialParams.mehendi;
    return typeof m === "string" ? m : null;
  });

  // Selected Stylist: "any" or stylist ID
  const [selectedStylistId, setSelectedStylistId] = useState<string>(() => {
    const st = initialParams.stylist;
    return typeof st === "string" ? st : "any";
  });

  // Selected Date: "YYYY-MM-DD"
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  });

  // Slots fetched from API
  const [slots, setSlots] = useState<{ time: string; endTime: string; isAvailable: boolean; reason?: string }[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Customer Contact Details
  const [customerName, setCustomerName] = useState(session?.user?.name || "");
  const [customerPhone, setCustomerPhone] = useState((session?.user as any)?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(session?.user?.email || "");
  const [notes, setNotes] = useState("");

  // Promo Code
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState("");

  // Payment Option & Verification State
  const [paymentChoice, setPaymentChoice] = useState<"SALON" | "UPI">("SALON");
  const [payDepositChoice, setPayDepositChoice] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [upiQrDataUrl, setUpiQrDataUrl] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [hpWebsite, setHpWebsite] = useState("");
  const [formTimestamp, setFormTimestamp] = useState<number>(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Update customer fields when session loads
  useEffect(() => {
    const user = session?.user;
    if (user) {
      const uName = user.name || "";
      const uEmail = user.email || "";
      const uPhone = (user as any).phone || "";
      setCustomerName((prev: string) => prev || uName);
      setCustomerEmail((prev: string) => prev || uEmail);
      if (uPhone) {
        setCustomerPhone((prev: string) => prev || uPhone);
      }
    }
  }, [session]);

  // Total duration calculation
  const totalDurationMinutes = React.useMemo(() => {
    let dur = 0;
    for (const sid of selectedServices) {
      const s = services.find((x) => x.id === sid);
      if (s) dur += s.durationMinutes;
    }
    if (selectedBridal) {
      const b = bridalPackages.find((x) => x.id === selectedBridal);
      if (b) dur += Math.round(b.durationHours * 60);
    }
    if (selectedMehendi) {
      dur += 60; // standard mehendi baseline
    }
    return Math.max(30, dur);
  }, [selectedServices, selectedBridal, selectedMehendi, services, bridalPackages]);

  // Base items list
  const selectedItemsList = React.useMemo(() => {
    const list: {
      serviceId?: string;
      bridalPackageId?: string;
      mehendiDesignId?: string;
      name: string;
      price: number;
      durationMinutes: number;
    }[] = [];

    for (const sid of selectedServices) {
      const s = services.find((x) => x.id === sid);
      if (s) {
        list.push({
          serviceId: s.id,
          name: s.name,
          price: s.discountedPrice || s.price,
          durationMinutes: s.durationMinutes,
        });
      }
    }

    if (selectedBridal) {
      const b = bridalPackages.find((x) => x.id === selectedBridal);
      if (b) {
        list.push({
          bridalPackageId: b.id,
          name: b.name,
          price: b.price,
          durationMinutes: Math.round(b.durationHours * 60),
        });
      }
    }

    if (selectedMehendi) {
      const m = mehendiDesigns.find((x) => x.id === selectedMehendi);
      if (m) {
        list.push({
          mehendiDesignId: m.id,
          name: m.title,
          price: m.price,
          durationMinutes: 60,
        });
      }
    }

    return list;
  }, [selectedServices, selectedBridal, selectedMehendi, services, bridalPackages, mehendiDesigns]);

  // Base price
  const baseSubtotal = selectedItemsList.reduce((sum, item) => sum + item.price, 0);

  // Discount calculation
  const discountAmount = appliedPromo?.discountAmount || 0;
  const finalTotal = Math.max(0, baseSubtotal - discountAmount);

  // Deposit calculation
  const bridalPkg = bridalPackages.find((b) => b.id === selectedBridal);
  const depositAmount = bridalPkg ? bridalPkg.advanceDeposit : Math.round(finalTotal * 0.25);

  // Fetch slots whenever Date, Duration, or Stylist changes
  useEffect(() => {
    if (!selectedDate) return;

    let isMounted = true;
    setIsLoadingSlots(true);
    setSelectedSlot(null);

    fetch(`/api/slots?date=${selectedDate}&duration=${totalDurationMinutes}&stylistId=${selectedStylistId}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.slots) {
            setSlots(data.slots);
          } else {
            setSlots([]);
          }
          setIsLoadingSlots(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Slots fetch error:", err);
          setIsLoadingSlots(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, totalDurationMinutes, selectedStylistId]);

  // Toggle service selection
  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Payable amount based on deposit selection
  const payableAmount = payDepositChoice && selectedBridal ? depositAmount : finalTotal;
  const salonUpiId = "beem.luxury@upi";
  const salonPayeeName = "BEEM Beauty Empire";

  // Build standard UPI URL
  const upiUrl = React.useMemo(() => {
    if (payableAmount <= 0) return "";
    const note = encodeURIComponent(`BEEM Salon Booking`);
    return `upi://pay?pa=${encodeURIComponent(salonUpiId)}&pn=${encodeURIComponent(
      salonPayeeName
    )}&am=${payableAmount.toFixed(2)}&cu=INR&tn=${note}`;
  }, [payableAmount]);

  // Generate local QR code whenever UPI is active
  useEffect(() => {
    if (paymentChoice === "UPI" && upiUrl) {
      QRCode.toDataURL(upiUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: "#4C1D95",
          light: "#FFFFFF",
        },
      })
        .then((url) => setUpiQrDataUrl(url))
        .catch((err) => console.error("QR generation failed", err));
    }
  }, [paymentChoice, upiUrl]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(salonUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleUploadScreenshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setBookingError("Screenshot exceeds 5MB size limit");
      return;
    }

    setIsUploadingScreenshot(true);
    setBookingError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.error || "Failed to upload screenshot");
      } else {
        setScreenshotUrl(data.url);
      }
    } catch (err: any) {
      setBookingError(err.message || "Failed to upload file");
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  // Promo code validation
  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setPromoError("");

    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCodeInput, cartTotal: baseSubtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.error || "Invalid promo code");
      } else {
        setAppliedPromo(data);
      }
    } catch (err: any) {
      setPromoError("Failed to apply promo");
    }
  };

  // Final Submit
  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      setBookingError("Please select a time slot");
      return;
    }
    if (!customerName || !customerPhone || !customerEmail) {
      setBookingError("Please fill in your name, phone number, and email");
      return;
    }

    if (paymentChoice === "UPI") {
      const cleanUtr = utrNumber.trim();
      if (!cleanUtr || cleanUtr.length !== 12) {
        setBookingError("Please enter the 12-digit UPI Reference Number (UTR) from your payment app after completing the transaction.");
        return;
      }
    }

    setIsSubmitting(true);
    setBookingError("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail,
          stylistId: selectedStylistId === "any" ? null : selectedStylistId,
          date: selectedDate,
          startTime: selectedSlot,
          items: selectedItemsList,
          isBridal: Boolean(selectedBridal),
          notes,
          promoCode: appliedPromo?.code,
          payDepositOnly: payDepositChoice && Boolean(selectedBridal),
          paymentMethod: paymentChoice,
          utrNumber: paymentChoice === "UPI" ? utrNumber.trim() : undefined,
          screenshotUrl: screenshotUrl || undefined,
          hp_website: hpWebsite,
          formTimestamp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBookingError(data.message || data.error || "Booking failed");
        setIsSubmitting(false);
      } else {
        router.push(`/booking/confirmation/${data.appointment.id}`);
      }
    } catch (err: any) {
      setBookingError(err.message || "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 4-Step Progress Indicator */}
      <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-4 sm:p-6 border border-purple-100 dark:border-purple-900 shadow-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { step: 1, label: "Services" },
            { step: 2, label: "Stylist" },
            { step: 3, label: "Date & Slot" },
            { step: 4, label: "Confirm & Pay" },
          ].map((item, idx) => (
            <React.Fragment key={item.step}>
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => {
                  if (item.step < currentStep || selectedItemsList.length > 0) {
                    setCurrentStep(item.step);
                  }
                }}
              >
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    currentStep === item.step
                      ? "bg-brand-violet text-white shadow-glow scale-110"
                      : currentStep > item.step
                      ? "bg-emerald-600 text-white"
                      : "bg-purple-100 text-brand-muted dark:bg-purple-950 dark:text-purple-400"
                  }`}
                >
                  {currentStep > item.step ? <Check className="h-4 w-4" /> : item.step}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 ${
                    currentStep === item.step
                      ? "text-brand-royal dark:text-brand-orchid"
                      : "text-brand-muted"
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {idx < 3 && (
                <div
                  className={`h-0.5 flex-1 mx-2 transition-all ${
                    currentStep > idx + 1 ? "bg-emerald-500" : "bg-purple-100 dark:bg-purple-900"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Step Panel */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#1A102F] p-6 sm:p-8 border border-purple-100 dark:border-purple-900 shadow-sm">
          {/* STEP 1: CHOOSE SERVICES / PACKAGES */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-ink dark:text-white">
                  Step 1: Select Your Treatment(s)
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted mt-1">
                  You can select multiple treatments or choose a bridal/mehendi specialty.
                </p>
              </div>

              {/* Bridal Highlight Banner if none selected */}
              {!selectedBridal && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/60 dark:from-amber-950/40 dark:to-purple-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        Planning a Wedding Look?
                      </p>
                      <p className="text-[11px] text-amber-800/80 dark:text-amber-300">
                        Explore our Silver, Gold, and Royal Imperial Bridal Packages.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedBridal(bridalPackages[1]?.id || bridalPackages[0]?.id)}
                    className="px-3 py-1.5 rounded-full bg-amber-500 text-brand-ink text-xs font-bold hover:bg-amber-400"
                  >
                    Select Bridal
                  </button>
                </div>
              )}

              {/* If Bridal Selected */}
              {selectedBridal && (
                <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border-2 border-amber-400">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300">
                        Selected Bridal Suite
                      </span>
                      <h3 className="font-heading text-xl font-bold text-amber-950 dark:text-amber-100">
                        {bridalPackages.find((b) => b.id === selectedBridal)?.name}
                      </h3>
                      <p className="text-xs font-bold text-amber-900 dark:text-amber-300 mt-1">
                        ₹{bridalPackages.find((b) => b.id === selectedBridal)?.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBridal(null)}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {/* Service Cards Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300">
                  Salon Treatment Menu
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                  {services.map((svc) => {
                    const isSelected = selectedServices.includes(svc.id);
                    return (
                      <div
                        key={svc.id}
                        onClick={() => toggleService(svc.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? "border-brand-violet bg-purple-50 dark:bg-purple-950/60 shadow-sm"
                            : "border-purple-100 dark:border-purple-900 hover:border-purple-300 bg-white dark:bg-[#150D27]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-brand-violet text-white"
                                : "border border-purple-300 dark:border-purple-700"
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-brand-ink dark:text-white line-clamp-1">
                              {svc.name}
                            </p>
                            <p className="text-[11px] text-brand-muted">{svc.durationMinutes} mins</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-brand-deep dark:text-brand-orchid shrink-0">
                          ₹{(svc.discountedPrice || svc.price).toLocaleString("en-IN")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  disabled={selectedItemsList.length === 0}
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal disabled:opacity-50 transition-all shadow-soft"
                >
                  <span>Proceed to Select Stylist</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CHOOSE STYLIST */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-ink dark:text-white">
                  Step 2: Choose Your Stylist
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted mt-1">
                  Select a preferred master artisan or pick &quot;Any Available Stylist&quot; for greatest slot availability.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Any Stylist Option */}
                <div
                  onClick={() => setSelectedStylistId("any")}
                  className={`p-5 rounded-3xl border cursor-pointer transition-all flex items-center gap-4 ${
                    selectedStylistId === "any"
                      ? "border-brand-violet bg-purple-50 dark:bg-purple-950/60 shadow-soft"
                      : "border-purple-100 dark:border-purple-900 bg-white dark:bg-[#150D27]"
                  }`}
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand-royal to-purple-500 text-white flex items-center justify-center font-bold text-sm">
                    <Sparkles className="h-6 w-6 text-brand-softgold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-brand-ink dark:text-white">
                      Any Available Stylist
                    </h3>
                    <p className="text-xs text-brand-muted">
                      Fastest confirmation • Maximizes available slots
                    </p>
                  </div>
                </div>

                {/* Specific Stylists */}
                {stylists.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStylistId(st.id)}
                    className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                      selectedStylistId === st.id
                        ? "border-brand-violet bg-purple-50 dark:bg-purple-950/60 shadow-soft"
                        : "border-purple-100 dark:border-purple-900 bg-white dark:bg-[#150D27]"
                    }`}
                  >
                    <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 shadow-sm">
                      <Image
                        src={st.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80"}
                        alt={st.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-bold text-brand-ink dark:text-white">{st.name}</h3>
                      <p className="text-[11px] text-brand-violet font-medium line-clamp-1">
                        {st.specialties}
                      </p>
                      <p className="text-[10px] text-brand-muted">★ {st.rating.toFixed(2)} rating</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-purple-200 text-xs font-semibold text-brand-muted hover:text-brand-ink"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Services</span>
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft"
                >
                  <span>Pick Date & Time</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PICK DATE & TIME SLOT */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-ink dark:text-white">
                  Step 3: Select Date & Time
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted mt-1">
                  Times shown in <strong>Asia/Kolkata (IST)</strong>. Required duration:{" "}
                  <span className="font-semibold text-brand-deep dark:text-brand-orchid">
                    {totalDurationMinutes} mins
                  </span>.
                </p>
              </div>

              {/* Date Input */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-[#FAF7FD] dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-brand-violet" />
                  <span className="text-xs font-bold text-brand-ink dark:text-white">
                    Select Date:
                  </span>
                </div>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-xl border border-purple-200 px-3 py-1.5 text-xs font-semibold text-brand-ink dark:bg-[#150D27] dark:text-white dark:border-purple-800"
                />
              </div>

              {/* Slots Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300 mb-3">
                  Available Slots ({slots.filter((s) => s.isAvailable).length} slots open)
                </h3>

                {isLoadingSlots ? (
                  <div className="py-12 text-center text-xs text-brand-muted">
                    Checking artisan availability in Asia/Kolkata...
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-purple-100 dark:border-purple-900 text-xs text-brand-muted">
                    No open slots on this date. Please choose another date or choose &quot;Any Available Stylist&quot;.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-72 overflow-y-auto pr-1">
                    {slots.map((s) => (
                      <button
                        key={s.time}
                        disabled={!s.isAvailable}
                        onClick={() => setSelectedSlot(s.time)}
                        className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all ${
                          selectedSlot === s.time
                            ? "bg-brand-violet text-white border-brand-violet shadow-soft scale-105"
                            : s.isAvailable
                            ? "border-purple-200 dark:border-purple-800 bg-white dark:bg-[#150D27] text-brand-ink dark:text-purple-200 hover:border-brand-violet"
                            : "border-gray-200 bg-gray-100 text-gray-400 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-600 cursor-not-allowed line-through"
                        }`}
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-purple-200 text-xs font-semibold text-brand-muted hover:text-brand-ink"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Stylist</span>
                </button>
                <button
                  disabled={!selectedSlot}
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal disabled:opacity-50 transition-all shadow-soft"
                >
                  <span>Review & Pay</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRM & PAY */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-ink dark:text-white">
                  Step 4: Contact & Payment
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted mt-1">
                  Review booking details and choose your payment preference.
                </p>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300">
                  Guest Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-brand-muted">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ananya Roy"
                      className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-brand-muted">Phone Number (10 digits) *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-brand-muted">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. ananya@example.com"
                      className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-brand-muted">Special Requests / Allergies / Notes</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tell us if you prefer quiet appointments, organic dyes, or have scalp sensitivity..."
                      className="w-full mt-1 rounded-xl border border-purple-200 p-2 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                    />
                  </div>
                  {/* Anti-Bot Honeypot Field */}
                  <input
                    type="text"
                    name="hp_website"
                    value={hpWebsite}
                    onChange={(e) => setHpWebsite(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300">
                    Payment Preference
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>100% Direct Salon Payment • Zero 3rd-Party Keys</span>
                  </span>
                </div>

                {/* Bridal Deposit Toggle */}
                {selectedBridal && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        Bridal Suite Deposit Option:
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPayDepositChoice(true)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            payDepositChoice
                              ? "bg-amber-500 text-brand-ink shadow-sm"
                              : "bg-white dark:bg-[#1A102F] text-brand-muted border border-amber-300"
                          }`}
                        >
                          Advance Deposit (₹{depositAmount.toLocaleString("en-IN")})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayDepositChoice(false)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            !payDepositChoice
                              ? "bg-amber-500 text-brand-ink shadow-sm"
                              : "bg-white dark:bg-[#1A102F] text-brand-muted border border-amber-300"
                          }`}
                        >
                          Full Total (₹{finalTotal.toLocaleString("en-IN")})
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-amber-800/80 dark:text-amber-300">
                      Paying the advance deposit places your bridal slot on a 24-hour hold or confirms it immediately upon UPI verification.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentChoice("SALON")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentChoice === "SALON"
                        ? "border-brand-violet bg-purple-50 dark:bg-purple-950/60 shadow-sm"
                        : "border-purple-100 dark:border-purple-900 bg-white dark:bg-[#150D27]"
                    }`}
                  >
                    <Building className="h-5 w-5 text-brand-royal mb-2" />
                    <p className="text-xs font-bold text-brand-ink dark:text-white">Pay at Salon (Default)</p>
                    <p className="text-[11px] text-brand-muted mt-0.5">Cash / UPI / Card at salon reception upon arrival</p>
                  </div>

                  <div
                    onClick={() => setPaymentChoice("UPI")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentChoice === "UPI"
                        ? "border-brand-violet bg-purple-50 dark:bg-purple-950/60 shadow-sm"
                        : "border-purple-100 dark:border-purple-900 bg-white dark:bg-[#150D27]"
                    }`}
                  >
                    <QrCode className="h-5 w-5 text-brand-violet mb-2" />
                    <p className="text-xs font-bold text-brand-ink dark:text-white">Pay by UPI (Instant QR)</p>
                    <p className="text-[11px] text-brand-muted mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>
                </div>

                {/* UPI Instructions and QR Box */}
                {paymentChoice === "UPI" && (
                  <div className="p-5 rounded-3xl bg-purple-50/60 dark:bg-purple-950/40 border-2 border-brand-violet/30 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                      {/* QR Display */}
                      <div className="text-center shrink-0">
                        {upiQrDataUrl ? (
                          <div className="bg-white p-2 rounded-2xl border border-purple-200 shadow-sm inline-block">
                            <Image
                              src={upiQrDataUrl}
                              alt="Scan to pay UPI"
                              width={180}
                              height={180}
                              className="rounded-xl"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-44 h-44 bg-purple-100 rounded-2xl flex items-center justify-center text-xs text-brand-muted">
                            Generating QR...
                          </div>
                        )}
                        <p className="text-[10px] text-brand-muted font-semibold mt-1.5">
                          Amount: ₹{payableAmount.toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Salon UPI details & mobile link */}
                      <div className="space-y-3 flex-1 text-center sm:text-left">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">
                            Official Salon UPI ID
                          </span>
                          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                            <span className="font-mono text-sm font-bold text-brand-royal dark:text-brand-orchid bg-white dark:bg-[#150D27] px-3 py-1 rounded-xl border border-purple-200 dark:border-purple-800">
                              {salonUpiId}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopyUpi}
                              className="p-1.5 rounded-lg border border-purple-200 dark:border-purple-800 hover:bg-white text-brand-muted hover:text-brand-ink"
                              title="Copy UPI ID"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            {copiedUpi && (
                              <span className="text-[11px] text-emerald-600 font-bold">Copied!</span>
                            )}
                          </div>
                        </div>

                        {/* Mobile Deep Link */}
                        <div>
                          <a
                            href={upiUrl}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft"
                          >
                            <Smartphone className="h-4 w-4" />
                            <span>Open in UPI App (GPay / PhonePe / Paytm)</span>
                          </a>
                        </div>

                        <p className="text-[11px] text-brand-muted leading-relaxed">
                          Scan the QR code with any UPI app on your phone, or tap the button above if booking on mobile.
                        </p>
                      </div>
                    </div>

                    {/* Step 2: Customer enters UTR and attaches screenshot */}
                    <div className="pt-3 border-t border-purple-200 dark:border-purple-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-brand-ink dark:text-purple-200">
                          12-Digit UPI Reference Number (UTR) *
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
                          placeholder="e.g. 432109876543 (from UPI app)"
                          className="w-full mt-1 rounded-xl border border-purple-300 dark:border-purple-700 p-2.5 text-xs font-mono font-bold text-brand-ink dark:bg-[#150D27] dark:text-white"
                        />
                        <p className="text-[10px] text-brand-muted mt-1">
                          Found in payment details of Google Pay, PhonePe, or Paytm receipt.
                        </p>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-brand-ink dark:text-purple-200">
                          Payment Screenshot (Optional)
                        </label>
                        <div className="mt-1 flex items-center gap-2">
                          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-[#150D27] text-xs font-semibold text-brand-muted hover:text-brand-ink cursor-pointer">
                            <Upload className="h-4 w-4 text-brand-violet" />
                            <span>{isUploadingScreenshot ? "Uploading..." : "Attach Proof"}</span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={handleUploadScreenshot}
                              className="hidden"
                              disabled={isUploadingScreenshot}
                            />
                          </label>
                          {screenshotUrl && (
                            <span className="text-[11px] text-emerald-600 font-bold">
                              ✓ Screenshot uploaded
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-brand-muted mt-1">
                          PNG, JPEG, or WebP up to 5MB (stored securely locally).
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Banner */}
              {bookingError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-purple-200 text-xs font-semibold text-brand-muted hover:text-brand-ink"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Slots</span>
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-royal via-brand-violet to-purple-600 text-white text-xs sm:text-sm font-bold shadow-soft hover:shadow-glow disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <span>Securing Slot...</span>
                  ) : (
                    <span>Confirm & Book Appointment</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-[#1A102F] p-6 border border-purple-100 dark:border-purple-900 shadow-sm space-y-6 h-fit sticky top-28">
          <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white pb-3 border-b border-purple-100 dark:border-purple-900">
            Appointment Summary
          </h3>

          {/* Time & Stylist Snapshot */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-brand-muted">
              <span>Date:</span>
              <span className="font-bold text-brand-ink dark:text-white">{selectedDate}</span>
            </div>
            <div className="flex items-center justify-between text-brand-muted">
              <span>Slot:</span>
              <span className="font-bold text-brand-royal dark:text-brand-orchid">
                {selectedSlot || "Not selected yet"}
              </span>
            </div>
            <div className="flex items-center justify-between text-brand-muted">
              <span>Duration:</span>
              <span>{totalDurationMinutes} mins</span>
            </div>
            <div className="flex items-center justify-between text-brand-muted">
              <span>Stylist:</span>
              <span className="font-bold text-brand-ink dark:text-white">
                {selectedStylistId === "any"
                  ? "Any Available (Fastest)"
                  : stylists.find((s) => s.id === selectedStylistId)?.name || "Assigned"}
              </span>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="space-y-2 pt-3 border-t border-purple-100 dark:border-purple-900">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-brand-muted">
              Selected Services:
            </h4>
            {selectedItemsList.length === 0 ? (
              <p className="text-xs text-brand-muted italic">No treatments chosen yet</p>
            ) : (
              selectedItemsList.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-brand-ink/80 dark:text-purple-200 line-clamp-1">{item.name}</span>
                  <span className="font-bold text-brand-deep dark:text-brand-orchid shrink-0">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Promo code input */}
          <div className="pt-3 border-t border-purple-100 dark:border-purple-900 space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                placeholder="Promo code (e.g. WELCOME10)"
                className="flex-1 rounded-xl border border-purple-200 px-3 py-1.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
              />
              <button
                onClick={handleApplyPromo}
                className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-brand-deep dark:text-purple-200 text-xs font-bold hover:bg-brand-violet hover:text-white transition-colors"
              >
                Apply
              </button>
            </div>
            {appliedPromo && (
              <p className="text-[11px] text-emerald-600 font-semibold">
                ✓ Code &apos;{appliedPromo.code}&apos; applied (-₹{appliedPromo.discountAmount})
              </p>
            )}
            {promoError && (
              <p className="text-[11px] text-red-600 font-semibold">{promoError}</p>
            )}
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-purple-100 dark:border-purple-900 space-y-2">
            <div className="flex justify-between text-xs text-brand-muted">
              <span>Subtotal:</span>
              <span>₹{baseSubtotal.toLocaleString("en-IN")}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                <span>Discount:</span>
                <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="pt-2 border-t border-purple-100 dark:border-purple-900 flex justify-between items-baseline">
              <span className="text-sm font-bold text-brand-ink dark:text-white">Total:</span>
              <span className="text-2xl font-bold text-brand-deep dark:text-brand-orchid">
                ₹{finalTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[10px] text-brand-muted text-right">Includes all taxes (GST 18%)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
