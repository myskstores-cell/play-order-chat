import type { ResolvedCartItem } from "@/models/Cart";
import type { Customer } from "@/models/Customer";
import { validateCustomer, type CustomerErrors } from "@/models/Customer";
import type { OrderDraft } from "@/models/Order";
import { whatsappService } from "./whatsappService";

export interface PreparedOrder {
  order: OrderDraft;
  message: string;
  whatsappUrl: string;
}

export const orderService = {
  validate(customer: Customer): CustomerErrors {
    return validateCustomer(customer);
  },

  buildOrderDraft(customer: Customer, items: ResolvedCartItem[]): OrderDraft {
    const lines = items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      sku: item.product.sku,
      unitPrice: item.product.price,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    }));
    return {
      customer,
      lines,
      subtotal: lines.reduce((sum, l) => sum + l.lineTotal, 0),
      createdAt: new Date().toISOString(),
    };
  },

  /** Prepares the WhatsApp order. It does NOT confirm or submit anything. */
  prepareWhatsAppOrder(customer: Customer, items: ResolvedCartItem[]): PreparedOrder {
    if (items.length === 0) throw new Error("Your cart is empty.");
    const order = this.buildOrderDraft(customer, items);
    const message = whatsappService.buildOrderMessage(order);
    return { order, message, whatsappUrl: whatsappService.generateWhatsAppUrl(message) };
  },
};
