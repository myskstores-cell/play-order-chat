import type { ResolvedCartItem } from "@/models/Cart";
import type { Customer } from "@/models/Customer";
import { orderService, type PreparedOrder } from "@/services/orderService";
import { whatsappService } from "@/services/whatsappService";

/** UI-facing ordering API — WhatsApp handoff only, no payment. */
export const ordersApi = {
  validateCustomer: (customer: Customer) => orderService.validate(customer),
  prepare: (customer: Customer, items: ResolvedCartItem[]): PreparedOrder =>
    orderService.prepareWhatsAppOrder(customer, items),
  openWhatsApp: (message: string) => whatsappService.openWhatsApp(message),
};
