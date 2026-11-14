import { useState } from "react"
import { toast } from "sonner"
import { useCategories } from "@/cases/categories/hooks/use-category"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useCreateProduct, useUpdateProduct } from "../hooks/use-product"
import type { ProductDto } from "../dtos/product.dto"

const NO_CATEGORY = "none"

type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: ProductDto | null
}

export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const { data: categories = [] } = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  // o estado já começa com os dados do produto (ou vazio, no cadastro).
  // a página muda a "key" do componente a cada abertura, então ele é recriado do zero
  const [name, setName] = useState(product?.name ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState(product ? String(product.price) : "")
  const [picture, setPicture] = useState(product?.picture ?? "")
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? NO_CATEGORY)
  const [active, setActive] = useState(product?.active ?? true)
  const [error, setError] = useState("")

  const isPending = createProduct.isPending || updateProduct.isPending

  // a API só aceita categoria ativa
  const categoryItems = [
    { value: NO_CATEGORY, label: "Sem categoria" },
    ...categories
      .filter((category) => category.active)
      .map((category) => ({ value: category.id, label: category.name })),
  ]

  function handleSubmit() {
    const priceNumber = Math.round(Number(price.replace(",", ".")) * 100) / 100

    if (!name.trim()) {
      return setError("Informe o nome do produto.")
    }
    if (!priceNumber || priceNumber <= 0) {
      return setError("O preço deve ser maior que zero.")
    }
    if (picture.trim() && !/^https?:\/\//.test(picture.trim())) {
      return setError("A imagem deve ser uma URL começando com http:// ou https://.")
    }

    setError("")

    const callbacks = {
      onSuccess: () => {
        toast.success(product ? "Produto atualizado." : "Produto cadastrado.")
        onOpenChange(false)
      },
      onError: () => toast.error("Não foi possível salvar o produto."),
    }

    if (product) {
      updateProduct.mutate(
        {
          id: product.id,
          data: {
            name: name.trim(),
            description: description.trim(),
            price: priceNumber,
            picture: picture.trim() || null,
            categoryId: categoryId === NO_CATEGORY ? null : categoryId,
            active,
          },
        },
        callbacks,
      )
    } else {
      createProduct.mutate(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          price: priceNumber,
          picture: picture.trim() || undefined,
          categoryId: categoryId === NO_CATEGORY ? undefined : categoryId,
        },
        callbacks,
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Editar produto" : "Novo produto"}</DialogTitle>
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
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              inputMode="decimal"
              placeholder="0,00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="picture">URL da imagem</Label>
            <Input
              id="picture"
              placeholder="https://..."
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Categoria</Label>
            <Select
              value={categoryId}
              onValueChange={(value) => setCategoryId(value ?? NO_CATEGORY)}
              items={categoryItems}
            >
              <SelectTrigger>
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
          </div>

          {product && (
            <div className="flex items-center gap-2">
              <Switch id="active" checked={active} onCheckedChange={setActive} />
              <Label htmlFor="active">Produto ativo</Label>
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