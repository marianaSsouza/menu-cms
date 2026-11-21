import { Outlet } from "react-router-dom"
import { Header } from "./header"

export function AppLayout() {
  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-6xl border-t border-[#CFC7BA]/70 px-6 py-6">
        <Outlet />
      </main>
    </>
  )
}