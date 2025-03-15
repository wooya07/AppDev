import { AdminDataReset } from "@/components/admin-data-reset"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function DataResetPage() {
  return (
    <DashboardLayout userRole="admin">
      <AdminDataReset />
    </DashboardLayout>
  )
}

