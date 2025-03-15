"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { X } from "lucide-react"

interface AttendanceModalProps {
  isOpen: boolean
  onClose: () => void
  item: any
}

// Sample student data
const students = [
  { id: 1, name: "김민준", studentId: "S2023001" },
  { id: 2, name: "이서연", studentId: "S2023002" },
  { id: 3, name: "박지훈", studentId: "S2023003" },
  { id: 4, name: "최수아", studentId: "S2023004" },
  { id: 5, name: "정우진", studentId: "S2023005" },
  { id: 6, name: "강하은", studentId: "S2023006" },
  { id: 7, name: "조현우", studentId: "S2023007" },
  { id: 8, name: "윤지민", studentId: "S2023008" },
]

export function AttendanceModal({ isOpen, onClose, item }: AttendanceModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    date: "",
    className: "",
  })

  const [studentAttendance, setStudentAttendance] = useState<{ [key: number]: string }>(
    students.reduce(
      (acc, student) => ({
        ...acc,
        [student.id]: "present",
      }),
      {},
    ),
  )

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id || "",
        date: item.date || "",
        className: item.className || "",
      })

      // Reset student attendance based on the item data
      // In a real app, you would fetch the actual attendance records
      const newAttendance: { [key: number]: string } = {}
      students.forEach((student, index) => {
        if (index < item.present) {
          newAttendance[student.id] = "present"
        } else if (index < item.present + item.late) {
          newAttendance[student.id] = "late"
        } else if (index < item.present + item.late + item.absent) {
          newAttendance[student.id] = "absent"
        } else {
          newAttendance[student.id] = "present"
        }
      })
      setStudentAttendance(newAttendance)
    }
  }, [item])

  if (!isOpen) return null

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleAttendanceChange = (studentId: number, status: string) => {
    setStudentAttendance({
      ...studentAttendance,
      [studentId]: status,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the data here
    console.log("Saving attendance data:", formData, studentAttendance)
    onClose()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-50 text-green-700"
      case "late":
        return "bg-yellow-50 text-yellow-700"
      case "absent":
        return "bg-red-50 text-red-700"
      default:
        return ""
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "present":
        return "출석"
      case "late":
        return "지각"
      case "absent":
        return "결석"
      default:
        return ""
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">출석부 관리</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">출석부 ID</Label>
              <Input id="id" value={formData.id} onChange={(e) => handleChange("id", e.target.value)} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">날짜</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="className">수업명</Label>
              <Input
                id="className"
                value={formData.className}
                onChange={(e) => handleChange("className", e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>학번</TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>출석 상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>
                      <Select
                        value={studentAttendance[student.id]}
                        onValueChange={(value) => handleAttendanceChange(student.id, value)}
                      >
                        <SelectTrigger className={`w-32 ${getStatusColor(studentAttendance[student.id])}`}>
                          <SelectValue placeholder="상태 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">출석</SelectItem>
                          <SelectItem value="late">지각</SelectItem>
                          <SelectItem value="absent">결석</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">
                  출석: {Object.values(studentAttendance).filter((v) => v === "present").length}명
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">
                  지각: {Object.values(studentAttendance).filter((v) => v === "late").length}명
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">
                  결석: {Object.values(studentAttendance).filter((v) => v === "absent").length}명
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              저장
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

