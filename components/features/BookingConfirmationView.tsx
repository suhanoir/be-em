"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  Printer,
  Download,
  Share2,
  Phone,
  AlertCircle,
  XCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { formatInKolkata } from "@/lib/timezone";
import { generateWhatsAppLink } from "@/lib/notifications";

export function BookingConfirmationView({ appointment }: { appointment: any }) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [status, setStatus] = useState(appointment.status);
  const [actionMessage, setActionMessage] = useState("");

  const formattedDate = formatInKolkata(appointment.date, "EEEE, MMMM dd, yyyy");
  const appointmentDate = new Date(appointment.date);
  const [h, m] = appointment.startTime.split(":").map(Number);
  appointmentDate.setHours(h, m, 0, 0);

  // Download .ics Calendar File
  const handleDownloadIcs = () => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    const d = appointmentDate;
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const mins = pad(d.getMinutes());

    const [endH, endM] = appointment.endTime.split(":").map(Number);
    const endHours = pad(endH);
    const endMins = pad(endM);

    const startFormatted = `${year}${month}${day}T${hours}${mins}00`;
    const endFormatted = `${year}${month}${day}T${endHours}${endMins}00`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//BEEM Beauty Empire//Salon Appointment//EN",
      "BEGIN:VEVENT",
      `UID:BEEM-${appointment.id}@beem.test`,
      `DTSTAMP:${year}${month}${day}T000000Z`,
      `DTSTART;TZID=Asia/Kolkata:${startFormatted}`,
      `DTEND;TZID=Asia/Kolkata:${endFormatted}`,
      `SUMMARY:BEEM Salon: ${appointment.items.map((i: any) => i.name).join(", ")}`,
      `DESCRIPTION:Appointment #${appointment.appointmentNumber} with ${appointment.stylist?.name || "Master Stylist"}. Total: INR ${appointment.totalAmount}`,
      "LOCATION:Shop 12-14, Luxury Promenade, 100 Feet Road, Indiranagar, Bengaluru",
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Reminder: BEEM Salon Appointment Tomorrow",
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-PT2H",
      "ACTION:DISPLAY",
      "DESCRIPTION:Reminder: BEEM Salon Appointment in 2 Hours",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `BEEM_Appointment_${appointment.appointmentNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancelAppointment = async () => {
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL", cancellationReason: cancelReason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionMessage(data.message || data.error || "Cancellation failed");
      } else {
        setStatus("CANCELLED");
        setIsCancelling(false);
        setActionMessage("Your appointment has been cancelled successfully.");
      }
    } catch (err) {
      setActionMessage("Failed to cancel appointment");
    }
  };

  const whatsappText = `Hello BEEM Salon! I am inquiring regarding my confirmed appointment #${appointment.appointmentNumber} on ${formattedDate} at ${appointment.startTime}.`;
  const whatsappUrl = generateWhatsAppLink("+919876543210", whatsappText);

  return (
    <div className="space-y-8">
      {/* Printable Invoice & Card Container */}
      <div
        id="printable-invoice"
        className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 sm:p-10 border border-purple-100 dark:border-purple-900 shadow-xl space-y-8"
      >
        {/* Header Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-100 dark:border-purple-900">
          <div className="flex items-center gap-4">
            <div
              className={`h-14 w-14 rounded-full flex items-center justify-center shrink-0 ${
                status === "CANCELLED"
                  ? "bg-red-100 text-red-600 dark:bg-red-950"
                  : status === "PAYMENT_SUBMITTED"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950"
                  : status === "PENDING_PAYMENT"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950"
              }`}
            >
              {status === "CANCELLED" ? (
                <XCircle className="h-8 w-8" />
              ) : status === "PAYMENT_SUBMITTED" || status === "PENDING_PAYMENT" ? (
                <Clock className="h-8 w-8 text-amber-600" />
              ) : (
                <CheckCircle2 className="h-8 w-8" />
              )}
            </div>
            <div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  status === "CANCELLED"
                    ? "text-red-600"
                    : status === "PAYMENT_SUBMITTED"
                    ? "text-amber-700 dark:text-amber-400"
                    : status === "PENDING_PAYMENT"
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-brand-violet"
                }`}
              >
                {status === "CANCELLED"
                  ? "Booking Cancelled"
                  : status === "PAYMENT_SUBMITTED"
                  ? "Payment Submitted • Verification in Progress"
                  : status === "PENDING_PAYMENT"
                  ? appointment.isBridal
                    ? "Tentative 24-Hour Hold"
                    : "Payment at Salon Reception"
                  : "Booking Confirmed"}
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-ink dark:text-white">
                #{appointment.appointmentNumber}
              </h1>
              <p className="text-xs text-brand-muted mt-0.5">
                {status === "PAYMENT_SUBMITTED"
                  ? `UTR Reference: ${appointment.utrNumber || "Logged"}. Salon reception verifies all direct transfers within minutes.`
                  : status === "PENDING_PAYMENT" && appointment.isBridal
                  ? "Bridal slot held for 24 hours. Submit advance deposit to guarantee confirmation."
                  : "Confirmation logged & WhatsApp reminder scheduled (24h and 2h prior)."}
              </p>
            </div>
          </div>

          <div className="no-print flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 text-xs font-semibold text-brand-deep dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={handleDownloadIcs}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-violet text-white text-xs font-semibold hover:bg-brand-royal transition-colors shadow-soft"
            >
              <Download className="h-4 w-4" />
              <span>Add to Calendar (.ics)</span>
            </button>
          </div>
        </div>

        {/* Schedule & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#FAF7FD] dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900 text-xs">
          <div>
            <span className="text-brand-muted block">Date & Time:</span>
            <p className="font-bold text-brand-ink dark:text-white mt-1 text-sm">{formattedDate}</p>
            <p className="text-brand-royal dark:text-brand-orchid font-semibold">
              {appointment.startTime} – {appointment.endTime} (IST)
            </p>
          </div>
          <div>
            <span className="text-brand-muted block">Assigned Artisan:</span>
            <p className="font-bold text-brand-ink dark:text-white mt-1 text-sm">
              {appointment.stylist?.name || "Master Stylist"}
            </p>
            <p className="text-brand-muted">{appointment.stylist?.phone || "Salon Main Line"}</p>
          </div>
          <div>
            <span className="text-brand-muted block">Sanctuary Address:</span>
            <p className="font-bold text-brand-ink dark:text-white mt-1 text-sm">BEEM (Beauty Empire)</p>
            <p className="text-brand-muted">100 Feet Rd, Indiranagar, Bengaluru</p>
          </div>
        </div>

        {/* Selected Treatments & Price Breakdown */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
            Reserved Experiences
          </h2>

          <div className="divide-y divide-purple-100 dark:divide-purple-900/60 border-y border-purple-100 dark:border-purple-900">
            {appointment.items.map((item: any) => (
              <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-brand-ink dark:text-white">{item.name}</p>
                  <p className="text-brand-muted">{item.durationMinutes} minutes</p>
                </div>
                <span className="font-bold text-brand-deep dark:text-brand-orchid text-sm">
                  ₹{item.price.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Financial summary */}
          <div className="space-y-2 pt-2 text-xs max-w-xs ml-auto">
            <div className="flex justify-between text-brand-muted">
              <span>Total Amount:</span>
              <span>₹{appointment.totalAmount.toLocaleString("en-IN")}</span>
            </div>
            {appointment.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount / Promo:</span>
                <span>-₹{appointment.discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-muted">
              <span>Amount Paid:</span>
              <span className="font-bold text-emerald-600">
                ₹{appointment.advancePaid.toLocaleString("en-IN")} ({appointment.paymentMethod})
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-purple-100 dark:border-purple-900 font-bold text-sm">
              <span className="text-brand-ink dark:text-white">Balance Due at Salon:</span>
              <span className="text-brand-deep dark:text-brand-orchid">
                ₹{appointment.balanceDue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="pt-4 border-t border-purple-100 dark:border-purple-900 text-xs text-brand-muted">
          <p>
            Guest: <strong>{appointment.customerName}</strong> ({appointment.customerPhone} | {appointment.customerEmail})
          </p>
          {appointment.notes && <p className="mt-1">Special Notes: {appointment.notes}</p>}
        </div>
      </div>

      {/* Action Messages */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 text-xs font-semibold text-brand-royal dark:text-purple-200">
          {actionMessage}
        </div>
      )}

      {/* Post Booking Controls */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 shadow-sm">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Coordinate via WhatsApp</span>
        </a>

        {status !== "CANCELLED" && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href={`/book?reschedule=${appointment.id}`}
              className="flex-1 sm:flex-none text-center px-5 py-3 rounded-full border border-purple-200 dark:border-purple-800 text-xs font-bold text-brand-deep dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/60"
            >
              Reschedule Slot
            </Link>

            <button
              onClick={() => setIsCancelling(true)}
              className="flex-1 sm:flex-none px-5 py-3 rounded-full border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              Cancel Appointment
            </button>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {isCancelling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 max-w-md w-full border border-purple-200 dark:border-purple-800 shadow-2xl space-y-4">
            <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
              Cancel Appointment?
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              In accordance with our salon policy, cancellations made at least 4 hours before the booked slot are eligible for a 100% refund.
            </p>

            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)..."
              className="w-full rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsCancelling(false)}
                className="px-4 py-2 rounded-full border border-purple-200 text-xs font-semibold text-brand-muted"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancelAppointment}
                className="px-5 py-2 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
