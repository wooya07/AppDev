import { AdminDashboard } from "@/components/admin-dashboard"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function AdminDashboardPage() {
  return (
    <DashboardLayout userRole="admin">
      <AdminDashboard />
    </DashboardLayout>
  )
}

