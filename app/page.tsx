import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import ThemeCards from "@/components/ThemeCards";
import { BACKGROUND, PRIMARY_BUTTON } from "@/lib/theme";

export default function Home() {
  return (
    <main className={`min-h-screen ${BACKGROUND} pb-10 px-6`}>
      <SiteHeader />
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sm text-purple-700/90 mb-6 mt-2">
          Press-on nails with salon-quality styles — without salon prices. Pick your shape, choose your size, and get cute nails at home.
        </p>

        <Link
          href="/shop"
          className={`inline-block px-8 py-3 rounded-lg font-semibold ${PRIMARY_BUTTON}`}
        >
          Shop now
        </Link>

        <ThemeCards />
      </div>
    </main>
  );
}
