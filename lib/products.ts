export type Product = {
  id: string;
  name: string;
  shape: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
};

export const SHAPES = ["Almond", "Square", "Coffin"];
export const SIZES = ["XS", "S", "M", "L", "XL"];

export const MOCK_PRODUCTS: Product[] = [
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

export function stockLabel(stock: number) {
  if (stock === 0) return "Sold out";
  if (stock <= 5) return "Low";
  return "In stock";
}

export function stockBadgeClass(stock: number) {
  if (stock === 0) return "bg-red-100 text-red-700 border-red-300";
  if (stock <= 5) return "bg-amber-100 text-amber-800 border-amber-300";
  return "bg-green-100 text-green-800 border-green-300";
}
