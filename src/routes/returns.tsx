import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/common/Section";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns & Exchanges — SK Sport Store" },
      {
        name: "description",
        content:
          "SK Sport Store returns and exchange guidelines for unused sports gear, sizing swaps and damaged items.",
      },
      { property: "og:title", content: "Returns & Exchanges — SK Sport Store" },
      {
        property: "og:description",
        content: "How returns and exchanges work at SK Sport Store.",
      },
    ],
  }),
  component: ReturnsPage,
});

function ReturnsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Policy"
        title="Returns & exchanges"
        description="Fair, simple and handled over WhatsApp."
      />
      <Container className="max-w-3xl space-y-4 py-12 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">Window.</strong> Unused items in original
          packaging with tags can be returned or exchanged within 7 days of delivery or
          pickup.
        </p>
        <p>
          <strong className="text-foreground">Sizing exchanges.</strong> Footwear and
          apparel can be exchanged for another size subject to availability.
        </p>
        <p>
          <strong className="text-foreground">Damaged or wrong items.</strong> Message us
          on WhatsApp with photos within 48 hours and we will replace the item.
        </p>
        <p>
          <strong className="text-foreground">Not returnable.</strong> Used equipment,
          innerwear, and customised or personalised items.
        </p>
        <p>
          To start a return, message us on WhatsApp with your name and the item details.
        </p>
      </Container>
    </>
  );
}
