import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";
import { BACKGROUND, BRAND_NAME, BRAND_TAGLINE, PRIMARY_BUTTON } from "@/lib/theme";

export default function Home() {
  return (
    <main className={`min-h-screen ${BACKGROUND} py-10 px-6`}>
      <div className="max-w-xl mx-auto text-center">
        <BrandHeader />

        <h1 className="text-4xl font-bold mt-8 mb-3">{BRAND_NAME}</h1>
        <p className="text-lg text-purple-600 mb-2">{BRAND_TAGLINE}</p>
        <p className="text-sm text-purple-700/90 mb-8">
          Press-on nails with salon-quality styles — without salon prices. Pick your shape, choose your size, and get cute nails at home.
        </p>

        <Link
          href="/shop"
          className={`inline-block px-8 py-3 rounded-lg font-semibold ${PRIMARY_BUTTON}`}
        >
          Shop now
        </Link>
      </div>
    </main>
  );
}
