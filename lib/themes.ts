export type NailTheme = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

export const NAIL_THEMES: NailTheme[] = [
  { id: "summer", name: "Summer", emoji: "☀️", description: "Bright, fun colors perfect for sunny days." },
  { id: "beach", name: "Beach", emoji: "🌊", description: "Ocean blues, sandy nudes, and vacation vibes." },
  { id: "glam", name: "Glam", emoji: "✨", description: "Glitter, chrome, and night-out shine." },
  { id: "minimal", name: "Minimal", emoji: "🤍", description: "Clean nudes, french tips, and everyday chic." },
];
