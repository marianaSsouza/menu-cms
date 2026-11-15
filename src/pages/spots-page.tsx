import { useState } from "react"
import { toast } from "sonner"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { SpotFormDialog } from "@/cases/spots/components/spot-form-dialog"
import type { SpotDto } from "@/cases/spots/dtos/spot.dto"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDeleteSpot, useSpots } from "@/cases/spots/hooks/use-spots"

export function SpotsPage() {
  const { data: spots = [], isLoading, isError, refetch } = useSpots()
  const deleteSpot = useDeleteSpot()

  const [formOpen, setFormOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [editing, setEditing] = useState<SpotDto | null>(null)
  const [spotToDelete, setSpotToDelete] = useState<SpotDto | null>(null)

  function openCreate() {
    setEditing(null)
    setFormKey((key) => key + 1)
    setFormOpen(true)
  }

  function openEdit(spot: SpotDto) {
    setEditing(spot)
    setFormKey((key) => key + 1)
    setFormOpen(true)
  }

  function confirmDelete() {
    if (!spotToDelete) return

    deleteSpot.mutate(spotToDelete.id, {
      onSuccess: () => toast.success("Mesa excluída."),
      onError: () =>
        toast.error("Não foi possível excluir a mesa. Confira se ela não tem comandas."),
      onSettled: () => setSpotToDelete(null),
    })
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Mesas</h1>

        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Nova mesa
        </Button>
      </div>

      {isLoading && <p>Carregando mesas...</p>}

      {isError && (
        <div className="flex flex-col items-start gap-3">
          <p>Não foi possível carregar as mesas. Confira se o backend está rodando.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Tentar de novo
          </Button>
        </div>
      )}

      {!isLoading && !isError && spots.length === 0 && <p>Nenhuma mesa cadastrada ainda.</p>}

      {!isLoading && !isError && spots.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spots.map((spot) => (
              <TableRow key={spot.id}>
                <TableCell>{spot.name}</TableCell>
                <TableCell>
                  <Badge variant={spot.active ? "default" : "secondary"}>
                    {spot.active ? "Ativa" : "Inativa"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(spot)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setSpotToDelete(spot)}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <SpotFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        spot={editing}
      />

      <AlertDialog
        open={!!spotToDelete}
        onOpenChange={(open) => !open && setSpotToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir mesa?</AlertDialogTitle>
            <AlertDialogDescription>
              "{spotToDelete?.name}" será removida. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteSpot.isPending}>
              {deleteSpot.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}