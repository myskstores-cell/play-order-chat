import { config } from "@/config/config";
import { formatPrice } from "@/lib/format";
import type { OrderDraft } from "@/models/Order";
import type { ResolvedCartItem } from "@/models/Cart";
import type { Customer } from "@/models/Customer";

export interface DirectProductOrder {
  id?: string;
  sku?: string;
  name: string;
  price: number;
  size?: string | null;
  brand?: string | null;
  sport?: string | null;
}

export const whatsappService = {
  /**
   * Direct "DM to Buy" / Single product WhatsApp order message with Product ID, Name, Quantity, Price, and Total.
   */
  buildDirectProductOrderMessage(product: DirectProductOrder, quantity: number = 1): string {
    const qty = Math.max(1, quantity);
    const unitPrice = Number(product.price) || 0;
    const totalPrice = unitPrice * qty;
    const skuOrId = product.sku || product.id || "N/A";

    const lines: string[] = [
      `🛍️ *NEW ORDER INQUIRY — ${config.store.name.toUpperCase()}*`,
      "",
      `📦 *Product ID / SKU:* ${skuOrId}`,
      `🏷️ *Product Name:* ${product.name}`,
      ...(product.brand ? [`🏢 *Brand:* ${product.brand}`] : []),
      ...(product.size ? [`📏 *Size:* ${product.size}`] : []),
      `🔢 *Quantity:* ${qty}`,
      `💵 *Unit Price:* ${formatPrice(unitPrice)}`,
      "━━━━━━━━━━━━━━━━━━━━",
      `💰 *Total Price:* ${formatPrice(totalPrice)}${qty > 1 ? ` (${formatPrice(unitPrice)} × ${qty})` : ""}`,
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      `Hi ${config.store.name} 👋, I would like to order this item! Please confirm stock availability, payment options, and delivery timing.`,
    ];

    return lines.join("\n");
  },

  /**
   * Complete multi-product cart order message with Customer Info, Product IDs, Names, Quantities, Unit Prices, and Total.
   */
  buildOrderMessage(order: OrderDraft): string {
    const totalQty = order.lines.reduce((sum, l) => sum + (l.quantity || 0), 0);

    const itemsText = order.lines
      .map((l, index) => {
        const skuText = l.sku ? `   • *Product ID / SKU:* ${l.sku}\n` : "";
        return [
          `*${index + 1}. ${l.name}*`,
          skuText ? skuText.trimEnd() : null,
          `   • *Unit Price:* ${formatPrice(l.unitPrice)}`,
          `   • *Quantity:* ${l.quantity}`,
          `   • *Item Total:* ${formatPrice(l.lineTotal)}`,
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");

    const messageParts: string[] = [
      `🛍️ *NEW ORDER — ${config.store.name.toUpperCase()}*`,
      "",
      "👤 *Customer Details:*",
      `• *Name:* ${order.customer.name.trim()}`,
      `• *Phone:* ${order.customer.phone.trim()}`,
      `• *Delivery Address:* ${order.customer.address.trim()}`,
      ...(order.customer.notes?.trim()
        ? [`• *Notes / Size:* ${order.customer.notes.trim()}`]
        : []),
      "",
      `📦 *Order Items (${order.lines.length} Unique Items, ${totalQty} Total Qty):*`,
      "━━━━━━━━━━━━━━━━━━━━",
      itemsText,
      "━━━━━━━━━━━━━━━━━━━━",
      `💰 *TOTAL ORDER PRICE:* ${formatPrice(order.subtotal)}`,
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      "Please confirm product availability, payment method, and dispatch schedule. Thank you!",
    ];

    return messageParts.join("\n");
  },

  /**
   * Fast 1-Click Cart WhatsApp order message (without requiring full form).
   */
  buildCartQuickOrderMessage(items: ResolvedCartItem[]): string {
    const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);

    const itemsText = items
      .map((item, index) => {
        const sku = item.product.sku || item.product.id || "N/A";
        return [
          `*${index + 1}. ${item.product.name}*`,
          `   • *Product ID / SKU:* ${sku}`,
          `   • *Unit Price:* ${formatPrice(item.product.price)}`,
          `   • *Quantity:* ${item.quantity}`,
          `   • *Item Total:* ${formatPrice(item.lineTotal)}`,
        ].join("\n");
      })
      .join("\n\n");

    return [
      `🛍️ *CART ORDER INQUIRY — ${config.store.name.toUpperCase()}*`,
      "",
      `📦 *Items in Cart (${items.length} Products, ${totalQty} Total Qty):*`,
      "━━━━━━━━━━━━━━━━━━━━",
      itemsText,
      "━━━━━━━━━━━━━━━━━━━━",
      `💰 *TOTAL CART PRICE:* ${formatPrice(subtotal)}`,
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      `Hi ${config.store.name} 👋, I want to place an order for these cart items! Please confirm availability and delivery details.`,
    ].join("\n");
  },

  /**
   * Legacy alias for compatibility.
   */
  buildProductInquiryMessage(product: { id?: string; sku?: string; name: string; price: number }): string {
    return this.buildDirectProductOrderMessage(product, 1);
  },

  buildKitInquiryMessage(
    sportName: string,
    items: Array<{ name: string; price?: number }>,
  ): string {
    const total = items.reduce((sum, i) => sum + (i.price || 0), 0);
    const itemList = items
      .map((item, index) => `${index + 1}. ${item.name}${item.price ? ` (${formatPrice(item.price)})` : ""}`)
      .join("\n");

    return [
      `🏏 *${sportName.toUpperCase()} KIT COMBO INQUIRY — ${config.store.name.toUpperCase()}*`,
      "",
      `📦 *Bundle Items (${items.length} Products):*`,
      itemList,
      "━━━━━━━━━━━━━━━━━━━━",
      total > 0 ? `💰 *Estimated Kit Total:* ${formatPrice(total)}` : "",
      "━━━━━━━━━━━━━━━━━━━━",
      "",
      `Hi ${config.store.name} 👋, I would like to order this customized ${sportName} Kit! Please confirm availability and package pricing.`,
    ]
      .filter(Boolean)
      .join("\n");
  },

  buildConsultationMessage(topic?: string): string {
    if (topic) {
      return `Hi ${config.store.name} 👋\n\nI need help selecting gear for ${topic}. Can you please recommend the best options?`;
    }
    return `Hi ${config.store.name} 👋\n\nI'm looking for recommendations for my sport and budget. Can you help me find the right gear?`;
  },

  generateWhatsAppUrl(message: string): string {
    const number = config.whatsapp.number.replace(/\D/g, "");
    if (!number) throw new Error("WhatsApp number is not configured.");
    return `${config.whatsapp.baseUrl}/${number}?text=${encodeURIComponent(message)}`;
  },

  openWhatsApp(message: string): void {
    const url = this.generateWhatsAppUrl(message);
    if (typeof window === "undefined")
      throw new Error("WhatsApp can only be opened in the browser.");
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;
  },
};
