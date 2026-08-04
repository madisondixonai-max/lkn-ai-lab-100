"use client";

import { useEffect, useState } from "react";
import BrandHeader from "@/components/BrandHeader";
import ProductImage from "@/components/ProductImage";
import { addCartItem, getCart } from "@/lib/cart";
import {
  MOCK_PRODUCTS,
  SHAPES,
  SIZES,
  stockBadgeClass,
  stockLabel,
  type Product,
} from "@/lib/products";
import {
  BACKGROUND,
  CARD_STYLE,
  INPUT_STYLE,
  PRIMARY_BUTTON,
} from "@/lib/theme";

export default function ShopPage() {
  const [shapeFilter, setShapeFilter] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  useEffect(() => {
    setCartCount(getCart().length);
  }, []);

  const filteredProducts =
    shapeFilter === "All"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.shape === shapeFilter);

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    setSelectedSize(null);
  };

  const addToCart = () => {
    if (!selectedProduct || !selectedSize || selectedProduct.stock === 0) return;
    addCartItem({
      productId: selectedProduct.id,
      name: selectedProduct.name,
      shape: selectedProduct.shape,
      size: selectedSize,
      price: selectedProduct.price,
    });
    setCartCount(getCart().length);
    setAddedMessage(`${selectedProduct.name} (Size ${selectedSize}) added to cart!`);
    closeProduct();
    setTimeout(() => setAddedMessage(null), 3000);
  };

  return (
    <main className={`min-h-screen ${BACKGROUND} py-10 px-6`}>
      <div className="max-w-5xl mx-auto">
        <BrandHeader cartCount={cartCount} showCart />

        <h1 className="text-3xl font-bold mb-6">Shop</h1>

        {addedMessage && (
          <p className="mb-4 text-sm font-semibold text-green-800 bg-green-100 border border-green-300 rounded-lg px-4 py-2">
            {addedMessage}
          </p>
        )}

        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm">
            <span className="font-semibold">Filter by shape:</span>
            <select
              value={shapeFilter}
              onChange={(e) => setShapeFilter(e.target.value)}
              className={`p-2 rounded-lg ${INPUT_STYLE}`}
            >
              <option>All</option>
              {SHAPES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => openProduct(product)}
              className={`${CARD_STYLE} p-4 flex flex-col text-left cursor-pointer hover:border-purple-500 hover:shadow-md transition`}
            >
              <ProductImage imageUrl={product.imageUrl} shape={product.shape} large />
              <div className="mt-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-bold text-lg">{product.name}</h2>
                  <span className="text-xl font-bold text-purple-800 shrink-0">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-purple-500 mt-1">{product.shape}</p>
                <p className="text-sm text-purple-700/90 mt-2 leading-relaxed line-clamp-2">
                  {product.description}
                </p>
              </div>
              <div className="mt-4">
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${stockBadgeClass(product.stock)}`}
                >
                  {stockLabel(product.stock)}
                </span>
                <p className="text-xs text-purple-600 mt-2 font-medium">Tap to pick a size</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 p-4 z-50"
          onClick={closeProduct}
        >
          <div
            className={`${CARD_STYLE} p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <ProductImage imageUrl={selectedProduct.imageUrl} shape={selectedProduct.shape} large />
            <div className="mt-4">
              <div className="flex justify-between items-start gap-2">
                <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                <span className="text-xl font-bold text-purple-800">
                  ${selectedProduct.price.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-purple-500 mt-1">{selectedProduct.shape}</p>
              <p className="text-sm text-purple-700/90 mt-2">{selectedProduct.description}</p>
            </div>

            <p className="text-sm font-semibold mt-5 mb-2">Pick your size:</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  disabled={selectedProduct.stock === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                    selectedSize === size
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-purple-100 text-purple-900 border-purple-400 hover:bg-purple-200"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {size}
                </button>
              ))}
            </div>

            {selectedProduct.stock === 0 ? (
              <p className="text-sm text-red-600 mt-4">This set is sold out.</p>
            ) : !selectedSize ? (
              <p className="text-sm text-purple-500 mt-4">Choose a size to add to cart.</p>
            ) : null}

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={closeProduct}
                className="flex-1 p-2 rounded-lg border border-purple-400 text-purple-700 hover:bg-purple-100"
              >
                Close
              </button>
              {selectedSize && selectedProduct.stock > 0 && (
                <button
                  type="button"
                  onClick={addToCart}
                  className={`flex-1 p-2 rounded-lg font-semibold ${PRIMARY_BUTTON}`}
                >
                  Add to cart
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
