"use client";

// ===============================
// v4.0.0 — AI Content Engine (polish + customization)
// ===============================
// This version:
// - improves spacing + layout polish
// - introduces simple branding customization
// - keeps logic identical (no new complexity)
// ===============================

import { useState, useEffect } from "react";

export default function Home() {
  // ===============================
  // STATE
  // ===============================

  const [ideas, setIdeas] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [usage, setUsage] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [platform, setPlatform] = useState("TikTok");
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("Storytelling");
  const [length, setLength] = useState("1–2 sentences");

  // ===============================
  // CONFIG (CUSTOMIZE YOUR APP)
  // ===============================

  // 👉 Change this to rename your app
  // Examples: "Hook Generator", "Content Machine", "Creator Lab"
  const APP_NAME = "AI Content Engine";

  // 👉 Change your button style (Tailwind classes)
  // Examples:
  // "bg-blue-500 text-white hover:bg-blue-600"
  // "bg-red-500 text-white hover:bg-red-600"
  // "bg-white text-black hover:bg-gray-100"
  const PRIMARY_BUTTON = "bg-white text-black";

  // 👉 Change your background + text color
  // Examples:
  // "bg-black text-white"
  // "bg-zinc-900 text-white"
  // "bg-white text-black"
  const BACKGROUND = "bg-black text-white";

  // 👉 Change input box styling (Tailwind classes)
  // Examples:
  // "bg-gray-900 border border-white/10 text-white"
  // "bg-gray-800 border border-white/20 text-white"
  // "bg-white border border-gray-300 text-black"
  const INPUT_STYLE = "bg-gray-900 border border-white/10 text-white";

  // Backend API (do not change)
  const BASE_URL = "https://lkn-ai-backend.vercel.app";

  // 👉 Paste your assigned user ID here
  const userId = "";

  // ===============================
  // LENGTH MAP
  // ===============================

  const LENGTH_MAP: Record<string, string> = {
    "1–2 sentences": "Each idea must be 1–2 sentences. Concise and punchy.",
    "3-4 sentences": "Each idea must be 3–4 sentences. Include more detail.",
    "Short punchy": "Each idea must be max 10–15 words. No filler.",
  };

  // ===============================
  // FETCH CREDITS
  // ===============================

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/credits?userId=${userId}`);
        const data = await res.json();
        setCredits(res.ok ? (data.credits ?? 0) : 0);
      } catch {
        console.error("Failed to fetch credits");
      }
    };

    fetchCredits();
  }, [userId]);

  // ===============================
  // GENERATE IDEAS
  // ===============================

  const handleClick = async () => {
    if (!platform) return setIdeas("Select a platform.");
    if (!topic.trim()) return setIdeas("Enter a topic.");
    if (!style) return setIdeas("Select a style.");
    if (!length) return setIdeas("Select a length.");
    if (credits === null || credits <= 0) return setIdeas("No credits left.");

    setLoading(true);
    setModel(null);
    setError(null);

    try {
      const prompt = `
Generate 3 content ideas for ${platform} about ${topic}.
Style: ${style}
Length: ${LENGTH_MAP[length]}
`;

      const res = await fetch(`${BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userId }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setIdeas((data?.ideas || "").replace(/\*\*/g, ""));
      setCredits(data.creditsRemaining);
      setModel(data.model?.replace(/-\d{4}-\d{2}-\d{2}$/, ""));
      setUsage(data.usage);

    } catch {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  // ===============================
  // UI
  // ===============================

  return (
    <>
      <main className={`min-h-screen ${BACKGROUND} flex items-center justify-center`}>
        <div className="w-full max-w-xl px-6">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{APP_NAME}</h1>
            <span className="text-sm text-gray-400">
              {credits !== null ? `${credits}/50` : "--/50"}
            </span>
          </div>

          <p className="text-gray-400 mb-6 text-sm">
            Customize your content ideas
          </p>

          {/* Inputs */}
          <div className="flex flex-col gap-3 mb-6">
            <select 
              value={platform} 
              onChange={(e) => setPlatform(e.target.value)}
              className={`p-3 rounded-lg ${INPUT_STYLE}`}
            >
              <option>TikTok</option>
              <option>Instagram</option>
              <option>YouTube</option>
            </select>

            <input 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic"
              className={`p-3 rounded-lg ${INPUT_STYLE}`}
            />

            <select 
              value={style} 
              onChange={(e) => setStyle(e.target.value)}
              className={`p-3 rounded-lg ${INPUT_STYLE}`}
            >
              <option>Humorous</option>
              <option>Educational</option>
              <option>Storytelling</option>
            </select>

            <select 
              value={length} 
              onChange={(e) => setLength(e.target.value)}
              className={`p-3 rounded-lg ${INPUT_STYLE}`}
            >
              <option>1–2 sentences</option>
              <option>3-4 sentences</option>
              <option>Short punchy</option>
            </select>
          </div>

          {/* Button */}
          <button
            onClick={handleClick}
            disabled={loading || credits === null || credits <= 0}
            className={`w-full p-3 font-semibold rounded-lg ${
              loading || credits === null || credits <= 0
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : PRIMARY_BUTTON
            }`}
          >
            {loading ? "Generating..." : "Generate Ideas"}
          </button>

          {/* Output */}
          <div className="mt-10">
            <div className="bg-gray-950 border border-white/10 rounded-xl py-6 px-5 min-h-[160px]">
              {ideas ? (
                <div className="space-y-4 pb-2">
                  {ideas.split(/\n?\s*\d+/).filter(Boolean).map((item, i) => (
                    <div key={i}>{i + 1}. {item.trim()}</div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  Ideas will show here...
                </div>
              )}
            </div>
          </div>

          {/* Token + Model Footer */}
          <div className="flex justify-between mt-3 text-xs text-gray-500">
            <div>
              {usage ? (
                <span>
                  tokens: {usage.prompt_tokens} in / {usage.completion_tokens} out
                </span>
              ) : (
                <span>tokens: —</span>
              )}
            </div>
            <div>
              model: {model || "—"}
            </div>
          </div>

        </div>
      </main>

      {/* Error Modal */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="bg-gray-900 p-6 rounded">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}