import { ExcelExportForm } from "@/components/excel-export-form"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ExcelExportPage() {
  return (
    <DashboardLayout userRole="admin">
      <ExcelExportForm />
    </DashboardLayout>
  )
}

