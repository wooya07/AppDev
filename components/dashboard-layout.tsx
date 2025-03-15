import type React from "react"
import { Sidebar } from "@/components/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: "student" | "classPresident" | "teacher" | "admin"
}

export function DashboardLayout({ children, userRole = "student" }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-muted">
      <Sidebar userRole={userRole} />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}

