import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/common/Section";
import { config } from "@/config/config";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SK Sport Store" },
      {
        name: "description",
        content:
          "How SK Sport Store handles the details you enter at checkout and the information shared through WhatsApp.",
      },
      { property: "og:title", content: "Privacy Policy — SK Sport Store" },
      {
        property: "og:description",
        content: "Our approach to your personal data at SK Sport Store.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy policy" />
      <Container className="max-w-3xl space-y-4 py-12 text-sm leading-relaxed text-muted-foreground">
        <p>
          <strong className="text-foreground">What we collect.</strong> The name, phone
          number, delivery address and notes you type at checkout. These are used only
          to build your WhatsApp order message.
        </p>
        <p>
          <strong className="text-foreground">Where it is stored.</strong> Your cart is
          stored in your own browser. Checkout details are not stored on this website —
          they are sent to us through WhatsApp when you tap send.
        </p>
        <p>
          <strong className="text-foreground">WhatsApp.</strong> Messages you send are
          handled under WhatsApp's own privacy terms.
        </p>
        <p>
          <strong className="text-foreground">No payment data.</strong> This website does
          not collect card, UPI or bank details.
        </p>
        <p>
          Questions? Email {config.store.email}.
        </p>
      </Container>
    </>
  );
}
