import { OrderKanban } from "@/cases/orders/components/order-kanban"
import { useOrders } from "@/cases/orders/hooks/use-orders"
import { Button } from "@/components/ui/button"

export function OrdersKanbanPage() {
  const { data: orders = [], isLoading, isError, refetch } = useOrders()

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          Arraste os cartões entre as colunas para alterar o status do pedido.
        </p>
      </div>

      {isLoading && <p>Carregando pedidos...</p>}

      {isError && (
        <div className="flex flex-col items-start gap-3">
          <p>Não foi possível carregar os pedidos. Confira se o backend está rodando.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Tentar de novo
          </Button>
        </div>
      )}

      {!isLoading && !isError && orders.length === 0 && (
        <p>Nenhum pedido registrado ainda.</p>
      )}

      {!isLoading && !isError && orders.length > 0 && <OrderKanban orders={orders} />}
    </div>
  )
}