import { NavLink } from "react-router-dom"
import logomarca from "@/assets/logomarca.svg"
import { cn } from "@/lib/utils"

const links = [
  { to: "/categorias", label: "Categorias" },
  { to: "/produtos", label: "Produtos" },
  { to: "/mesas", label: "Mesas" },
  { to: "/comandas", label: "Comandas" },
  { to: "/pedidos", label: "Pedidos" },
]

export function Header() {
  return (
    <header className="bg-transparent">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <img src={logomarca} alt="Logomarca" className="h-auto w-40" />

        <nav className="flex flex-wrap gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "font-menu text-lg font-semibold uppercase tracking-tight transition-colors hover:text-[#B86A2C]",
                  isActive && "text-[#B86A2C]",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}