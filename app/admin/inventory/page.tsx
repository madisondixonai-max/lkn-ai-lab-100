"use client";

import Link from "next/link";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  shape: string;
  price: number;
  stock: number;
  imageUrl: string;
};

const SHAPES = ["Almond", "Square", "Coffin"];

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Classic Almond", shape: "Almond", price: 25, stock: 12, imageUrl: "" },
  { id: "2", name: "Coffin Glitter", shape: "Coffin", price: 30, stock: 3, imageUrl: "" },
  { id: "3", name: "Square French", shape: "Square", price: 22, stock: 8, imageUrl: "" },
  { id: "4", name: "Almond Ombre", shape: "Almond", price: 28, stock: 0, imageUrl: "" },
  { id: "5", name: "Coffin Chrome", shape: "Coffin", price: 32, stock: 5, imageUrl: "" },
];

const BACKGROUND = "bg-purple-200 text-purple-700";
const INPUT_STYLE = "bg-purple-100 border border-purple-400 text-purple-900";
const PRIMARY_BUTTON = "bg-purple-600 text-white hover:bg-purple-700 transition";

function stockLabel(stock: number) {
  if (stock === 0) return "Sold out";
  if (stock <= 5) return "Low";
  return "In stock";
}

function stockBadgeClass(stock: number) {
  if (stock === 0) return "bg-red-100 text-red-700 border-red-300";
  if (stock <= 5) return "bg-amber-100 text-amber-800 border-amber-300";
  return "bg-green-100 text-green-800 border-green-300";
}

function ProductThumbnail({ imageUrl, shape }: { imageUrl: string; shape: string }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !imageUrl || failed;

  if (showPlaceholder) {
    return (
      <div className="w-12 h-12 rounded-lg bg-purple-200 border border-purple-300 flex items-center justify-center text-xs font-semibold text-purple-600">
        {shape.slice(0, 1)}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={shape}
      className="w-12 h-12 rounded-lg object-cover border border-purple-300"
      onError={() => setFailed(true)}
    />
  );
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [shapeFilter, setShapeFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newShape, setNewShape] = useState(SHAPES[0]);
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const filteredProducts =
    shapeFilter === "All"
      ? products
      : products.filter((p) => p.shape === shapeFilter);

  const updateStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newPrice);
    const stock = parseInt(newStock, 10);
    if (!newName.trim() || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) return;

    setProducts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newName.trim(),
        shape: newShape,
        price,
        stock,
        imageUrl: newImageUrl.trim(),
      },
    ]);
    setNewName("");
    setNewShape(SHAPES[0]);
    setNewPrice("");
    setNewStock("");
    setNewImageUrl("");
    setShowAddForm(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewImageUrl(URL.createObjectURL(file));
  };

  return (
    <main className={`min-h-screen ${BACKGROUND} py-10 px-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Inventory</h1>
          <Link href="/" className="text-sm text-purple-600 hover:underline">
            Back to home
          </Link>
        </div>
        <p className="text-purple-600/80 text-sm mb-6">
          Frontend only — changes reset on refresh.
        </p>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
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
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${PRIMARY_BUTTON}`}
          >
            {showAddForm ? "Cancel" : "+ Add product"}
          </button>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAddProduct}
            className={`${INPUT_STYLE} rounded-xl p-4 mb-6 flex flex-col gap-3`}
          >
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Product name"
              className={`p-2 rounded-lg ${INPUT_STYLE}`}
            />
            <select
              value={newShape}
              onChange={(e) => setNewShape(e.target.value)}
              className={`p-2 rounded-lg ${INPUT_STYLE}`}
            >
              {SHAPES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={`p-2 rounded-lg ${INPUT_STYLE}`}
            />
            {newImageUrl && (
              <div className="flex items-center gap-3">
                <ProductThumbnail imageUrl={newImageUrl} shape={newShape} />
                <span className="text-xs text-purple-600">Image preview</span>
              </div>
            )}
            <div className="flex gap-3">
              <input
                type="number"
                min="0"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Price ($)"
                className={`p-2 rounded-lg flex-1 ${INPUT_STYLE}`}
              />
              <input
                type="number"
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                placeholder="Stock"
                className={`p-2 rounded-lg flex-1 ${INPUT_STYLE}`}
              />
            </div>
            <button
              type="submit"
              className={`p-2 rounded-lg font-semibold ${PRIMARY_BUTTON}`}
            >
              Save product
            </button>
          </form>
        )}

        <div className="bg-purple-50 border border-purple-300 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-200 text-left">
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold hidden sm:table-cell">Shape</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold hidden sm:table-cell">Status</th>
                <th className="p-4 w-10" />
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-purple-500">
                    {products.length === 0
                      ? "No products yet. Add one above."
                      : "No products match this filter."}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-purple-100 last:border-none">
                    <td className="p-4">
                      <ProductThumbnail imageUrl={product.imageUrl} shape={product.shape} />
                    </td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 hidden sm:table-cell">{product.shape}</td>
                    <td className="p-4">${product.price.toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStock(product.id, -1)}
                          className="w-7 h-7 rounded bg-purple-200 hover:bg-purple-300 font-bold"
                          aria-label="Decrease stock"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{product.stock}</span>
                        <button
                          onClick={() => updateStock(product.id, 1)}
                          className="w-7 h-7 rounded bg-purple-200 hover:bg-purple-300 font-bold"
                          aria-label="Increase stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${stockBadgeClass(product.stock)}`}
                      >
                        {stockLabel(product.stock)}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                        aria-label="Remove product"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
