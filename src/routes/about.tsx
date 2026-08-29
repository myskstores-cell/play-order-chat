import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/common/Section";
import { config } from "@/config/config";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — SK Sport Store" },
      {
        name: "description",
        content:
          "SK Sport Store is a local sports retailer stocking equipment, footwear and apparel, with friendly WhatsApp ordering.",
      },
      { property: "og:title", content: "About Us — SK Sport Store" },
      {
        property: "og:description",
        content: "Learn about SK Sport Store and how our WhatsApp ordering works.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="About SK Sport Store"
        description={config.store.tagline}
      />
      <Container className="prose-invert max-w-3xl space-y-5 py-12 text-sm leading-relaxed text-muted-foreground">
        <p>
          SK Sport Store is a neighbourhood sports retailer stocking equipment,
          footwear, apparel and accessories for cricket, football, badminton, tennis,
          basketball, running and fitness training.
        </p>
        <p>
          We keep the buying process simple: browse the catalog online, add what you
          need to your cart, share your details, and send the order to us on WhatsApp.
          Our team checks availability, confirms the final amount, and arranges pickup
          or delivery with you directly.
        </p>
        <p>
          There is no online payment on this website. Every order is confirmed manually
          by a real person at the store.
        </p>
        <p>
          Visit us at {config.store.address}. We are open {config.store.hours}.
        </p>
      </Container>
    </>
  );
}
