import Link from "next/link";
import Image from "next/image";
import { BRAND_NAME } from "@/lib/theme";

type BrandHeaderProps = {
  cartCount?: number;
  showCart?: boolean;
};

export default function BrandHeader({ cartCount = 0, showCart = false }: BrandHeaderProps) {
  return (
    <header className="flex justify-between items-center mb-6">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.png" alt={BRAND_NAME} width={40} height={40} className="rounded-lg" />
        <span className="text-xl font-bold text-purple-800">{BRAND_NAME}</span>
      </Link>
      {showCart && (
        <Link
          href="/cart"
          className="text-sm font-semibold text-purple-700 bg-purple-100 border border-purple-400 px-3 py-1 rounded-full hover:bg-purple-200 transition"
        >
          Cart ({cartCount})
        </Link>
      )}
    </header>
  );
}
