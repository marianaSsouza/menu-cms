import type { OrderStatus } from "./dtos/order.dto"

export const ORDER_STATUSES: OrderStatus[] = ["NEW", "PREPARING", "READY", "DELIVERED"]

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: "Novo",
  PREPARING: "Em preparo",
  READY: "Pronto",
  DELIVERED: "Entregue",
}

// uma cor diferente para cada status
export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  NEW: "bg-sky-100 text-sky-800",
  PREPARING: "bg-amber-100 text-amber-800",
  READY: "bg-emerald-100 text-emerald-800",
  DELIVERED: "bg-zinc-200 text-zinc-700",
}