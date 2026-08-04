import Link from "next/link";
import Image from "next/image";
import { BRAND_NAME } from "@/lib/theme";

type BrandHeaderProps = {
  cartCount?: number;
  showCart?: boolean;
  align?: "center" | "left";
};

export default function BrandHeader({
  cartCount = 0,
  showCart = false,
  align = "center",
}: BrandHeaderProps) {
  const isLeft = align === "left";

  return (
    <header className="relative w-screen max-w-[100vw] left-1/2 -translate-x-1/2 mb-8 overflow-visible bg-purple-50/90 border-y border-purple-300 py-5 px-8 sm:px-12 md:px-16 shadow-sm">
      <Link
        href="/"
        className={`flex items-center overflow-visible gap-6 sm:gap-8 w-full max-w-5xl ${
          isLeft
            ? "mr-auto justify-start pl-2 sm:pl-4"
            : "mx-auto justify-center"
        } ${showCart ? "pr-16 sm:pr-20" : ""}`}
      >
        <Image
          src="/logo.png"
          alt=""
          width={80}
          height={80}
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-contain shrink-0"
          priority
        />
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-800 tracking-normal px-4 sm:px-6 py-1 overflow-visible whitespace-nowrap">
          {BRAND_NAME}
        </span>
      </Link>
      {showCart && (
        <Link
          href="/cart"
          aria-label={`Cart with ${cartCount} items`}
          className="absolute top-1/2 -translate-y-1/2 right-8 sm:right-12 flex items-center justify-center w-11 h-10 bg-purple-100 border-2 border-purple-400 rounded-xl hover:bg-purple-200 transition shadow-sm"
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
