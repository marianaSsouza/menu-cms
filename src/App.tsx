import { Link, Navigate, Route, Routes } from "react-router-dom"

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
          <Route path="/categorias" element={<h1>Categorias</h1>} />
          <Route path="/produtos" element={<h1>Produtos</h1>} />
          <Route path="/mesas" element={<h1>Mesas</h1>} />
          <Route path="/comandas" element={<h1>Comandas</h1>} />
        </Routes>
      </main>
    </>
  )
}

export default App