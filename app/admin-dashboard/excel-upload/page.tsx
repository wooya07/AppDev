import { ExcelUploadForm } from "@/components/excel-upload-form"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function ExcelUploadPage() {
  return (
    <DashboardLayout userRole="admin">
      <ExcelUploadForm />
    </DashboardLayout>
  )
}

