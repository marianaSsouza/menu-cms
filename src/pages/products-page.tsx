import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { ImageOff, Pencil, Plus, Trash2 } from "lucide-react"
import { useCategories } from "@/cases/categories/hooks/use-category"
import { CategoryNav } from "@/cases/categories/components/category-nav"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency } from "@/lib/format"

export function ProductsPage() {
  // a categoria escolhida no menu lateral fica na URL: /produtos?categoryId=...
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get("categoryId") ?? undefined

  const { data: products = [], isLoading, isError, refetch } = useProducts(categoryId)
  const { data: categories = [] } = useCategories()
  const deleteProduct = useDeleteProduct()

  const selectedCategory = categories.find((category) => category.id === categoryId)

  const [formOpen, setFormOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [editing, setEditing] = useState<ProductDto | null>(null)
  const [productToDelete, setProductToDelete] = useState<ProductDto | null>(null)

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
    <div className="flex gap-6">
      <aside className="w-64 shrink-0">
        <CategoryNav />
      </aside>

      <section className="min-w-0 flex-1">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold uppercase">
            {selectedCategory?.name ?? "Produtos"}
          </h1>

          <Button onClick={openCreate}>
            <Plus className="mr-1 h-4 w-4" />
            Novo produto
          </Button>
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
          <p>
            {categoryId
              ? "Nenhum produto nesta categoria."
              : "Nenhum produto cadastrado ainda."}
          </p>
        )}

        {!isLoading && !isError && products.length > 0 && (
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
              {products.map((product) => (
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
                  <TableCell>{formatCurrency(product.price)}</TableCell>
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
      </section>

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