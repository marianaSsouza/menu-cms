import { Badge } from "@/components/ui/badge"
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from "../order-status"
import type { OrderStatus } from "../dtos/order.dto"

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge className={ORDER_STATUS_COLOR[status]}>{ORDER_STATUS_LABEL[status]}</Badge>
}