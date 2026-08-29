import { config } from "@/config/config";
import { formatPrice } from "@/lib/format";
import type { OrderDraft } from "@/models/Order";

function line(label: string, value: string) {
  return `${label}\n${value}`;
}

export const whatsappService = {
  buildOrderMessage(order: OrderDraft): string {
    const items = order.lines
      .map(
        (l, index) =>
          `${index + 1}. ${l.name} (${l.sku})\nQty: ${l.quantity}\n${formatPrice(
            l.unitPrice,
          )} x ${l.quantity} = ${formatPrice(l.lineTotal)}`,
      )
      .join("\n\n");

    return [
      `${config.store.name.toUpperCase()} — NEW ORDER`,
      "",
      line("Customer:", order.customer.name.trim()),
      "",
      line("Phone:", order.customer.phone.trim()),
      "",
      "Items:",
      "",
      items,
      "",
      "-------------------------",
      `Subtotal: ${formatPrice(order.subtotal)}`,
      "-------------------------",
      "",
      line("Delivery Address:", order.customer.address.trim()),
      ...(order.customer.notes?.trim()
        ? ["", line("Notes:", order.customer.notes.trim())]
        : []),
      "",
      "Please confirm product availability,",
      "final amount, payment and delivery details.",
    ].join("\n");
  },

  generateWhatsAppUrl(message: string): string {
    const number = config.whatsapp.number.replace(/\D/g, "");
    if (!number) throw new Error("WhatsApp number is not configured.");
    return `${config.whatsapp.baseUrl}/${number}?text=${encodeURIComponent(message)}`;
  },

  openWhatsApp(message: string): void {
    const url = this.generateWhatsAppUrl(message);
    if (typeof window === "undefined") throw new Error("WhatsApp can only be opened in the browser.");
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;
  },
};
