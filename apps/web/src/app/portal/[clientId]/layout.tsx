import type React from "react"
import MasterLayout from "../../../masterLayout/MasterLayout"

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MasterLayout>{children}</MasterLayout>
}