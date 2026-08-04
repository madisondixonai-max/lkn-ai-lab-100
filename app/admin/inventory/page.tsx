"use client";

import Link from "next/link";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  shape: string;
  price: number;
  stock: number;
};

const SHAPES = ["Almond", "Coffin", "Stiletto", "Square", "Round", "Ballerina"];

const MOCK_PRODUCTS: Product[] = [
  { id: "1", name: "Classic Almond", shape: "Almond", price: 25, stock: 12 },
  { id: "2", name: "Coffin Glitter", shape: "Coffin", price: 30, stock: 3 },
  { id: "3", name: "Stiletto Ombre", shape: "Stiletto", price: 32, stock: 0 },
  { id: "4", name: "Square French", shape: "Square", price: 22, stock: 8 },
  { id: "5", name: "Round Pastel", shape: "Round", price: 20, stock: 5 },
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

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newShape, setNewShape] = useState(SHAPES[0]);
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

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
      },
    ]);
    setNewName("");
    setNewShape(SHAPES[0]);
    setNewPrice("");
    setNewStock("");
    setShowAddForm(false);
  };

  return (
    <main className={`min-h-screen ${BACKGROUND} py-10 px-6`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Inventory</h1>
          <Link href="/" className="text-sm text-purple-600 hover:underline">
            Back to home
          </Link>
        </div>
        <p className="text-purple-600/80 text-sm mb-6">
          Frontend only — changes reset on refresh.
        </p>

        <div className="flex justify-end mb-4">
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
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold hidden sm:table-cell">Shape</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold hidden sm:table-cell">Status</th>
                <th className="p-4 w-10" />
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-purple-500">
                    No products yet. Add one above.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-purple-100 last:border-none">
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
