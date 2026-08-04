import Link from "next/link";
import { NAIL_THEMES } from "@/lib/themes";
import { CARD_STYLE, PRIMARY_BUTTON } from "@/lib/theme";

export default function ThemeCards() {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">Shop by theme</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {NAIL_THEMES.map((theme) => (
          <Link
            key={theme.id}
            href={`/shop?theme=${theme.id}`}
            className={`${CARD_STYLE} p-4 text-left hover:border-purple-500 hover:shadow-md transition block`}
          >
            <span className="text-2xl">{theme.emoji}</span>
            <h3 className="font-bold text-lg mt-2">{theme.name}</h3>
            <p className="text-sm text-purple-700/90 mt-1">{theme.description}</p>
          </Link>
        ))}
      </div>
      <Link
        href="/custom"
        className={`inline-block mt-6 px-6 py-2 rounded-lg font-semibold ${PRIMARY_BUTTON}`}
      >
        Build a custom set
      </Link>
    </section>
  );
}
