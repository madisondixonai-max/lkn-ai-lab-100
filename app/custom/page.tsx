"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import { SHAPES, SIZES } from "@/lib/products";
import { NAIL_THEMES } from "@/lib/themes";
import { BACKGROUND, CARD_STYLE, INPUT_STYLE, PRIMARY_BUTTON } from "@/lib/theme";

export default function CustomSetPage() {
  const [shape, setShape] = useState(SHAPES[0]);
  const [size, setSize] = useState(SIZES[2]);
  const [theme, setTheme] = useState(NAIL_THEMES[0].id);
  const [colors, setColors] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className={`min-h-screen ${BACKGROUND} py-10 px-6`}>
      <div className="max-w-xl mx-auto">
        <SiteHeader />

        <div className={`${CARD_STYLE} p-6 mt-4`}>
          <h1 className="text-2xl font-bold mb-2">Build a custom nail set</h1>
          <p className="text-sm text-purple-700/90 mb-6">
            Tell Madison what you want — shape, size, colors, and vibe. She&apos;ll reach out with a quote.
          </p>

          {submitted ? (
            <p className="text-sm font-semibold text-green-800 bg-green-100 border border-green-300 rounded-lg px-4 py-3">
              Your custom request was saved! Madison will follow up soon (preview — no backend yet).
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block text-sm">
                <span className="font-semibold">Shape</span>
                <select
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                  className={`mt-1 w-full p-2 rounded-lg ${INPUT_STYLE}`}
                >
                  {SHAPES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="font-semibold">Size</span>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className={`mt-1 w-full p-2 rounded-lg ${INPUT_STYLE}`}
                >
                  {SIZES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="font-semibold">Theme / vibe</span>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className={`mt-1 w-full p-2 rounded-lg ${INPUT_STYLE}`}
                >
                  {NAIL_THEMES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.emoji} {t.name}
                    </option>
                  ))}
                  <option value="other">Other — describe below</option>
                </select>
              </label>

              <label className="block text-sm">
                <span className="font-semibold">Colors &amp; design</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. coral ombre with gold flakes"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  className={`mt-1 w-full p-2 rounded-lg ${INPUT_STYLE}`}
                />
              </label>

              <label className="block text-sm">
                <span className="font-semibold">Extra notes (optional)</span>
                <textarea
                  rows={3}
                  placeholder="Inspiration pics, occasion, anything else..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={`mt-1 w-full p-2 rounded-lg ${INPUT_STYLE}`}
                />
              </label>

              <button type="submit" className={`w-full p-2 rounded-lg font-semibold ${PRIMARY_BUTTON}`}>
                Submit custom request
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
