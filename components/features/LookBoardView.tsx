"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Upload, Plus, Trash2, Calendar, Sparkles } from "lucide-react";

interface SavedLook {
  imageUrl: string;
  title: string;
  category: string;
  savedAt: string;
  note?: string;
}

export function LookBoardView() {
  const [looks, setLooks] = useState<SavedLook[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load from localStorage or initialize with sample looks
    const saved = localStorage.getItem("beem_lookboard");
    if (saved) {
      try {
        setLooks(JSON.parse(saved));
      } catch (e) {
        // fallback
      }
    } else {
      const defaultLooks: SavedLook[] = [
        {
          imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&q=80",
          title: "Honey Caramel Balayage Inspo",
          category: "Hair Color",
          note: "Soft root melt with brighter face-framing money pieces.",
          savedAt: new Date().toISOString(),
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80",
          title: "Intricate Arabic Henna Cuffs",
          category: "Mehendi",
          note: "Love the negative space and shaded mandalas on palms.",
          savedAt: new Date().toISOString(),
        },
      ];
      setLooks(defaultLooks);
      localStorage.setItem("beem_lookboard", JSON.stringify(defaultLooks));
    }
  }, []);

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLook = () => {
    if (!previewUrl) return;

    const newLook: SavedLook = {
      imageUrl: previewUrl,
      title: newTitle || "Custom Inspiration Look",
      category: "Inspiration",
      note: newNote,
      savedAt: new Date().toISOString(),
    };

    const updated = [newLook, ...looks];
    setLooks(updated);
    localStorage.setItem("beem_lookboard", JSON.stringify(updated));

    setPreviewUrl(null);
    setNewTitle("");
    setNewNote("");
    setShowUploadModal(false);
  };

  const handleDeleteLook = (index: number) => {
    const updated = looks.filter((_, i) => i !== index);
    setLooks(updated);
    localStorage.setItem("beem_lookboard", JSON.stringify(updated));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lavender text-brand-deep dark:bg-purple-950 dark:text-purple-200 text-xs font-bold mb-2">
            <Bookmark className="h-3.5 w-3.5 text-brand-violet" />
            <span>Curated Style Canvas</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-ink dark:text-white">
            My Inspiration Look Board
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Collect references from our gallery, Instagram, or Pinterest. Your assigned artisan will view this board during your consultation.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Inspo Photo</span>
        </button>
      </div>

      {/* Grid of Inspiration Cards */}
      {looks.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1A102F] rounded-3xl border border-purple-100 dark:border-purple-900">
          <Bookmark className="h-10 w-10 text-brand-muted mx-auto mb-3 opacity-50" />
          <h3 className="font-heading text-xl font-bold text-brand-ink dark:text-white">
            Your Look Board is Empty
          </h3>
          <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">
            Browse our gallery or upload inspiration photos to build your dream bridal or haircut moodboard.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/gallery"
              className="px-5 py-2.5 rounded-full bg-brand-violet text-white text-xs font-semibold"
            >
              Browse Gallery
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {looks.map((look, idx) => (
            <div
              key={idx}
              className="group rounded-3xl overflow-hidden bg-white dark:bg-[#1A102F] border border-purple-100 dark:border-purple-900 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={look.imageUrl}
                    alt={look.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-bold text-brand-deep dark:text-brand-orchid">
                    {look.category}
                  </div>
                  <button
                    onClick={() => handleDeleteLook(idx)}
                    aria-label="Remove look"
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 text-white/80 hover:text-red-400 hover:bg-black flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold text-brand-ink dark:text-white">
                    {look.title}
                  </h3>
                  {look.note && (
                    <p className="text-xs text-brand-muted mt-1.5 italic bg-[#FAF7FD] dark:bg-purple-950/40 p-2.5 rounded-xl border border-purple-100/60 dark:border-purple-900/60 leading-relaxed">
                      &quot;{look.note}&quot;
                    </p>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href={`/book?lookTitle=${encodeURIComponent(look.title)}`}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-purple-50 dark:bg-purple-950 text-brand-deep dark:text-brand-orchid text-xs font-bold hover:bg-brand-violet hover:text-white transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Book with this Inspiration</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Custom Look Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 sm:p-8 max-w-md w-full border border-purple-200 dark:border-purple-800 shadow-2xl space-y-4">
            <h3 className="font-heading text-2xl font-bold text-brand-ink dark:text-white">
              Add Inspiration Look
            </h3>

            {previewUrl ? (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-inner">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[4/3] rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-800 flex flex-col items-center justify-center cursor-pointer hover:border-brand-violet transition-colors text-brand-muted"
              >
                <Upload className="h-8 w-8 text-brand-violet mb-2" />
                <span className="text-xs font-semibold">Click to upload inspiration photo</span>
                <span className="text-[10px]">PNG, JPG, WEBP up to 5MB</span>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFile}
              className="hidden"
            />

            <div>
              <label className="text-[11px] font-semibold text-brand-muted">Title (Optional)</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Sangeet Glam with Bronze Wing"
                className="w-full mt-1 rounded-xl border border-purple-200 p-2 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-brand-muted">Stylist Note</label>
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Tell your stylist what specific element you love (the curls, the lip shade, etc.)..."
                className="w-full mt-1 rounded-xl border border-purple-200 p-2 text-xs text-brand-ink dark:bg-[#150D27] dark:border-purple-800 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setPreviewUrl(null);
                }}
                className="px-4 py-2 rounded-full border border-purple-200 text-xs font-semibold text-brand-muted"
              >
                Cancel
              </button>
              <button
                disabled={!previewUrl}
                onClick={handleAddLook}
                className="px-5 py-2 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal disabled:opacity-50"
              >
                Save to Look Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
