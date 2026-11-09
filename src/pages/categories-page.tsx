import { useCategories } from "@/cases/categories/hooks/use-category"
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

  if (isLoading) {
    return <p>Carregando categorias...</p>
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p>Não foi possível carregar as categorias. Confira se o backend está rodando.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Tentar de novo
        </Button>
      </div>
    )
  }

  if (categories.length === 0) {
    return <p>Nenhuma categoria cadastrada ainda.</p>
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Categorias</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Situação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>
                <Badge variant={category.active ? "default" : "secondary"}>
                  {category.active ? "Ativa" : "Inativa"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}