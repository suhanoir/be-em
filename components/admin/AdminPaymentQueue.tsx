"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Copy,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import { formatInKolkata } from "@/lib/timezone";

interface PaymentItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  utrNumber: string | null;
  screenshotUrl: string | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
  rejectionReason: string | null;
  createdAt: string;
  appointment: {
    id: string;
    appointmentNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    totalAmount: number;
    advancePaid: number;
    balanceDue: number;
    status: string;
    items: { name: string }[];
  };
}

export function AdminPaymentQueue({ initialPayments }: { initialPayments: PaymentItem[] }) {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [filterStatus, setFilterStatus] = useState<string>("SUBMITTED");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUtr(text);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleVerify = async (paymentId: string, action: "CONFIRM" | "REJECT", reason?: string) => {
    setProcessingId(paymentId);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          rejectionReason: reason || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", message: data.error || data.message || "Failed to update payment" });
      } else {
        setFeedback({
          type: "success",
          message: action === "CONFIRM" ? "Payment verified and confirmed!" : "Payment marked as rejected.",
        });
        // Update local state
        setPayments((prev) =>
          prev.map((p) =>
            p.id === paymentId
              ? {
                  ...p,
                  status: action === "CONFIRM" ? "CONFIRMED" : "REJECTED",
                  rejectionReason: action === "REJECT" ? reason || "Rejected by admin" : null,
                  appointment: {
                    ...p.appointment,
                    status: action === "CONFIRM" ? "CONFIRMED" : p.appointment.status,
                  },
                }
              : p
          )
        );
        setRejectingId(null);
        setRejectReason("");
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Network error" });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (filterStatus !== "ALL" && p.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAppt = p.appointment.appointmentNumber.toLowerCase().includes(q);
      const matchName = p.appointment.customerName.toLowerCase().includes(q);
      const matchPhone = p.appointment.customerPhone.includes(q);
      const matchUtr = p.utrNumber?.toLowerCase().includes(q);
      return matchAppt || matchName || matchPhone || matchUtr;
    }
    return true;
  });

  const pendingCount = payments.filter((p) => p.status === "SUBMITTED").length;
  const confirmedCount = payments.filter((p) => p.status === "CONFIRMED").length;

  return (
    <div className="space-y-6">
      {/* Top Banner Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Needs Verification</p>
            <h3 className="font-heading text-3xl font-bold text-amber-900 dark:text-amber-100">{pendingCount}</h3>
          </div>
          <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>

        <div className="p-5 rounded-3xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-royal dark:text-brand-orchid">Confirmed Payments</p>
            <h3 className="font-heading text-3xl font-bold text-brand-deep dark:text-white">{confirmedCount}</h3>
          </div>
          <CheckCircle2 className="h-8 w-8 text-brand-violet" />
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-brand-muted">Total Processed</p>
            <h3 className="font-heading text-3xl font-bold text-brand-ink dark:text-white">{payments.length}</h3>
          </div>
          <CreditCard className="h-8 w-8 text-brand-muted" />
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { id: "SUBMITTED", label: "To Verify" },
            { id: "CONFIRMED", label: "Confirmed" },
            { id: "PENDING", label: "At Salon / Pending" },
            { id: "REJECTED", label: "Rejected" },
            { id: "ALL", label: "All Payments" },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterStatus(pill.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filterStatus === pill.id
                  ? "bg-brand-violet text-white shadow-soft"
                  : "bg-white dark:bg-[#150D27] border border-purple-100 dark:border-purple-900 text-brand-muted hover:text-brand-ink"
              }`}
            >
              {pill.label}
              {pill.id === "SUBMITTED" && pendingCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-400 text-brand-ink text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search UTR, client, appt..."
            className="w-full pl-9 pr-3 py-2 rounded-full border border-purple-200 dark:border-purple-800 text-xs text-brand-ink dark:bg-[#150D27] dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-[#120822] border border-purple-100 dark:border-purple-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7FD] dark:bg-purple-950/40 text-[11px] font-bold uppercase tracking-wider text-brand-muted border-b border-purple-100 dark:border-purple-900">
              <tr>
                <th className="p-4">Appt No &amp; Client</th>
                <th className="p-4">Method &amp; Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">UTR Reference</th>
                <th className="p-4">Screenshot</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100 dark:divide-purple-900">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-brand-muted">
                    No payments found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const isSubmitted = p.status === "SUBMITTED";
                  const isRejecting = rejectingId === p.id;
                  const isProcessing = processingId === p.id;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors"
                    >
                      <td className="p-4">
                        <Link
                          href={`/booking/confirmation/${p.appointment.id}`}
                          className="font-mono font-bold text-brand-royal dark:text-brand-orchid hover:underline flex items-center gap-1"
                        >
                          <span>#{p.appointment.appointmentNumber}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                        <p className="font-bold text-brand-ink dark:text-white mt-0.5">
                          {p.appointment.customerName}
                        </p>
                        <p className="text-[11px] text-brand-muted">{p.appointment.customerPhone}</p>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-brand-deep dark:text-purple-300">
                          {p.method === "UPI" ? "📱 UPI QR" : "🏢 At Salon Reception"}
                        </span>
                        <p className="text-[11px] text-brand-muted mt-0.5">
                          {formatInKolkata(p.createdAt, "MMM dd, hh:mm a")}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-sm text-brand-deep dark:text-brand-orchid">
                          ₹{p.amount.toLocaleString("en-IN")}
                        </span>
                        <p className="text-[10px] text-brand-muted">
                          Total: ₹{p.appointment.totalAmount.toLocaleString("en-IN")}
                        </p>
                      </td>

                      <td className="p-4">
                        {p.utrNumber ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold bg-purple-50 dark:bg-purple-950/60 px-2 py-1 rounded-md text-brand-deep dark:text-purple-200">
                              {p.utrNumber}
                            </span>
                            <button
                              onClick={() => copyToClipboard(p.utrNumber!)}
                              title="Copy UTR"
                              className="p-1 hover:bg-purple-100 rounded text-brand-muted hover:text-brand-ink"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            {copiedUtr === p.utrNumber && (
                              <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-brand-muted italic text-[11px]">N/A (At Salon)</span>
                        )}
                      </td>

                      <td className="p-4">
                        {p.screenshotUrl ? (
                          <a
                            href={p.screenshotUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-violet hover:underline bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg"
                          >
                            <span>View Proof</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-brand-muted text-[11px]">No image</span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                            p.status === "CONFIRMED"
                              ? "bg-emerald-100 text-emerald-800"
                              : p.status === "SUBMITTED"
                              ? "bg-amber-100 text-amber-800 animate-pulse"
                              : p.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {p.status === "SUBMITTED" ? "Needs Verification" : p.status}
                        </span>
                        {p.verifiedBy && (
                          <p className="text-[9px] text-brand-muted mt-1">
                            By {p.verifiedBy.split("@")[0]}
                          </p>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {isSubmitted ? (
                          isRejecting ? (
                            <div className="space-y-2 text-left">
                              <input
                                type="text"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Rejection reason (e.g. UTR not found in bank)..."
                                className="w-full text-xs p-1.5 rounded border border-red-300 dark:bg-[#150D27]"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => setRejectingId(null)}
                                  className="px-2.5 py-1 rounded text-[11px] text-brand-muted hover:text-brand-ink"
                                >
                                  Cancel
                                </button>
                                <button
                                  disabled={isProcessing}
                                  onClick={() => handleVerify(p.id, "REJECT", rejectReason)}
                                  className="px-3 py-1 rounded bg-red-600 text-white text-[11px] font-bold hover:bg-red-700"
                                >
                                  Confirm Rejection
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                disabled={isProcessing}
                                onClick={() => handleVerify(p.id, "CONFIRM")}
                                className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all"
                              >
                                {isProcessing ? "Verifying..." : "Confirm Payment"}
                              </button>
                              <button
                                disabled={isProcessing}
                                onClick={() => setRejectingId(p.id)}
                                className="px-2.5 py-1.5 rounded-full border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50"
                              >
                                Reject
                              </button>
                            </div>
                          )
                        ) : p.status === "CONFIRMED" ? (
                          <span className="text-[11px] text-emerald-600 font-bold">✓ Verified</span>
                        ) : p.status === "REJECTED" ? (
                          <span className="text-[11px] text-red-600 font-semibold" title={p.rejectionReason || ""}>
                            ✗ Rejected
                          </span>
                        ) : (
                          <span className="text-[11px] text-brand-muted">Awaiting Customer</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
