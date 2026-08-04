"use client";

import Link from "next/link";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  shape: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
};

const SHAPES = ["Almond", "Square", "Coffin"];
const SIZES = ["XS", "S", "M", "L", "XL"];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Classic Almond",
    shape: "Almond",
    description: "Soft nude pink with a glossy finish. Perfect for everyday wear.",
    price: 25,
    stock: 12,
    imageUrl: "/products/classic-almond.jpg",
  },
  {
    id: "2",
    name: "Coffin Glitter",
    shape: "Coffin",
    description: "Silver glitter fade on a coffin shape. Great for nights out.",
    price: 30,
    stock: 3,
    imageUrl: "/products/coffin-glitter.jpg",
  },
  {
    id: "3",
    name: "Square French",
    shape: "Square",
    description: "Clean white tips on a square shape. Timeless and classy.",
    price: 22,
    stock: 8,
    imageUrl: "/products/square-french.jpg",
  },
  {
    id: "4",
    name: "Almond Ombre",
    shape: "Almond",
    description: "Purple-to-pink ombre on almond nails. Bold but still cute.",
    price: 28,
    stock: 0,
    imageUrl: "/products/almond-ombre.jpg",
  },
  {
    id: "5",
    name: "Coffin Chrome",
    shape: "Coffin",
    description: "Mirror chrome finish with a coffin shape. Stands out in photos.",
    price: 32,
    stock: 5,
    imageUrl: "/products/coffin-chrome.jpg",
  },
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

function ProductImage({ imageUrl, shape, large }: { imageUrl: string; shape: string; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !imageUrl || failed;
  const sizeClass = large ? "w-full h-40" : "w-12 h-12";

  if (showPlaceholder) {
    return (
      <div
        className={`${sizeClass} rounded-lg bg-purple-200 border border-purple-300 flex items-center justify-center text-2xl font-semibold text-purple-600`}
      >
        {shape.slice(0, 1)}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={shape}
      className={`${sizeClass} rounded-lg object-cover border border-purple-300`}
      onError={() => setFailed(true)}
    />
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
        placeholder="Image URL (e.g. /products/my-set.jpg)"
        className={`p-2 rounded-lg ${INPUT_STYLE}`}
      />
      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className={`p-2 rounded-lg ${INPUT_STYLE}`}
      />
      {imageUrl && (
        <div className="flex items-center gap-3">
          <ProductImage imageUrl={imageUrl} shape={shape} />
          <span className="text-xs text-purple-600">Image preview</span>
        </div>
      )}
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
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
    if (selectedProduct?.id === id) closeProduct();
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

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(null);
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    setSelectedSize(null);
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
    if (selectedProduct?.id === updated.id) setSelectedProduct(updated);
    closeEdit();
  };

  return (
    <main className={`min-h-screen ${BACKGROUND} py-10 px-6`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Inventory</h1>
          <Link href="/" className="text-sm text-purple-600 hover:underline">
            Back to home
          </Link>
        </div>
        <p className="text-purple-600/80 text-sm mb-6">
          Frontend only — changes reset on refresh.
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
                role="button"
                tabIndex={0}
                onClick={() => openProduct(product)}
                onKeyDown={(e) => e.key === "Enter" && openProduct(product)}
                className="bg-purple-50 border border-purple-300 rounded-xl p-4 flex flex-col cursor-pointer hover:border-purple-500 hover:shadow-md transition"
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
                  <p className="text-xs text-purple-600 mt-2 font-medium">Tap to pick a size</p>
                </div>
                <div className="mt-4 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
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
                <div className="mt-3 flex gap-3" onClick={(e) => e.stopPropagation()}>
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

      {selectedProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 p-4 z-50"
          onClick={closeProduct}
        >
          <div
            className="bg-purple-50 border border-purple-300 rounded-xl p-6 max-w-sm w-full max-h-[90vh] overflow-y-auto"
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
            ) : selectedSize ? (
              <p className="text-sm text-purple-700 mt-4">
                Selected: <span className="font-semibold">{selectedProduct.name}</span> — Size{" "}
                <span className="font-semibold">{selectedSize}</span>
              </p>
            ) : (
              <p className="text-sm text-purple-500 mt-4">Choose a size to continue.</p>
            )}

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => {
                  closeProduct();
                  openEdit(selectedProduct);
                }}
                className="flex-1 p-2 rounded-lg border border-purple-400 text-purple-700 hover:bg-purple-100 text-sm font-semibold"
              >
                Edit set
              </button>
              <button
                onClick={closeProduct}
                className="flex-1 p-2 rounded-lg border border-purple-400 text-purple-700 hover:bg-purple-100"
              >
                Close
              </button>
              {selectedSize && selectedProduct.stock > 0 && (
                <button
                  onClick={closeProduct}
                  className={`flex-1 p-2 rounded-lg font-semibold ${PRIMARY_BUTTON}`}
                >
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
