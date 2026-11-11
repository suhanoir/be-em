"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, MessageCircle, Plus, CheckCircle2 } from "lucide-react";
import { formatInKolkata } from "@/lib/timezone";

export function ReviewsFeed({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = reviews.filter((r) => {
    if (filterRating === "all") return true;
    return r.rating === filterRating;
  });

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviews([data.review, ...reviews]);
        setSuccessMsg("Thank you! Your verified review has been published.");
        setTimeout(() => {
          setShowModal(false);
          setSuccessMsg("");
          setName("");
          setComment("");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header & Rating Breakdown Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-8 border border-purple-100 dark:border-purple-900 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left space-y-2">
          <span className="text-xs font-bold tracking-widest text-brand-violet uppercase">
            Client Satisfaction
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-ink dark:text-white">
            Verified Experiences
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-md">
            All reviews are authenticated against real appointments. No sponsored or synthetic ratings.
          </p>
        </div>

        <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50/50 dark:from-purple-950/60 dark:to-[#150D27] border border-purple-100 dark:border-purple-900 shrink-0">
          <div className="text-center">
            <span className="text-4xl font-black text-brand-deep dark:text-brand-softgold font-heading">
              {averageRating}
            </span>
            <div className="flex text-amber-500 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-[11px] text-brand-muted mt-1">{reviews.length} Verified Reviews</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterRating("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filterRating === "all"
              ? "bg-brand-royal text-white shadow-soft"
              : "bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 text-brand-ink dark:text-purple-200"
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        {[5, 4, 3].map((star) => {
          const count = reviews.filter((r) => r.rating === star).length;
          return (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                filterRating === star
                  ? "bg-brand-royal text-white shadow-soft"
                  : "bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 text-brand-ink dark:text-purple-200"
              }`}
            >
              <span>{star} Stars</span>
              <span className="opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 sm:p-7 border border-purple-100 dark:border-purple-900 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-bold text-brand-ink dark:text-white">
                    {rev.customerName}
                  </h3>
                  {rev.isVerified && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-950/60 dark:text-emerald-300">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Visit
                    </span>
                  )}
                </div>
                <div className="flex text-amber-500 mt-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <span className="text-[11px] text-brand-muted">
                {formatInKolkata(rev.createdAt, "MMM dd, yyyy")}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-brand-ink/90 dark:text-purple-100 leading-relaxed">
              &quot;{rev.comment}&quot;
            </p>

            {/* Stylist or Service badge */}
            <div className="flex flex-wrap gap-2 text-[11px] text-brand-muted pt-1">
              {rev.service?.name && (
                <span className="px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-brand-royal dark:text-brand-orchid font-medium">
                  Service: {rev.service.name}
                </span>
              )}
              {rev.stylist?.name && (
                <span className="px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-brand-royal dark:text-brand-orchid font-medium">
                  Stylist: {rev.stylist.name}
                </span>
              )}
            </div>

            {/* Owner Reply */}
            {rev.ownerReply && (
              <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-deep dark:text-brand-orchid">
                  <MessageCircle className="h-3.5 w-3.5" />
                  <span>BEEM Management Response</span>
                </div>
                <p className="text-xs text-brand-muted leading-relaxed">{rev.ownerReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Review Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 sm:p-8 max-w-md w-full border border-purple-200 dark:border-purple-800 shadow-2xl space-y-4">
            <h3 className="font-heading text-2xl font-bold text-brand-ink dark:text-white">
              Write a Review
            </h3>
            <p className="text-xs text-brand-muted">
              Share your transformation experience with the BEEM community.
            </p>

            {successMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanvi Kulkarni"
                    className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">Rating (1 to 5 Stars)</label>
                  <div className="flex items-center gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            s <= rating ? "fill-amber-500 text-amber-500" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-brand-muted">Your Review *</label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your haircut, consultation, facial glow, or henna experience..."
                    className="w-full mt-1 rounded-xl border border-purple-200 p-2.5 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-full border border-purple-200 text-xs font-semibold text-brand-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal disabled:opacity-50"
                  >
                    {isSubmitting ? "Publishing..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
