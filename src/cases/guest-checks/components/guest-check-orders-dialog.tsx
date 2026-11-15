import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { OrderCard } from "@/cases/orders/components/order-card"
import { useUpdateOrderStatus } from "@/cases/orders/hooks/use-orders"
import { ORDER_STATUS_LABEL } from "@/cases/orders/order-status"
import type { OrderDto, OrderStatus } from "@/cases/orders/dtos/order.dto"
import type { GuestCheckDto } from "../dtos/guest-check.dto"

type GuestCheckOrdersDialogProps = {
  guestCheck: GuestCheckDto | null
  orders: OrderDto[]
  onClose: () => void
}

export function GuestCheckOrdersDialog({
  guestCheck,
  orders,
  onClose,
}: GuestCheckOrdersDialogProps) {
  const updateStatus = useUpdateOrderStatus()

  function handleStatusChange(order: OrderDto, status: OrderStatus) {
    if (status === order.status) return

    updateStatus.mutate(
      { id: order.id, status },
      {
        onSuccess: () =>
          toast.success(`Pedido alterado para "${ORDER_STATUS_LABEL[status]}".`),
        onError: () => toast.error("Não foi possível alterar o status do pedido."),
      },
    )
  }

  return (
    <Dialog open={!!guestCheck} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pedidos da comanda · {guestCheck?.spot.name}</DialogTitle>
        </DialogHeader>

        {orders.length === 0 ? (
          <p>Esta comanda ainda não tem pedidos.</p>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                disabled={updateStatus.isPending}
                onStatusChange={(status) => handleStatusChange(order, status)}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}