import { Link, useSearchParams } from "react-router-dom"
import { LayoutGrid, Utensils } from "lucide-react"
import { useCategories } from "../hooks/use-category"
import { cn } from "@/lib/utils"

export function CategoryNav() {
  const [searchParams] = useSearchParams()
  const selectedCategoryId = searchParams.get("categoryId")

  const { data: categories = [] } = useCategories()

  const itemClass = (selected: boolean) =>
    cn(
      "flex w-full items-center gap-3 rounded-xl border px-4 py-3",
      "font-menu text-lg font-semibold uppercase tracking-tight",
      "transition-colors duration-200 hover:text-[#B86A2C]",
      selected
        ? "border-[#B86A2C] bg-primary/5 text-[#B86A2C]"
        : "border-transparent text-foreground",
    )

  return (
    <nav className="w-full">
      <ul className="grid gap-1">
        <li>
          <Link to="/produtos" className={itemClass(!selectedCategoryId)}>
            <LayoutGrid className="size-10" />
            <span className="leading-tight">Todos</span>
          </Link>
        </li>

        {categories.map((category) => (
          <li key={category.id}>
            <Link
              to={`/produtos?categoryId=${category.id}`}
              className={itemClass(selectedCategoryId === category.id)}
            >
              {category.icon ? (
                <img src={category.icon} alt="" className="size-10" />
              ) : (
                <Utensils className="size-10" />
              )}
              <span className="leading-tight">{category.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}