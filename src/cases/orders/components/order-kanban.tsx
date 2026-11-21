import { useState } from "react"
import type { DragEvent } from "react"
import { toast } from "sonner"
import { Clock, ShoppingBag } from "lucide-react"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { cn } from "@/lib/utils"
import { ORDER_STATUSES, ORDER_STATUS_LABEL } from "../order-status"
import { useMoveOrder } from "../hooks/use-orders"
import type { OrderDto, OrderStatus } from "../dtos/order.dto"

// bolinha ao lado do nome da coluna
const STATUS_DOT: Record<OrderStatus, string> = {
  NEW: "bg-[#0EA5E9]",
  PREPARING: "bg-[#F59E0B]",
  READY: "bg-[#10B981]",
  DELIVERED: "bg-[#A1A1AA]",
}

// faixa colorida na lateral esquerda do card
const STATUS_ACCENT: Record<OrderStatus, string> = {
  NEW: "border-l-[#0EA5E9]",
  PREPARING: "border-l-[#F59E0B]",
  READY: "border-l-[#10B981]",
  DELIVERED: "border-l-[#A1A1AA]",
}

// quantos produtos aparecem no card antes de virar "+ N mais"
const MAX_PRODUCTS_ON_CARD = 4

type OrderKanbanProps = {
  orders: OrderDto[]
}

export function OrderKanban({ orders }: OrderKanbanProps) {
  const moveOrder = useMoveOrder()
  const [overStatus, setOverStatus] = useState<OrderStatus | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const draggingOrder = orders.find((order) => order.id === draggingId)

  function handleDrop(event: DragEvent, status: OrderStatus) {
    event.preventDefault()
    setOverStatus(null)
    setDraggingId(null)

    const orderId = event.dataTransfer.getData("text/plain")
    const order = orders.find((item) => item.id === orderId)

    if (!order || order.status === status) return

    moveOrder.mutate(
      { id: order.id, status },
      {
        onSuccess: () =>
          toast.success(`Pedido movido para "${ORDER_STATUS_LABEL[status]}".`),
        onError: () => toast.error("Não foi possível mover o pedido."),
      },
    )
  }

  return (
    <div className="rounded-2xl border border-[#E3DED5] bg-[#FFFFFF] p-5 shadow-sm">
      <div className="flex gap-5 overflow-x-auto pb-1">
        {ORDER_STATUSES.map((status) => {
          const column = orders.filter((order) => order.status === status)

          // espaço tracejado que aparece na coluna de destino enquanto o card é arrastado
          const showPlaceholder =
            overStatus === status && !!draggingOrder && draggingOrder.status !== status

          return (
            <section
              key={status}
              onDragOver={(event) => {
                event.preventDefault()
                setOverStatus(status)
              }}
              onDragLeave={(event) => {
                // só tira o destaque quando o cursor sai da coluna de verdade
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setOverStatus(null)
                }
              }}
              onDrop={(event) => handleDrop(event, status)}
              className={cn(
                "flex min-h-[34rem] min-w-[17rem] flex-1 flex-col gap-4 rounded-xl border p-4 transition-colors",
                overStatus === status
                  ? "border-[#F97316] bg-[#FFF3E8]"
                  : "border-[#ECE8E0] bg-[#F6F4EF]",
              )}
            >
              <header className="flex items-center gap-2.5 px-1">
                <span className={cn("h-3 w-3 rounded-full", STATUS_DOT[status])} />
                <h2 className="text-base font-semibold">{ORDER_STATUS_LABEL[status]}</h2>
                <span className="rounded-full border border-[#E3DED5] bg-[#FFFFFF] px-2 py-0.5 text-xs text-muted-foreground">
                  {column.length}
                </span>
              </header>

              {column.map((order) => {
                const totalItems = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                )
                const hiddenProducts = order.items.length - MAX_PRODUCTS_ON_CARD

                return (
                  <article
                    key={order.id}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", order.id)
                      event.dataTransfer.effectAllowed = "move"
                      // espera o navegador "fotografar" o card antes de deixá-lo transparente
                      requestAnimationFrame(() => setDraggingId(order.id))
                    }}
                    onDragEnd={() => {
                      setDraggingId(null)
                      setOverStatus(null)
                    }}
                    className={cn(
                      "cursor-grab rounded-xl border border-l-4 border-[#E3DED5] bg-[#FFFFFF] p-5 shadow-md transition hover:shadow-lg active:cursor-grabbing",
                      STATUS_ACCENT[order.status],
                      draggingId === order.id && "opacity-40",
                    )}
                  >
                    <h3 className="text-lg font-semibold leading-tight">
                      {order.guestCheck.spot.name}
                    </h3>

                    <ul className="mb-4 mt-2 grid gap-1 text-sm text-muted-foreground">
                      {order.items.slice(0, MAX_PRODUCTS_ON_CARD).map((item) => (
                        <li key={item.id}>
                          {item.quantity}× {item.product.name}
                        </li>
                      ))}
                      {hiddenProducts > 0 && <li>+ {hiddenProducts} mais</li>}
                    </ul>

                    <div className="flex flex-wrap items-center gap-2 border-t border-[#EEEAE2] pt-3 text-xs">
                      <span className="flex items-center gap-1.5 rounded-md bg-[#F6F4EF] px-2.5 py-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDateTime(order.createdAt)}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-md bg-[#F6F4EF] px-2.5 py-1.5">
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {totalItems} {totalItems === 1 ? "item" : "itens"}
                      </span>
                      <span className="ml-auto text-base font-semibold text-[#B86A2C]">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </article>
                )
              })}

              {showPlaceholder && (
                <div className="h-28 rounded-xl border-2 border-dashed border-[#D6D0C4] bg-[#EFEBE3]" />
              )}

              {column.length === 0 && !showPlaceholder && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum pedido
                </p>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}