import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/common/Section";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Delivery — SK Sport Store" },
      {
        name: "description",
        content:
          "How SK Sport Store handles store pickup, local delivery, timelines and delivery charges confirmed over WhatsApp.",
      },
      { property: "og:title", content: "Shipping & Delivery — SK Sport Store" },
      {
        property: "og:description",
        content: "Pickup and delivery information for SK Sport Store orders.",
      },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Policy"
        title="Shipping & delivery"
        description="Confirmed with you personally on WhatsApp for every order."
      />
      <Container className="max-w-3xl space-y-4 py-12 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">Store pickup.</strong> Reserve items on
          WhatsApp and collect them from the store during opening hours.
        </p>
        <p>
          <strong className="text-foreground">Local delivery.</strong> Available in and
          around our service area. Delivery charges depend on distance and order size
          and are shared with you before dispatch.
        </p>
        <p>
          <strong className="text-foreground">Timelines.</strong> In-stock items are
          usually dispatched within 1–3 working days after order confirmation. Special
          orders take longer and we will tell you the expected date.
        </p>
        <p>
          <strong className="text-foreground">Payment.</strong> No payment is collected
          on this website. Payment options are agreed on WhatsApp.
        </p>
      </Container>
    </>
  );
}
