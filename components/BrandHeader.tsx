import Link from "next/link";
import Image from "next/image";
import { BRAND_NAME } from "@/lib/theme";

type BrandHeaderProps = {
  cartCount?: number;
  showCart?: boolean;
};

export default function BrandHeader({ cartCount = 0, showCart = false }: BrandHeaderProps) {
  return (
    <header className="relative flex justify-center items-center mb-8 min-h-[140px]">
      <Link href="/" className="flex flex-col items-center gap-3">
        <Image
          src="/logo.png"
          alt={BRAND_NAME}
          width={100}
          height={100}
          className="rounded-xl"
          priority
        />
        <span className="font-[family-name:var(--font-brand)] text-3xl font-bold text-purple-800 tracking-wide">
          {BRAND_NAME}
        </span>
      </Link>
      {showCart && (
        <Link
          href="/cart"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-semibold text-purple-700 bg-purple-100 border border-purple-400 px-3 py-1 rounded-full hover:bg-purple-200 transition"
        >
          Cart ({cartCount})
        </Link>
      )}
    </header>
  );
}
