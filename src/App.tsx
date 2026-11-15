import { Link, Navigate, Route, Routes } from "react-router-dom"
import { CategoriesPage } from "@/pages/categories-page"
import { ProductsPage } from "./pages/products-page"
import { SpotsPage } from "./pages/spots-page"
import { GuestChecksPage } from "./pages/guest-checks-page"
import { Toaster } from "sonner"

function App() {
  return (
    <>
      <header>
        <nav className="flex gap-6 px-6 py-4">
          <Link to="/categorias">Categorias</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/mesas">Mesas</Link>
          <Link to="/comandas">Comandas</Link>
        </nav>
      </header>

      <main className="px-6 py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/categorias" replace />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/produtos" element={<ProductsPage />} />
          <Route path="/mesas" element={<SpotsPage />} />
          <Route path="/comandas" element={<GuestChecksPage />} />
        </Routes>
      </main>
      <Toaster />
    </>
  )
}

export default App