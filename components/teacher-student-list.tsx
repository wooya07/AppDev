"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Eye, KeyRound } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

// 샘플 학생 데이터
const students = [
  { id: "20230001", name: "김민준", grade: "3", class: "8", number: "1", attendanceRate: 95 },
  { id: "20230002", name: "이서연", grade: "3", class: "8", number: "2", attendanceRate: 92 },
  { id: "20230003", name: "박지훈", grade: "3", class: "8", number: "3", attendanceRate: 88 },
  { id: "20230004", name: "최수아", grade: "3", class: "8", number: "4", attendanceRate: 100 },
  { id: "20230005", name: "정우진", grade: "3", class: "8", number: "5", attendanceRate: 85 },
  { id: "20230006", name: "강하은", grade: "3", class: "8", number: "6", attendanceRate: 90 },
  { id: "20230007", name: "조현우", grade: "3", class: "8", number: "7", attendanceRate: 97 },
  { id: "20230008", name: "윤지민", grade: "3", class: "8", number: "8", attendanceRate: 93 },
  { id: "20230009", name: "임준호", grade: "3", class: "8", number: "9", attendanceRate: 82 },
  { id: "20230010", name: "한소희", grade: "3", class: "8", number: "10", attendanceRate: 91 },
  { id: "20230101", name: "김태현", grade: "1", class: "2", number: "1", attendanceRate: 98 },
  { id: "20230102", name: "박민지", grade: "1", class: "2", number: "2", attendanceRate: 94 },
  { id: "20230103", name: "이준영", grade: "1", class: "2", number: "3", attendanceRate: 89 },
]

export function TeacherStudentList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [classFilter, setClassFilter] = useState("all")
  const [resetPasswordDialog, setResetPasswordDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [resetSuccess, setResetSuccess] = useState(false)

  // 필터링된 학생 데이터
  const filteredStudents = students.filter((student) => {
    // 검색어 필터
    const matchesSearch = student.id.includes(searchTerm) || student.name.includes(searchTerm)

    // 학년 필터
    const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter

    // 반 필터
    const matchesClass = classFilter === "all" || student.class === classFilter

    return matchesSearch && matchesGrade && matchesClass
  })

  // 비밀번호 초기화 다이얼로그 열기
  const handleOpenResetDialog = (student: any) => {
    setSelectedStudent(student)
    setResetPasswordDialog(true)
    setResetSuccess(false)
  }

  // 비밀번호 초기화 처리
  const handleResetPassword = () => {
    // 실제 구현에서는 API 호출 등으로 비밀번호 초기화
    console.log(`Resetting password for student: ${selectedStudent.id} - ${selectedStudent.name}`)

    // 성공 상태로 변경
    setResetSuccess(true)

    // 3초 후 다이얼로그 닫기
    setTimeout(() => {
      setResetPasswordDialog(false)
      setSelectedStudent(null)
    }, 3000)
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">학생 관리</h1>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          엑셀로 내보내기
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">학생 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="학번 또는 이름으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-[110px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="학년" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 학년</SelectItem>
                  <SelectItem value="1">1학년</SelectItem>
                  <SelectItem value="2">2학년</SelectItem>
                  <SelectItem value="3">3학년</SelectItem>
                </SelectContent>
              </Select>

              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[110px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="반" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 반</SelectItem>
                  <SelectItem value="1">1반</SelectItem>
                  <SelectItem value="2">2반</SelectItem>
                  <SelectItem value="3">3반</SelectItem>
                  <SelectItem value="4">4반</SelectItem>
                  <SelectItem value="5">5반</SelectItem>
                  <SelectItem value="6">6반</SelectItem>
                  <SelectItem value="7">7반</SelectItem>
                  <SelectItem value="8">8반</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>학번</TableHead>
                      <TableHead>이름</TableHead>
                      <TableHead>학년</TableHead>
                      <TableHead>반</TableHead>
                      <TableHead>번호</TableHead>
                      <TableHead className="text-right">출석률</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.grade}학년</TableCell>
                        <TableCell>{student.class}반</TableCell>
                        <TableCell>{student.number}번</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              student.attendanceRate >= 95
                                ? "text-green-600 font-medium"
                                : student.attendanceRate >= 85
                                  ? "text-amber-600 font-medium"
                                  : "text-red-600 font-medium"
                            }
                          >
                            {student.attendanceRate}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Link href={`/teacher-dashboard/students/${student.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="출석 상세보기">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="비밀번호 초기화"
                              onClick={() => handleOpenResetDialog(student)}
                            >
                              <KeyRound className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 비밀번호 초기화 다이얼로그 */}
      <Dialog open={resetPasswordDialog} onOpenChange={setResetPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>비밀번호 초기화</DialogTitle>
            <DialogDescription>
              {selectedStudent && `${selectedStudent.name} (${selectedStudent.id}) 학생의 비밀번호를 초기화합니다.`}
            </DialogDescription>
          </DialogHeader>

          {resetSuccess ? (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-700">
                비밀번호가 성공적으로 초기화되었습니다. 초기 비밀번호는 <span className="font-bold">1234</span>입니다.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                비밀번호를 초기화하면 학생의 비밀번호가 기본값(1234)으로 변경됩니다. 학생에게 로그인 후 비밀번호를
                변경하도록 안내해주세요.
              </p>
              <p className="text-sm font-medium">정말 비밀번호를 초기화하시겠습니까?</p>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setResetPasswordDialog(false)}
              disabled={resetSuccess}
            >
              취소
            </Button>
            {!resetSuccess && (
              <Button type="button" className="bg-primary hover:bg-primary/90 text-white" onClick={handleResetPassword}>
                비밀번호 초기화
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

