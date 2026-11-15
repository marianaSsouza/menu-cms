import type { GuestCheckDto } from "@/cases/guest-checks/dtos/guest-check.dto"
import type { ProductDto } from "@/cases/products/dtos/product.dto"

export type OrderStatus = "NEW" | "PREPARING" | "READY" | "DELIVERED"

export interface OrderItemDto {
  id: string;
  quantity: number;
  price: string | number;
  subtotal: string | number;
  product: ProductDto;
}

export interface OrderDto {
  id: string;
  createdAt: string;
  total: string | number;
  status: OrderStatus;
  guestCheck: GuestCheckDto;
  items: OrderItemDto[];
}