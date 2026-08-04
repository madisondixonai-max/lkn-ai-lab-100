import Link from "next/link";
import BrandHeader from "@/components/BrandHeader";
import { BACKGROUND, PRIMARY_BUTTON } from "@/lib/theme";

export default function Home() {
  return (
    <main className={`min-h-screen ${BACKGROUND} py-10 px-6`}>
      <div className="max-w-xl mx-auto text-center">
        <BrandHeader />

        <p className="text-sm text-purple-700/90 mb-8 mt-6">
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
