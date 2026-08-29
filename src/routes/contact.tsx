import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Container, PageHeader } from "@/components/common/Section";
import { Button } from "@/components/common/Button";
import { config } from "@/config/config";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SK Sport Store" },
      {
        name: "description",
        content:
          "Call, email or WhatsApp SK Sport Store for product availability, sizes, delivery and order support.",
      },
      { property: "og:title", content: "Contact SK Sport Store" },
      {
        property: "og:description",
        content: "Reach SK Sport Store on WhatsApp, phone or email.",
      },
    ],
  }),
  component: ContactPage,
});

const whatsappUrl = `${config.whatsapp.baseUrl}/${config.whatsapp.number.replace(/\D/g, "")}`;

function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact us"
        description="Questions about sizes, stock or delivery? Message us — we reply fast."
      />
      <Container className="grid gap-6 py-12 sm:grid-cols-2">
        <div className="surface-panel space-y-3 rounded-sm p-6 text-sm">
          <h2 className="display-title text-2xl">Store details</h2>
          <p className="text-muted-foreground">{config.store.address}</p>
          <p className="text-muted-foreground">{config.store.hours}</p>
          <p>
            <a className="hover:text-primary" href={`tel:${config.store.phone}`}>
              {config.store.phone}
            </a>
          </p>
          <p>
            <a className="hover:text-primary" href={`mailto:${config.store.email}`}>
              {config.store.email}
            </a>
          </p>
        </div>
        <div className="surface-panel space-y-4 rounded-sm p-6 text-sm">
          <h2 className="display-title text-2xl">Order on WhatsApp</h2>
          <p className="text-muted-foreground">
            All orders are placed and confirmed over WhatsApp. There is no online
            payment on this website.
          </p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="whatsapp" size="lg">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Chat with us
            </Button>
          </a>
        </div>
      </Container>
    </>
  );
}
