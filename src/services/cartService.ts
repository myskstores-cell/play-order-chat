import { config } from "@/config/config";
import type { CartItem, ResolvedCart } from "@/models/Cart";
import type { Product } from "@/models/Product";
import { productService } from "./productService";

/**
 * The ONLY module in the app allowed to touch localStorage.
 */
const KEY = config.cart.storageKey;
const listeners = new Set<() => void>();

function canUseStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function read(): CartItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is CartItem =>
          !!item &&
          typeof item.productId === "string" &&
          typeof item.quantity === "number",
      )
      .map((item) => ({
        productId: item.productId,
        quantity: Math.max(1, Math.floor(item.quantity)),
      }));
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  if (canUseStorage()) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode) — cart stays in-memory for this session */
    }
  }
  listeners.forEach((fn) => fn());
}

export const cartService = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getCart(): CartItem[] {
    return read();
  },

  addItem(productId: string, quantity = 1): CartItem[] {
    const items = read();
    const existing = items.find((i) => i.productId === productId);
    if (existing) existing.quantity += quantity;
    else items.push({ productId, quantity: Math.max(1, quantity) });
    write(items);
    return items;
  },

  updateQuantity(productId: string, quantity: number): CartItem[] {
    let items = read();
    if (quantity <= 0) {
      items = items.filter((i) => i.productId !== productId);
    } else {
      const existing = items.find((i) => i.productId === productId);
      if (existing) existing.quantity = Math.floor(quantity);
      else items.push({ productId, quantity: Math.floor(quantity) });
    }
    write(items);
    return items;
  },

  removeItem(productId: string): CartItem[] {
    const items = read().filter((i) => i.productId !== productId);
    write(items);
    return items;
  },

  clearCart(): void {
    write([]);
  },

  getItemCount(): number {
    return read().reduce((sum, i) => sum + i.quantity, 0);
  },

  calculateSubtotal(items: { product: Product; quantity: number }[]): number {
    return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  },

  /** Joins stored ids with live product data. */
  async resolveCart(): Promise<ResolvedCart> {
    const stored = read();
    if (stored.length === 0)
      return { items: [], subtotal: 0, itemCount: 0, unavailableProductIds: [] };

    const products = await productService.getProductsByIds(
      stored.map((i) => i.productId),
    );
    const byId = new Map(products.map((p) => [p.id, p]));
    const items = stored
      .filter((i) => byId.has(i.productId))
      .map((i) => {
        const product = byId.get(i.productId)!;
        return {
          product,
          quantity: i.quantity,
          lineTotal: product.price * i.quantity,
        };
      });

    return {
      items,
      subtotal: items.reduce((sum, i) => sum + i.lineTotal, 0),
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
      unavailableProductIds: stored
        .filter((i) => !byId.has(i.productId))
        .map((i) => i.productId),
    };
  },
};
