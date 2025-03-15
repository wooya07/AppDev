"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, FileText, Trash2 } from "lucide-react"
import { AttendanceModal } from "@/components/attendance-modal"

// Sample data
const data = Array.from({ length: 10 }).map((_, i) => ({
  id: `ATT-${1000 - i}`,
  date: `2025-${String(3).padStart(2, "0")}-${String(14 - i).padStart(2, "0")}`,
  className: "프로그래밍 기초",
  totalStudents: 32,
  present: Math.floor(Math.random() * 5) + 27,
  late: Math.floor(Math.random() * 3),
  absent: Math.floor(Math.random() * 3),
  status: i === 0 ? "진행 중" : "완료",
}))

export function AttendanceTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<any>(null)

  const filteredData = data.filter(
    (item) =>
      item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.includes(searchTerm) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredData.map((item) => item.id))
    }
  }

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const handleEdit = (item: any) => {
    setCurrentItem(item)
    setIsModalOpen(true)
  }

  const calculateAttendanceRate = (present: number, late: number, total: number) => {
    // Count late students as present but with a penalty
    const effectivePresent = present + late * 0.5
    return Math.round((effectivePresent / total) * 100)
  }

  return (
    <>
      <div className="rounded-md border bg-white">
        <div className="flex items-center justify-between p-4">
          <Input
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={selectedRows.length === 0}>
              <FileText className="mr-2 h-4 w-4" />
              내보내기
            </Button>
            <Button variant="outline" size="sm" disabled={selectedRows.length === 0}>
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>날짜</TableHead>
              <TableHead>수업명</TableHead>
              <TableHead>출석</TableHead>
              <TableHead>지각</TableHead>
              <TableHead>결석</TableHead>
              <TableHead>출석률</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => {
                const attendanceRate = calculateAttendanceRate(item.present, item.late, item.totalStudents)
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(item.id)}
                        onCheckedChange={() => toggleSelectRow(item.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell>{item.className}</TableCell>
                    <TableCell>{item.present}명</TableCell>
                    <TableCell>{item.late}명</TableCell>
                    <TableCell>{item.absent}명</TableCell>
                    <TableCell>{attendanceRate}%</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={item.status === "완료" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            편집
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            상세 보기
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            {filteredData.length}개 항목 중 {Math.min(10, filteredData.length)}개 표시
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8">
              1
            </Button>
            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AttendanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={currentItem} />
    </>
  )
}

