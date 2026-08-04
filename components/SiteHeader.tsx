"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { NAIL_THEMES } from "@/lib/themes";
import { BRAND_NAME } from "@/lib/theme";

type SiteHeaderProps = {
  cartCount?: number;
  showCart?: boolean;
  showAuth?: boolean;
  align?: "center" | "left";
};

export default function SiteHeader({
  cartCount = 0,
  showCart = false,
  showAuth = true,
  align = "center",
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLeft = align === "left";

  return (
    <>
      <header className="relative w-screen max-w-[100vw] left-1/2 -translate-x-1/2 mb-8 overflow-visible bg-purple-50/90 border-y border-purple-300 py-5 px-8 sm:px-12 md:px-16 shadow-sm">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Open menu"
          className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 z-20 flex flex-col justify-center gap-1.5 w-10 h-10 p-2 rounded-lg hover:bg-purple-100 transition"
        >
          <span className="block h-0.5 w-6 bg-purple-800 rounded" />
          <span className="block h-0.5 w-6 bg-purple-800 rounded" />
          <span className="block h-0.5 w-6 bg-purple-800 rounded" />
        </button>

        <div className="absolute right-6 sm:right-10 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2 sm:gap-3">
          {showAuth && (
            <>
              <Link
                href="/auth/sign-in"
                className="text-xs sm:text-sm font-semibold text-purple-800 hover:text-purple-600"
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className="text-xs sm:text-sm font-semibold bg-purple-600 text-white px-2 sm:px-3 py-1.5 rounded-lg hover:bg-purple-700 transition"
              >
                Sign up
              </Link>
            </>
          )}
          {showCart && (
            <Link
              href="/cart"
              aria-label={`Cart with ${cartCount} items`}
              className="relative flex items-center justify-center w-10 h-9 bg-purple-100 border-2 border-purple-400 rounded-xl hover:bg-purple-200 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5 text-purple-800"
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
        </div>

        <Link
          href="/"
          className={`flex items-center overflow-visible gap-6 sm:gap-8 w-full max-w-5xl pt-1 ${
            isLeft ? "mr-auto justify-start pl-12 sm:pl-16" : "mx-auto justify-center"
          } px-24 sm:px-32`}
        >
          <Image
            src="/logo.png"
            alt=""
            width={80}
            height={80}
            className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-contain shrink-0"
            priority
          />
          <span className="text-xl sm:text-3xl md:text-4xl font-bold text-purple-800 tracking-normal px-2 sm:px-4 py-1 overflow-visible whitespace-nowrap">
            {BRAND_NAME}
          </span>
        </Link>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setMenuOpen(false)}
        >
          <nav
            className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-purple-50 border-r border-purple-300 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-bold text-purple-800 text-lg mb-4">Menu</p>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-purple-700 hover:text-purple-900"
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
              className="block py-2 text-purple-700 hover:text-purple-900"
            >
              Shop all
            </Link>
            <p className="font-semibold text-purple-800 mt-4 mb-2">Themes</p>
            {NAIL_THEMES.map((theme) => (
              <Link
                key={theme.id}
                href={`/shop?theme=${theme.id}`}
                onClick={() => setMenuOpen(false)}
                className="block py-2 text-purple-700 hover:text-purple-900"
              >
                {theme.emoji} {theme.name}
              </Link>
            ))}
            <Link
              href="/custom"
              onClick={() => setMenuOpen(false)}
              className="block mt-4 py-2 font-semibold text-purple-800 hover:text-purple-600"
            >
              ✨ Custom nail set
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="mt-8 text-sm text-purple-500 hover:text-purple-700"
            >
              Close
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
