import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import type { SpotDto } from "../dtos/spot.dto"
import { useCreateSpot, useUpdateSpot } from "../hooks/use-spots"

type SpotFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  spot?: SpotDto | null
}

export function SpotFormDialog({ open, onOpenChange, spot }: SpotFormDialogProps) {
  const createSpot = useCreateSpot()
  const updateSpot = useUpdateSpot()

  // a página muda a "key" a cada abertura, então o estado recomeça do zero
  const [name, setName] = useState(spot?.name ?? "")
  const [active, setActive] = useState(spot?.active ?? true)
  const [error, setError] = useState("")

  const isPending = createSpot.isPending || updateSpot.isPending

  function handleSubmit() {
    if (!name.trim()) {
      return setError("Informe o nome da mesa.")
    }

    setError("")

    const callbacks = {
      onSuccess: () => {
        toast.success(spot ? "Mesa atualizada." : "Mesa cadastrada.")
        onOpenChange(false)
      },
      onError: () => toast.error("Não foi possível salvar a mesa."),
    }

    if (spot) {
      updateSpot.mutate({ id: spot.id, data: { name: name.trim(), active } }, callbacks)
    } else {
      createSpot.mutate({ name: name.trim() }, callbacks)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{spot ? "Editar mesa" : "Nova mesa"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              maxLength={60}
              placeholder="Ex.: Mesa 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {spot && (
            <div className="flex items-center gap-2">
              <Switch id="active" checked={active} onCheckedChange={setActive} />
              <Label htmlFor="active">Mesa ativa</Label>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}