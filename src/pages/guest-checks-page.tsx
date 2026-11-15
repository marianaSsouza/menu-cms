import { useState } from "react"

import { GuestCheckOrdersDialog } from "@/cases/guest-checks/components/guest-check-orders-dialog"
import type { GuestCheckDto } from "@/cases/guest-checks/dtos/guest-check.dto"
import { useOrders } from "@/cases/orders/hooks/use-orders"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDateTime } from "@/lib/format"
import { useOpenedGuestChecks } from "@/cases/guest-checks/hooks/use-guest-check"

export function GuestChecksPage() {
  const guestChecks = useOpenedGuestChecks()
  const orders = useOrders()
  const [selected, setSelected] = useState<GuestCheckDto | null>(null)

  const checks = guestChecks.data ?? []
  const allOrders = orders.data ?? []

  const isLoading = guestChecks.isLoading || orders.isLoading
  const isError = guestChecks.isError || orders.isError

  // os pedidos de uma comanda; o total da comanda é a soma dos totais dos pedidos
  const ordersOf = (guestCheckId: string) =>
    allOrders.filter((order) => order.guestCheck.id === guestCheckId)

  const totalOf = (guestCheckId: string) =>
    ordersOf(guestCheckId).reduce((sum, order) => sum + Number(order.total), 0)

  function retry() {
    guestChecks.refetch()
    orders.refetch()
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Comandas em aberto</h1>

      {isLoading && <p>Carregando comandas...</p>}

      {isError && (
        <div className="flex flex-col items-start gap-3">
          <p>Não foi possível carregar as comandas. Confira se o backend está rodando.</p>
          <Button variant="outline" onClick={retry}>
            Tentar de novo
          </Button>
        </div>
      )}

      {!isLoading && !isError && checks.length === 0 && (
        <p>Nenhuma comanda em aberto no momento.</p>
      )}

      {!isLoading && !isError && checks.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mesa</TableHead>
              <TableHead>Aberta em</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checks.map((check) => (
              <TableRow key={check.id}>
                <TableCell>{check.spot.name}</TableCell>
                <TableCell>{formatDateTime(check.createdAt)}</TableCell>
                <TableCell>{ordersOf(check.id).length}</TableCell>
                <TableCell>{formatCurrency(totalOf(check.id))}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setSelected(check)}>
                    Ver pedidos
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <GuestCheckOrdersDialog
        guestCheck={selected}
        orders={selected ? ordersOf(selected.id) : []}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}