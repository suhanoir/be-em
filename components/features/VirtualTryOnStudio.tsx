"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Upload, Sparkles, Sliders, Bookmark, ArrowRight, Check } from "lucide-react";

const DEMO_MODELS = [
  {
    name: "Model 1 (Wavy Brunette)",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
  },
  {
    name: "Model 2 (Warm Medium)",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
  },
  {
    name: "Model 3 (Straight Dark)",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
  },
];

const HAIR_COLORS = [
  { name: "Original", hex: "transparent" },
  { name: "Rose Gold Luxe", hex: "#B76E79", blend: "color" },
  { name: "Caramel Balayage", hex: "#C68B59", blend: "overlay" },
  { name: "Burgundy Merlot", hex: "#722F37", blend: "color" },
  { name: "Honey Amber", hex: "#D4AF37", blend: "overlay" },
  { name: "Platinum Ice", hex: "#CBD5E1", blend: "hard-light" },
  { name: "Midnight Violet", hex: "#4C1D95", blend: "color" },
];

const STYLES = [
  { name: "Natural Flow", filter: "none" },
  { name: "Butterfly Layered Texture", filter: "contrast(115%) saturate(110%)" },
  { name: "Hollywood Gloss Wave", filter: "brightness(105%) contrast(120%)" },
  { name: "Vintage French Matte", filter: "sepia(15%) contrast(105%)" },
];

export function VirtualTryOnStudio() {
  const [currentImage, setCurrentImage] = useState(DEMO_MODELS[0].url);
  const [selectedColor, setSelectedColor] = useState(HAIR_COLORS[1]);
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [tintIntensity, setTintIntensity] = useState(65);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveToLookboard = () => {
    const current = JSON.parse(localStorage.getItem("beem_lookboard") || "[]");
    current.push({
      imageUrl: currentImage,
      title: `Virtual Try-On: ${selectedColor.name} (${selectedStyle.name})`,
      category: "Hair Color",
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem("beem_lookboard", JSON.stringify(current));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lavender text-brand-deep dark:bg-purple-950 dark:text-purple-200 text-xs font-bold mb-2">
          <Camera className="h-3.5 w-3.5 text-brand-violet" />
          <span>Interactive Client-Side AR Simulator</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-ink dark:text-white">
          Virtual Hair &amp; Color Studio
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-2">
          Upload your selfie or try our sample models. Test Olaplex-infused balayage tones, rose gold tints, and trending haircuts before stepping into the salon chair.
        </p>
      </div>

      {/* Main Studio Interactive Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Canvas / Preview Viewport */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#1A102F] p-6 border border-purple-100 dark:border-purple-900 shadow-xl space-y-4">
          <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-black/5 shadow-inner flex items-center justify-center">
            {/* Base Image */}
            <Image
              src={currentImage}
              alt="Virtual Try-On Preview"
              fill
              className="object-cover"
              style={{ filter: selectedStyle.filter }}
            />

            {/* Simulated Color Tint Overlay Layer */}
            {selectedColor.hex !== "transparent" && (
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  backgroundColor: selectedColor.hex,
                  opacity: tintIntensity / 100,
                  mixBlendMode: (selectedColor.blend as any) || "color",
                }}
              />
            )}

            {/* Floating Tag */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 backdrop-blur-md text-white flex items-center justify-between text-xs">
              <div>
                <p className="font-bold">{selectedColor.name}</p>
                <p className="text-[10px] text-purple-200">{selectedStyle.name}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">
                {tintIntensity}% Tint
              </span>
            </div>
          </div>

          {/* Model Switcher and Upload Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-muted font-semibold">Try on:</span>
              {DEMO_MODELS.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(m.url)}
                  className={`h-9 w-9 rounded-full overflow-relative border-2 overflow-hidden transition-all ${
                    currentImage === m.url
                      ? "border-brand-violet scale-110 shadow-sm"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={m.url}
                    alt={m.name}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 text-xs font-semibold text-brand-deep dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors"
              >
                <Upload className="h-3.5 w-3.5 text-brand-violet" />
                <span>Upload Selfie</span>
              </button>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#1A102F] p-6 border border-purple-100 dark:border-purple-900 shadow-xl space-y-6">
          {/* Hair Color Palette */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300 block mb-3">
              1. Hair Color &amp; Gloss Tone:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {HAIR_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                    selectedColor.name === c.name
                      ? "border-brand-violet bg-purple-50 dark:bg-purple-950/60 shadow-sm"
                      : "border-purple-100 dark:border-purple-900 bg-[#FAF7FD] dark:bg-[#150D27]"
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: c.hex === "transparent" ? "#EEEEEE" : c.hex }}
                  />
                  <span className="text-xs font-semibold text-brand-ink dark:text-white line-clamp-1">
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tint Saturation Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-brand-muted">Tint Saturation &amp; Gloss:</span>
              <span className="text-brand-royal dark:text-brand-orchid">{tintIntensity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              value={tintIntensity}
              onChange={(e) => setTintIntensity(parseInt(e.target.value, 10))}
              className="w-full accent-brand-violet cursor-pointer"
            />
          </div>

          {/* Hairstyle / Texture Preset */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300 block mb-2">
              2. Hair Texture Preset:
            </label>
            <div className="space-y-2">
              {STYLES.map((st) => (
                <button
                  key={st.name}
                  onClick={() => setSelectedStyle(st)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                    selectedStyle.name === st.name
                      ? "border-brand-violet bg-purple-50 dark:bg-purple-950 text-brand-deep dark:text-white"
                      : "border-purple-100 dark:border-purple-900 bg-[#FAF7FD] dark:bg-[#150D27] text-brand-muted"
                  }`}
                >
                  {st.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-purple-100 dark:border-purple-900 space-y-3">
            {savedSuccess && (
              <p className="text-xs text-emerald-600 font-semibold text-center animate-in fade-in">
                ✓ Saved to your Look Board!
              </p>
            )}

            <button
              onClick={handleSaveToLookboard}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-purple-200 dark:border-purple-800 text-xs font-semibold text-brand-deep dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors"
            >
              <Bookmark className="h-4 w-4 text-brand-violet" />
              <span>Save Styled Look to Look Board</span>
            </button>

            <Link
              href={`/book?service=sun-kissed-balayage`}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft"
            >
              <span>Book This Color with Master Stylist</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
