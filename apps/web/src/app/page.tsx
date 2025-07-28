import { redirect } from "next/navigation"

export default function Home() {
  // Futuramente, pode redirecionar para /login ou /admin dependendo do status de autenticação
  redirect("/admin/clients")
}
