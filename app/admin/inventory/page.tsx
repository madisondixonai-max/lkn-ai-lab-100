"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import ProductImage from "@/components/ProductImage";
import {
  MOCK_PRODUCTS,
  SHAPES,
  stockBadgeClass,
  stockLabel,
  type Product,
} from "@/lib/products";
import { BACKGROUND, INPUT_STYLE, PRIMARY_BUTTON, CARD_STYLE } from "@/lib/theme";

function ClickablePhotoUpload({
  imageUrl,
  shape,
  onImageUpload,
}: {
  imageUrl: string;
  shape: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p className="text-xs text-purple-600 mb-2 font-medium">Click photo to change</p>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative w-full group rounded-lg overflow-hidden border-2 border-dashed border-purple-400 hover:border-purple-600 transition"
      >
        <ProductImage key={imageUrl} imageUrl={imageUrl} shape={shape} large />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
          <span className="text-white text-sm font-semibold">Change photo</span>
        </div>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
      />
    </div>
  );
}

type ProductFormProps = {
  name: string;
  description: string;
  shape: string;
  price: string;
  stock: string;
  imageUrl: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onShapeChange: (v: string) => void;
  onPriceChange: (v: string) => void;
  onStockChange: (v: string) => void;
  onImageUrlChange: (v: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function ProductFormFields({
  name,
  description,
  shape,
  price,
  stock,
  imageUrl,
  onNameChange,
  onDescriptionChange,
  onShapeChange,
  onPriceChange,
  onStockChange,
  onImageUrlChange,
  onImageUpload,
}: ProductFormProps) {
  return (
    <>
      <ClickablePhotoUpload imageUrl={imageUrl} shape={shape} onImageUpload={onImageUpload} />
      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Product name"
        className={`p-2 rounded-lg ${INPUT_STYLE}`}
      />
      <textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Description"
        rows={3}
        className={`p-2 rounded-lg ${INPUT_STYLE}`}
      />
      <select
        value={shape}
        onChange={(e) => onShapeChange(e.target.value)}
        className={`p-2 rounded-lg ${INPUT_STYLE}`}
      >
        {SHAPES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <input
        value={imageUrl}
        onChange={(e) => onImageUrlChange(e.target.value)}
        placeholder="Or paste image URL (e.g. /products/my-set.jpg)"
        className={`p-2 rounded-lg ${INPUT_STYLE}`}
      />
      <div className="flex gap-3">
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="Price ($)"
          className={`p-2 rounded-lg flex-1 ${INPUT_STYLE}`}
        />
        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => onStockChange(e.target.value)}
          placeholder="Stock"
          className={`p-2 rounded-lg flex-1 ${INPUT_STYLE}`}
        />
      </div>
    </>
  );
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [shapeFilter, setShapeFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newShape, setNewShape] = useState(SHAPES[0]);
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editShape, setEditShape] = useState(SHAPES[0]);
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

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
    if (editingProduct?.id === id) closeEdit();
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newPrice);
    const stock = parseInt(newStock, 10);
    if (!newName.trim() || !newDescription.trim() || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) return;

    setProducts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newName.trim(),
        shape: newShape,
        description: newDescription.trim(),
        price,
        stock,
        imageUrl: newImageUrl.trim(),
        themes: [],
      },
    ]);
    setNewName("");
    setNewShape(SHAPES[0]);
    setNewDescription("");
    setNewPrice("");
    setNewStock("");
    setNewImageUrl("");
    setShowAddForm(false);
  };

  const handleImageUpload = (setter: (url: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditShape(product.shape);
    setEditDescription(product.description);
    setEditPrice(String(product.price));
    setEditStock(String(product.stock));
    setEditImageUrl(product.imageUrl);
  };

  const closeEdit = () => {
    setEditingProduct(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const price = parseFloat(editPrice);
    const stock = parseInt(editStock, 10);
    if (!editName.trim() || !editDescription.trim() || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) return;

    const updated: Product = {
      ...editingProduct,
      name: editName.trim(),
      shape: editShape,
      description: editDescription.trim(),
      price,
      stock,
      imageUrl: editImageUrl.trim(),
    };

    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    closeEdit();
  };

  return (
    <main className={`min-h-screen ${BACKGROUND} pb-10 px-6`}>
      <SiteHeader align="left" showAuth={false} />
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Inventory</h1>
          <Link href="/" className="text-sm text-purple-600 hover:underline">
            Back to home
          </Link>
        </div>
        <p className="text-purple-600/80 text-sm mb-6">
          Admin — manage your nail sets. Changes reset on refresh.
        </p>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
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
            <ProductFormFields
              name={newName}
              description={newDescription}
              shape={newShape}
              price={newPrice}
              stock={newStock}
              imageUrl={newImageUrl}
              onNameChange={setNewName}
              onDescriptionChange={setNewDescription}
              onShapeChange={setNewShape}
              onPriceChange={setNewPrice}
              onStockChange={setNewStock}
              onImageUrlChange={setNewImageUrl}
              onImageUpload={handleImageUpload(setNewImageUrl)}
            />
            <button type="submit" className={`p-2 rounded-lg font-semibold ${PRIMARY_BUTTON}`}>
              Save product
            </button>
          </form>
        )}

        {filteredProducts.length === 0 ? (
          <p className="text-center text-purple-500 py-12">
            {products.length === 0
              ? "No products yet. Add one above."
              : "No products match this filter."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`${CARD_STYLE} p-4 flex flex-col`}
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
                  <p className="text-sm text-purple-700/90 mt-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${stockBadgeClass(product.stock)}`}
                  >
                    {stockLabel(product.stock)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStock(product.id, -1)}
                      className="w-7 h-7 rounded bg-purple-200 hover:bg-purple-300 font-bold"
                      aria-label="Decrease stock"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{product.stock}</span>
                    <button
                      onClick={() => updateStock(product.id, 1)}
                      className="w-7 h-7 rounded bg-purple-200 hover:bg-purple-300 font-bold"
                      aria-label="Increase stock"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => openEdit(product)}
                    className="text-purple-700 hover:text-purple-900 text-xs font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 p-4 z-50"
          onClick={closeEdit}
        >
          <div
            className="bg-purple-50 border border-purple-300 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Edit set</h2>
            <form onSubmit={handleSaveEdit} className="flex flex-col gap-3">
              <ProductFormFields
                name={editName}
                description={editDescription}
                shape={editShape}
                price={editPrice}
                stock={editStock}
                imageUrl={editImageUrl}
                onNameChange={setEditName}
                onDescriptionChange={setEditDescription}
                onShapeChange={setEditShape}
                onPriceChange={setEditPrice}
                onStockChange={setEditStock}
                onImageUrlChange={setEditImageUrl}
                onImageUpload={handleImageUpload(setEditImageUrl)}
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="flex-1 p-2 rounded-lg border border-purple-400 text-purple-700 hover:bg-purple-100"
                >
                  Cancel
                </button>
                <button type="submit" className={`flex-1 p-2 rounded-lg font-semibold ${PRIMARY_BUTTON}`}>
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
