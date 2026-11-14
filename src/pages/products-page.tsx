import { useState } from "react"
import { toast } from "sonner"
import { ImageOff, Pencil, Plus, Trash2 } from "lucide-react"
import { useCategories } from "@/cases/categories/hooks/use-category"
import { useDeleteProduct, useProducts } from "@/cases/products/hooks/use-product"
import { ProductFormDialog } from "@/cases/products/components/product-form-dialog"
import type { ProductDto } from "@/cases/products/dtos/product.dto"
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

const ALL = "all"
const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function ProductsPage() {
  const { data: products = [], isLoading, isError, refetch } = useProducts()
  const { data: categories = [] } = useCategories()
  const deleteProduct = useDeleteProduct()

  const [categoryId, setCategoryId] = useState(ALL)
  const [formOpen, setFormOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [editing, setEditing] = useState<ProductDto | null>(null)
  const [productToDelete, setProductToDelete] = useState<ProductDto | null>(null)

  // a API não filtra por categoria, então o filtro é feito aqui
  const filtered =
    categoryId === ALL
      ? products
      : products.filter((product) => product.category?.id === categoryId)

  // rótulos do select (sem isso ele mostra o valor cru, tipo "all")
  const categoryItems = [
    { value: ALL, label: "Todas as categorias" },
    ...categories.map((category) => ({ value: category.id, label: category.name })),
  ]

  function openCreate() {
    setEditing(null)
    setFormKey((key) => key + 1)
    setFormOpen(true)
  }

  function openEdit(product: ProductDto) {
    setEditing(product)
    setFormKey((key) => key + 1)
    setFormOpen(true)
  }

  function confirmDelete() {
    if (!productToDelete) return

    deleteProduct.mutate(productToDelete.id, {
      onSuccess: () => toast.success("Produto excluído."),
      onError: () => toast.error("Não foi possível excluir o produto."),
      onSettled: () => setProductToDelete(null),
    })
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Produtos</h1>

        <div className="flex items-center gap-2">
          <Select
            value={categoryId}
            onValueChange={(value) => setCategoryId(value ?? ALL)}
            items={categoryItems}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" />
            Novo produto
          </Button>
        </div>
      </div>

      {isLoading && <p>Carregando produtos...</p>}

      {isError && (
        <div className="flex flex-col items-start gap-3">
          <p>Não foi possível carregar os produtos. Confira se o backend está rodando.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Tentar de novo
          </Button>
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <p>Nenhum produto cadastrado ainda.</p>
      )}

      {!isLoading && !isError && products.length > 0 && filtered.length === 0 && (
        <p>Nenhum produto nesta categoria.</p>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.picture ? (
                    <img
                      src={product.picture}
                      alt={product.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100">
                      <ImageOff className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category?.name ?? "Sem categoria"}</TableCell>
                <TableCell>{brl.format(Number(product.price))}</TableCell>
                <TableCell>
                  <Badge variant={product.active ? "default" : "secondary"}>
                    {product.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(product)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setProductToDelete(product)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ProductFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
      />

      <AlertDialog
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
            <AlertDialogDescription>
              "{productToDelete?.name}" será removido. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteProduct.isPending}>
              {deleteProduct.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}