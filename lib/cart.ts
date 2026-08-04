export type CartItem = {
  id: string;
  productId: string;
  name: string;
  shape: string;
  size: string;
  price: number;
};

const CART_KEY = "nbm-cart";

export const SHIPPING_FEE = 8;

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addCartItem(item: Omit<CartItem, "id">) {
  const cart = getCart();
  cart.push({ ...item, id: crypto.randomUUID() });
  setCart(cart);
}

export function removeCartItem(id: string) {
  setCart(getCart().filter((i) => i.id !== id));
}

export function clearCart() {
  sessionStorage.removeItem(CART_KEY);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price, 0);
}

// Next 14 days for local pickup
export function getPickupDates(): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) dates.push(d); // skip Sundays
  }
  return dates;
}

export const PICKUP_TIMES = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"];

export function formatPickupDate(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
