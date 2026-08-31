import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Container, PageHeader } from "@/components/common/Section";
import { Button } from "@/components/common/Button";
import { Input, Textarea } from "@/components/common/Input";
import { EmptyState, LoadingState } from "@/components/common/States";
import { useCart } from "@/hooks/useCart";
import { ordersApi } from "@/api/ordersApi";
import { formatPrice } from "@/lib/format";
import type { Customer, CustomerErrors } from "@/models/Customer";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Customer Details — SK Sport Store" },
      {
        name: "description",
        content:
          "Enter your delivery details and send your SK Sport Store order to us on WhatsApp for manual confirmation.",
      },
      { property: "og:title", content: "Customer Details — SK Sport Store" },
      {
        property: "og:description",
        content: "Send your order to SK Sport Store on WhatsApp.",
      },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, loading } = useCart();
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [sent, setSent] = useState(false);

  function update(field: keyof Customer, value: string) {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    const nextErrors = ordersApi.validateCustomer(customer);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const prepared = ordersApi.prepare(customer, cart.items);
    ordersApi.openWhatsApp(prepared.message);
    setSent(true);
  }

  if (loading) return <LoadingState label="Loading your cart…" />;

  return (
    <>
      <PageHeader
        eyebrow="Step 2 of 2"
        title="Your details"
        description="We use these details only to prepare your WhatsApp message."
      />
      <Container className="py-10">
        {cart.items.length === 0 ? (
          <EmptyState
            title="Nothing to order"
            message="Add products to your cart first."
            action={
              <Link to="/products">
                <Button>Shop products</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
            <form
              className="surface-panel space-y-4 rounded-sm p-5"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
            >
              <Input
                label="Full name"
                required
                value={customer.name}
                error={errors.name}
                onChange={(e) => update("name", e.target.value)}
              />
              <Input
                label="Phone number"
                type="tel"
                required
                value={customer.phone}
                error={errors.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
              <Textarea
                label="Delivery address"
                required
                value={customer.address}
                error={errors.address}
                onChange={(e) => update("address", e.target.value)}
              />
              <Textarea
                label="Notes (optional)"
                value={customer.notes ?? ""}
                hint="Preferred size, colour, delivery timing, etc."
                onChange={(e) => update("notes", e.target.value)}
              />
              <Button type="submit" variant="whatsapp" size="lg" fullWidth>
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Order on WhatsApp
              </Button>
              <p className="text-xs text-muted-foreground">
                This opens WhatsApp with a pre-filled message. Tap send in WhatsApp — your order is
                confirmed manually by SK Sport Store. No payment is taken on this website.
              </p>
              {sent && (
                <p role="status" className="text-xs text-primary">
                  WhatsApp should now be open with your message ready to send.
                </p>
              )}
            </form>

            <aside className="surface-panel h-fit rounded-sm p-5">
              <h2 className="display-title text-xl">Order summary</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {cart.items.map((item) => (
                  <li key={item.product.id} className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">{formatPrice(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-border pt-4 text-sm">
                <span className="font-semibold uppercase tracking-wider">Subtotal</span>
                <span className="font-bold">{formatPrice(cart.subtotal)}</span>
              </div>
            </aside>
          </div>
        )}
      </Container>
    </>
  );
}
