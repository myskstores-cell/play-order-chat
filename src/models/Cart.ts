import type { Product } from "./Product";

/** Shape persisted in localStorage — product ids and quantities only. */
export interface CartItem {
  productId: string;
  quantity: number;
}

/** Cart item joined with live product data from the product service. */
export interface ResolvedCartItem {
  product: Product;
  quantity: number;
  lineTotal: number;
}

export interface ResolvedCart {
  items: ResolvedCartItem[];
  subtotal: number;
  itemCount: number;
  /** Ids that no longer resolve to an active product. */
  unavailableProductIds: string[];
}
