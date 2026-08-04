import Link from "next/link";
import Image from "next/image";
import { BRAND_NAME } from "@/lib/theme";

type BrandHeaderProps = {
  cartCount?: number;
  showCart?: boolean;
};

export default function BrandHeader({ cartCount = 0, showCart = false }: BrandHeaderProps) {
  return (
    <header className="relative w-screen max-w-[100vw] left-1/2 -translate-x-1/2 mb-8 bg-purple-50/90 border-y border-purple-300 py-4 px-4 shadow-sm">
      <Link href="/" className="block w-full max-w-5xl mx-auto">
        <Image
          src="/logo.png"
          alt={BRAND_NAME}
          width={1200}
          height={160}
          className="w-full h-[120px] object-contain object-center"
          priority
        />
      </Link>
      {showCart && (
        <Link
          href="/cart"
          aria-label={`Cart with ${cartCount} items`}
          className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-6 flex items-center justify-center w-11 h-10 bg-purple-100 border-2 border-purple-400 rounded-xl hover:bg-purple-200 transition shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-purple-800"
            aria-hidden
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-purple-600 text-white text-[10px] font-bold">
              {cartCount}
            </span>
          )}
        </Link>
      )}
    </header>
  );
}
