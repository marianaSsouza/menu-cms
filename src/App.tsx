import { Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import { AppLayout } from "./components/Layout/app-layout"
import { CategoriesPage } from "./pages/categories-page"
import { ProductsPage } from "./pages/products-page"
import { SpotsPage } from "./pages/spots-page"
import { GuestChecksPage } from "./pages/guest-checks-page"
import { OrdersKanbanPage } from "./pages/orders-kanban-page"

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/categorias" replace />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="produtos" element={<ProductsPage />} />
          <Route path="mesas" element={<SpotsPage />} />
          <Route path="comandas" element={<GuestChecksPage />} />
          <Route path="pedidos" element={<OrdersKanbanPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App