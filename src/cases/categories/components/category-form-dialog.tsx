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
import { useCreateCategory, useUpdateCategory } from "../hooks/use-category"
import type { CategoryDto } from "../dtos/category.dto"

type CategoryFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: CategoryDto | null
}

export function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()

  // o estado já começa com os dados da categoria (ou vazio, no cadastro).
  // a página muda a "key" a cada abertura, então o componente é recriado do zero
  const [name, setName] = useState(category?.name ?? "")
  const [icon, setIcon] = useState(category?.icon ?? "")
  const [active, setActive] = useState(category?.active ?? true)
  const [error, setError] = useState("")

  const isPending = createCategory.isPending || updateCategory.isPending

  function handleSubmit() {
    if (!name.trim()) {
      return setError("Informe o nome da categoria.")
    }

    setError("")

    const callbacks = {
      onSuccess: () => {
        toast.success(category ? "Categoria atualizada." : "Categoria cadastrada.")
        onOpenChange(false)
      },
      onError: () => toast.error("Não foi possível salvar a categoria."),
    }

    if (category) {
      updateCategory.mutate(
        {
          id: category.id,
          data: {
            name: name.trim(),
            icon: icon.trim() || undefined,
            active,
          },
        },
        callbacks,
      )
    } else {
      createCategory.mutate(
        {
          name: name.trim(),
          icon: icon.trim() || undefined,
        },
        callbacks,
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Editar categoria" : "Nova categoria"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              maxLength={60}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="icon">Ícone</Label>
            <Input
              id="icon"
              placeholder="Ex.: 🍔"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>

          {category && (
            <div className="flex items-center gap-2">
              <Switch id="active" checked={active} onCheckedChange={setActive} />
              <Label htmlFor="active">Categoria ativa</Label>
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