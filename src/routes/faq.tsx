import { createFileRoute } from "@tanstack/react-router";
import { Container, PageHeader } from "@/components/common/Section";

const FAQS = [
  {
    q: "How do I place an order?",
    a: "Add products to your cart, enter your details at checkout, then tap “Order on WhatsApp”. WhatsApp opens with a pre-filled message — just tap send.",
  },
  {
    q: "Can I pay on the website?",
    a: "No. There is no online payment. Our team confirms the final amount and payment method with you on WhatsApp.",
  },
  {
    q: "Is my order confirmed once I send the WhatsApp message?",
    a: "Not yet. Sending the message starts the conversation. SK Sport Store confirms availability and your order manually.",
  },
  {
    q: "Do you deliver?",
    a: "Local delivery and store pickup are both available. Ask us on WhatsApp for options in your area.",
  },
  {
    q: "What if an item is out of stock?",
    a: "Out-of-stock items are marked in the catalog. If something sells out after you order, we will suggest an alternative on WhatsApp.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — SK Sport Store" },
      {
        name: "description",
        content:
          "Answers about WhatsApp ordering, payment, delivery, stock and order confirmation at SK Sport Store.",
      },
      { property: "og:title", content: "FAQ — SK Sport Store" },
      {
        property: "og:description",
        content: "Common questions about ordering from SK Sport Store.",
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help"
        title="Frequently asked questions"
        description="Everything about ordering from SK Sport Store."
      />
      <Container className="max-w-3xl space-y-4 py-12">
        {FAQS.map((item) => (
          <div key={item.q} className="surface-panel rounded-sm p-5">
            <h2 className="text-sm font-semibold text-foreground">{item.q}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
          </div>
        ))}
      </Container>
    </>
  );
}
