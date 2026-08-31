import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Container, PageHeader } from "@/components/common/Section";
import { Button } from "@/components/common/Button";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/States";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — SK Sport Store" },
      {
        name: "description",
        content:
          "Review the items in your SK Sport Store cart before sending your order on WhatsApp.",
      },
      { property: "og:title", content: "Your Cart — SK Sport Store" },
      {
        property: "og:description",
        content: "Review your cart and continue to WhatsApp ordering.",
      },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, loading, error, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <>
      <PageHeader
        eyebrow="Step 1 of 2"
        title="Your cart"
        description="Orders are completed on WhatsApp — no online payment."
      />
      <Container className="py-10">
        {loading ? (
          <LoadingState label="Loading your cart…" />
        ) : error ? (
          <ErrorState message={error} />
        ) : cart.items.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            message="Browse the catalog and add the gear you need."
            action={
              <Link to="/products">
                <Button>Shop products</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
            <ul className="space-y-4">
              {cart.items.map((item) => (
                <li key={item.product.id} className="surface-panel flex gap-4 rounded-sm p-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-surface-strong">
                    {item.product.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      to="/product/$slug"
                      params={{ slug: item.product.slug }}
                      className="text-sm font-semibold hover:text-primary"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(item.product.price)} · SKU {item.product.sku}
                    </p>
                    <div className="mt-auto flex items-center gap-3 pt-3">
                      <div className="flex items-center rounded-sm border border-border">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.product.name}`}
                          className="h-9 w-9"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.product.name}`}
                          className="h-9 w-9"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Remove
                      </button>
                      <span className="ml-auto text-sm font-bold">
                        {formatPrice(item.lineTotal)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="surface-panel h-fit rounded-sm p-5">
              <h2 className="display-title text-xl">Summary</h2>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-muted-foreground">Items ({cart.itemCount})</span>
                <span className="font-bold">{formatPrice(cart.subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Delivery and final amount are confirmed by our team on WhatsApp.
              </p>
              <Link to="/checkout" className="mt-5 block">
                <Button fullWidth size="lg">
                  Continue to details
                </Button>
              </Link>
              <Button variant="ghost" size="sm" fullWidth className="mt-2" onClick={clearCart}>
                Clear cart
              </Button>
            </aside>
          </div>
        )}
      </Container>
    </>
  );
}
