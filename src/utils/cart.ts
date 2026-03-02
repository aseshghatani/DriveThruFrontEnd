
interface OrderItem {
  id: number;
  menu_id: number;
  menu_name: string;
  selections: {
    addon: AddonSelection[];
    variant: VariantSelection[];
  };
  unit_price: number;
  total_price: number;
  quantity: number;
}
interface AddonSelection {
  name: string;
  price: number;
}

interface VariantSelection {
  name: string;
  price: number;
}

type Cart = OrderItem[];
export const CART_KEY = "cart";

export function getCart() {
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: Cart): void {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated")); // 👈 add this
}
export function removeFromCart(id: number): void {
  const cart = getCart();
  const updated = cart.filter((item: OrderItem) => item.id !== id);
  saveCart(updated);
  window.dispatchEvent(new Event("cartUpdated"));
}
export function clearCart() {
  sessionStorage.removeItem(CART_KEY);
}