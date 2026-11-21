import { useState } from "react"
import { toast } from "sonner"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useCategories, useDeleteCategory } from "@/cases/categories/hooks/use-category"
import { CategoryFormDialog } from "@/cases/categories/components/category-form-dialog"
import type { CategoryDto } from "@/cases/categories/dtos/category.dto"
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

export function CategoriesPage() {
  const { data: categories = [], isLoading, isError, refetch } = useCategories()
  const deleteCategory = useDeleteCategory()

  const [formOpen, setFormOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [editing, setEditing] = useState<CategoryDto | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null)

  function openCreate() {
    setEditing(null)
    setFormKey((key) => key + 1)
    setFormOpen(true)
  }

  function openEdit(category: CategoryDto) {
    setEditing(category)
    setFormKey((key) => key + 1)
    setFormOpen(true)
  }

  function confirmDelete() {
    if (!categoryToDelete) return

    deleteCategory.mutate(categoryToDelete.id, {
      onSuccess: () => toast.success("Categoria excluída."),
      onError: () =>
        toast.error("Não foi possível excluir a categoria. Confira se ela não tem produtos."),
      onSettled: () => setCategoryToDelete(null),
    })
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Categorias</h1>

        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      {isLoading && <p>Carregando categorias...</p>}

      {isError && (
        <div className="flex flex-col items-start gap-3">
          <p>Não foi possível carregar as categorias. Confira se o backend está rodando.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Tentar de novo
          </Button>
        </div>
      )}

      {!isLoading && !isError && categories.length === 0 && (
        <p>Nenhuma categoria cadastrada ainda.</p>
      )}

      {!isLoading && !isError && categories.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ícone</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {category.icon ? (
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Badge variant={category.active ? "default" : "secondary"}>
                    {category.active ? "Ativa" : "Inativa"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCategoryToDelete(category)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CategoryFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
      />

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              "{categoryToDelete?.name}" será removida. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteCategory.isPending}>
              {deleteCategory.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}