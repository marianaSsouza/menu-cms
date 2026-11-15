import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { ORDER_STATUSES, ORDER_STATUS_LABEL } from "../order-status"

import type { OrderDto, OrderStatus } from "../dtos/order.dto"
import { OrderStatusBadge } from "./order-status-bagde"

const statusItems = ORDER_STATUSES.map((status) => ({
  value: status,
  label: ORDER_STATUS_LABEL[status],
}))

type OrderCardProps = {
  order: OrderDto
  disabled?: boolean
  onStatusChange: (status: OrderStatus) => void
}

export function OrderCard({ order, disabled, onStatusChange }: OrderCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {formatDateTime(order.createdAt)}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>

        <Select
          value={order.status}
          items={statusItems}
          disabled={disabled}
          onValueChange={(value) => value && onStatusChange(value as OrderStatus)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead>Qtd.</TableHead>
            <TableHead>Preço unit.</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {order.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.product.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{formatCurrency(item.price)}</TableCell>
              <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <p className="mt-3 text-right font-medium">
        Total do pedido: {formatCurrency(order.total)}
      </p>
    </div>
  )
}