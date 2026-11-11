"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Check, ArrowRight, RotateCcw, Crown, Heart } from "lucide-react";

export function StyleQuizWizard() {
  const [step, setStep] = useState(1);
  const [faceShape, setFaceShape] = useState<string>("Oval");
  const [skinType, setSkinType] = useState<string>("Combination");
  const [skinUndertone, setSkinUndertone] = useState<string>("Warm Golden");
  const [hairType, setHairType] = useState<string>("Wavy");
  const [hairGoal, setHairGoal] = useState<string>("Volume & Bounce");
  const [occasion, setOccasion] = useState<string>("Wedding / Bridal");

  const [result, setResult] = useState<any>(null);

  const calculateRecommendation = () => {
    // Rule-based diagnostic logic
    let cut = "BEEM Signature Haircut & Blowdry";
    let cutDesc = "Balanced layers that frame the cheekbones and add dynamic movement.";
    let makeup = "Party Glam HD Cocktail Makeup";
    let makeupPalette = "Warm Terracotta & Champagne Shimmer with Peachy Nude Gloss";
    let facial = "HydraGlow Oxygen Luxury Facial";
    let facialReason = "Deep pore suction with cold cryo-globe infusion for radiant glass skin.";
    let stylist = "Aisha Sharma";
    let packageSlug = "gold-empress-bridal";

    if (faceShape === "Round") {
      cut = "Layered Butterfly Cut & Texture Styling";
      cutDesc = "Voluminous face-framing fringe that creates vertical elongation and slims the jawline.";
    } else if (faceShape === "Square") {
      cut = "Red Carpet Hollywood Waves Blowout";
      cutDesc = "Soft vintage cascading curls that soften angular jawlines.";
    } else if (faceShape === "Heart") {
      cut = "Layered Butterfly Cut & Texture Styling";
      cutDesc = "Airy curtain bangs that balance the forehead width with chin volume.";
    }

    if (skinType === "Dry" || skinType === "Sensitive") {
      facial = "24K Gold Imperial Radiance Facial";
      facialReason = "Colloidal gold sheets and ultra-hydrating hyaluronic booster to quench thirsty skin.";
    }

    if (skinUndertone === "Cool Rose") {
      makeupPalette = "Berry Mauve, Rose Quartz Eyeshadow & Soft Satin Rose Lips";
    } else if (skinUndertone === "Neutral Honey") {
      makeupPalette = "Bronze Smudge, Copper Foil & Velvet Caramel Nude";
    }

    if (occasion === "Wedding / Bridal") {
      stylist = "Priya Kapoor (Celebrity Bridal Artist)";
      packageSlug = "gold-empress-bridal";
    } else {
      stylist = "Aisha Sharma (Creative Director)";
    }

    setResult({
      cut,
      cutDesc,
      makeup,
      makeupPalette,
      facial,
      facialReason,
      stylist,
      packageSlug,
    });
    setStep(5);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#1A102F] p-6 sm:p-10 border border-purple-100 dark:border-purple-900 shadow-xl space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-lavender text-brand-deep dark:bg-purple-950 dark:text-purple-200 text-xs font-bold mb-2">
          <Sparkles className="h-3.5 w-3.5 text-brand-violet" />
          <span>Interactive Diagnostic Engine</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-ink dark:text-white">
          The BEEM Personal Style Quiz
        </h1>
        <p className="text-xs sm:text-sm text-brand-muted mt-2">
          Answer 4 quick questions to receive a diagnostic beauty blueprint customized to your bone structure and skin undertones.
        </p>
      </div>

      {/* Step Progress */}
      {step < 5 && (
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step
                  ? "w-10 bg-brand-violet"
                  : s < step
                  ? "w-6 bg-emerald-500"
                  : "w-6 bg-purple-100 dark:bg-purple-900"
              }`}
            />
          ))}
        </div>
      )}

      {/* Step 1: Face Shape */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="text-center">
            <h2 className="text-lg font-bold text-brand-ink dark:text-white">
              1. What best describes your face shape?
            </h2>
            <p className="text-xs text-brand-muted mt-1">Look at your jawline and cheekbone proportions</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Oval", desc: "Balanced length & softly curved jaw" },
              { name: "Round", desc: "Cheekbones width equals face length" },
              { name: "Square", desc: "Strong defined jawline & angular chin" },
              { name: "Heart", desc: "Wide forehead tapering to pointed chin" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setFaceShape(item.name)}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  faceShape === item.name
                    ? "border-brand-violet bg-purple-50 dark:bg-purple-950/60 shadow-soft scale-105"
                    : "border-purple-100 dark:border-purple-900 bg-[#FAF7FD] dark:bg-[#150D27] hover:border-purple-300"
                }`}
              >
                <p className="font-bold text-sm text-brand-ink dark:text-white">{item.name}</p>
                <p className="text-[11px] text-brand-muted mt-1">{item.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft"
            >
              <span>Next: Skin Profile</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Skin Tone & Undertone */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="text-center">
            <h2 className="text-lg font-bold text-brand-ink dark:text-white">
              2. Describe your skin undertone & type
            </h2>
            <p className="text-xs text-brand-muted mt-1">Helps select optimal makeup pigments and facial actives</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300 block mb-2">
                Skin Undertone:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: "Warm Golden", desc: "Looks stunning in gold jewelry & earthy tones" },
                  { name: "Cool Rose", desc: "Looks luminous in silver & jewel tones" },
                  { name: "Neutral Honey", desc: "Flattered by both gold and silver equally" },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setSkinUndertone(item.name)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      skinUndertone === item.name
                        ? "border-brand-violet bg-purple-50 dark:bg-purple-950/60 shadow-sm"
                        : "border-purple-100 dark:border-purple-900 bg-[#FAF7FD] dark:bg-[#150D27]"
                    }`}
                  >
                    <p className="font-bold text-xs text-brand-ink dark:text-white">{item.name}</p>
                    <p className="text-[11px] text-brand-muted mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300 block mb-2">
                Skin Type:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Combination", "Dry", "Oily", "Sensitive"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSkinType(st)}
                    className={`py-3 px-4 rounded-xl border text-center text-xs font-bold transition-all ${
                      skinType === st
                        ? "border-brand-violet bg-purple-50 dark:bg-purple-950 text-brand-deep dark:text-white"
                        : "border-purple-100 dark:border-purple-900 bg-[#FAF7FD] dark:bg-[#150D27] text-brand-muted"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-full border border-purple-200 text-xs font-semibold text-brand-muted"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft"
            >
              <span>Next: Hair Profile</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Hair Type & Goals */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="text-center">
            <h2 className="text-lg font-bold text-brand-ink dark:text-white">
              3. Hair texture & primary hair goal
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300 block mb-2">
                Natural Hair Texture:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Straight", "Wavy", "Curly", "Coily"].map((ht) => (
                  <button
                    key={ht}
                    onClick={() => setHairType(ht)}
                    className={`py-3 px-4 rounded-xl border text-center text-xs font-bold transition-all ${
                      hairType === ht
                        ? "border-brand-violet bg-purple-50 dark:bg-purple-950 text-brand-deep dark:text-white"
                        : "border-purple-100 dark:border-purple-900 bg-[#FAF7FD] dark:bg-[#150D27] text-brand-muted"
                    }`}
                  >
                    {ht}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-deep dark:text-purple-300 block mb-2">
                Primary Goal:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  "Volume & Bounce",
                  "Frizz Control & Gloss",
                  "Sun-Kissed Dimensional Color",
                ].map((g) => (
                  <button
                    key={g}
                    onClick={() => setHairGoal(g)}
                    className={`p-4 rounded-2xl border text-center text-xs font-bold transition-all ${
                      hairGoal === g
                        ? "border-brand-violet bg-purple-50 dark:bg-purple-950 text-brand-deep dark:text-white"
                        : "border-purple-100 dark:border-purple-900 bg-[#FAF7FD] dark:bg-[#150D27] text-brand-muted"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-full border border-purple-200 text-xs font-semibold text-brand-muted"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-brand-violet text-white text-xs font-bold hover:bg-brand-royal transition-all shadow-soft"
            >
              <span>Next: Occasion</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Occasion */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="text-center">
            <h2 className="text-lg font-bold text-brand-ink dark:text-white">
              4. What is the occasion you are preparing for?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Wedding / Bridal", desc: "Bride, mother, or sister of the bride celebrating wedding festivities" },
              { name: "Festive Gala / Sangeet", desc: "Diwali, Karva Chauth, Eid, or close family functions" },
              { name: "Cocktail / Red Carpet", desc: "Glamorous evening events, awards, or milestone parties" },
              { name: "Routine Luxury Care", desc: "Regular maintenance, precision trims, and restorative wellness" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setOccasion(item.name)}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  occasion === item.name
                    ? "border-brand-violet bg-purple-50 dark:bg-purple-950/60 shadow-soft scale-102"
                    : "border-purple-100 dark:border-purple-900 bg-[#FAF7FD] dark:bg-[#150D27]"
                }`}
              >
                <p className="font-bold text-sm text-brand-ink dark:text-white">{item.name}</p>
                <p className="text-xs text-brand-muted mt-1">{item.desc}</p>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-full border border-purple-200 text-xs font-semibold text-brand-muted"
            >
              Back
            </button>
            <button
              onClick={calculateRecommendation}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-royal via-brand-violet to-purple-600 text-white text-xs sm:text-sm font-bold hover:scale-105 transition-all shadow-glow"
            >
              <Sparkles className="h-4 w-4 text-brand-softgold" />
              <span>Generate My Diagnostic Blueprint</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 5: RESULTS SCREEN */}
      {step === 5 && result && (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-100/70 via-pink-100/40 to-amber-100/60 dark:from-purple-950/60 dark:via-purple-900/30 dark:to-amber-950/40 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-violet text-brand-softgold flex items-center justify-center font-bold">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-brand-violet dark:text-brand-orchid">
                  Your Bespoke Recommendation
                </span>
                <h3 className="font-heading text-2xl font-bold text-brand-ink dark:text-white">
                  The {faceShape} &amp; {skinUndertone} Glam Blueprint
                </h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Haircut */}
            <div className="p-5 rounded-3xl bg-[#FAF7FD] dark:bg-[#150D27] border border-purple-100 dark:border-purple-900 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-violet">
                Ideal Haircut
              </span>
              <h4 className="font-heading text-lg font-bold text-brand-ink dark:text-white">
                {result.cut}
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">{result.cutDesc}</p>
            </div>

            {/* Makeup */}
            <div className="p-5 rounded-3xl bg-[#FAF7FD] dark:bg-[#150D27] border border-purple-100 dark:border-purple-900 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-violet">
                Color Palette
              </span>
              <h4 className="font-heading text-lg font-bold text-brand-ink dark:text-white">
                {result.makeup}
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">{result.makeupPalette}</p>
            </div>

            {/* Skin Care */}
            <div className="p-5 rounded-3xl bg-[#FAF7FD] dark:bg-[#150D27] border border-purple-100 dark:border-purple-900 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-violet">
                Clinical Facial
              </span>
              <h4 className="font-heading text-lg font-bold text-brand-ink dark:text-white">
                {result.facial}
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">{result.facialReason}</p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-purple-100 dark:border-purple-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-violet font-semibold"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Retake Quiz</span>
            </button>

            <Link
              href="/book"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-violet text-white text-xs sm:text-sm font-bold shadow-soft hover:shadow-glow hover:scale-105 transition-all text-center"
            >
              Book This Recommended Transformation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
