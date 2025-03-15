import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

// Sample data for recent attendance records
const recentAttendance = [
  {
    id: "ATT-1001",
    date: "2025-03-14",
    className: "프로그래밍 기초",
    attendanceRate: 94,
    status: "완료",
  },
  {
    id: "ATT-1000",
    date: "2025-03-13",
    className: "프로그래밍 기초",
    attendanceRate: 91,
    status: "완료",
  },
  {
    id: "ATT-999",
    date: "2025-03-12",
    className: "프로그래밍 기초",
    attendanceRate: 88,
    status: "완료",
  },
  {
    id: "ATT-998",
    date: "2025-03-11",
    className: "프로그래밍 기초",
    attendanceRate: 97,
    status: "완료",
  },
]

export function RecentAttendance() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">최근 출석부</CardTitle>
        <Link href="/dashboard/attendance">
          <Button variant="ghost" size="sm" className="gap-1">
            전체보기
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>날짜</TableHead>
              <TableHead>수업명</TableHead>
              <TableHead>출석률</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentAttendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.date}</TableCell>
                <TableCell>{record.className}</TableCell>
                <TableCell>{record.attendanceRate}%</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    {record.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

