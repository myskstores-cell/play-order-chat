import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cartService } from "@/services/cartService";
import type { ResolvedCart } from "@/models/Cart";

interface CartContextValue {
  cart: ResolvedCart;
  loading: boolean;
  error: string | null;
  itemCount: number;
  addItem: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  refresh: () => void;
}

const emptyCart: ResolvedCart = {
  items: [],
  subtotal: 0,
  itemCount: 0,
  unavailableProductIds: [],
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ResolvedCart>(emptyCart);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => cartService.subscribe(refresh), [refresh]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    cartService
      .resolveCart()
      .then((next) => {
        if (cancelled) return;
        setCart(next);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load your cart. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [version]);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      loading,
      error,
      itemCount: cart.itemCount,
      addItem: (productId, quantity = 1) => cartService.addItem(productId, quantity),
      updateQuantity: (productId, quantity) => cartService.updateQuantity(productId, quantity),
      removeItem: (productId) => cartService.removeItem(productId),
      clearCart: () => cartService.clearCart(),
      refresh,
    }),
    [cart, loading, error, refresh],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
