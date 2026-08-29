import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/common/Section";
import { config } from "@/config/config";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SK Sport Store" },
      {
        name: "description",
        content:
          "Terms covering catalog accuracy, pricing, WhatsApp order confirmation and manual fulfilment at SK Sport Store.",
      },
      { property: "og:title", content: "Terms of Service — SK Sport Store" },
      {
        property: "og:description",
        content: "The terms that apply when you order from SK Sport Store.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of service" />
      <Container className="max-w-3xl space-y-4 py-12 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">Catalog and pricing.</strong> Product
          details, prices and availability are shown in good faith and may change. The
          final amount is confirmed by {config.store.name} on WhatsApp.
        </p>
        <p>
          <strong className="text-foreground">Orders.</strong> Sending a WhatsApp message
          is a request to buy, not a confirmed order. An order exists only once our team
          confirms it.
        </p>
        <p>
          <strong className="text-foreground">No online payment.</strong> This website
          never takes payment. Ignore anyone asking you to pay through this site.
        </p>
        <p>
          <strong className="text-foreground">Use of the site.</strong> Do not misuse,
          scrape or attempt to disrupt the website.
        </p>
      </Container>
    </>
  );
}
