import Link from "next/link";
import Image from "next/image";
import { BRAND_NAME } from "@/lib/theme";

type BrandHeaderProps = {
  cartCount?: number;
  showCart?: boolean;
};

export default function BrandHeader({ cartCount = 0, showCart = false }: BrandHeaderProps) {
  return (
    <header className="relative flex justify-center items-center mb-8 min-h-[260px]">
      <Link href="/" className="flex flex-col items-center gap-3">
        <Image
          src="/logo.png"
          alt={BRAND_NAME}
          width={205}
          height={205}
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
          aria-label={`Cart with ${cartCount} items`}
          className="absolute right-0 top-1/2 -translate-y-1/2 relative flex items-center justify-center w-16 h-14 bg-purple-100 border-2 border-purple-400 rounded-2xl hover:bg-purple-200 transition shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-purple-800"
            aria-hidden
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[1.5rem] h-6 px-1 flex items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">
              {cartCount}
            </span>
          )}
        </Link>
      )}
    </header>
  );
}
