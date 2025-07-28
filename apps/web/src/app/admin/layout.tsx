import type React from "react"
import MasterLayout from "../../masterLayout/MasterLayout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MasterLayout>{children}</MasterLayout>
}
