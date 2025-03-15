"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, ArrowLeft, Download } from "lucide-react"
import Link from "next/link"

// 샘플 학생 출석 데이터
const studentAttendance = [
  {
    date: "2025-03-14",
    day: "금",
    period1: true,
    period2: true,
    period3: true,
    reason1: "",
    reason2: "",
    reason3: "",
  },
  {
    date: "2025-03-13",
    day: "목",
    period1: true,
    period2: false,
    period3: true,
    reason1: "",
    reason2: "학원",
    reason3: "",
  },
  {
    date: "2025-03-12",
    day: "수",
    period1: true,
    period2: true,
    period3: false,
    reason1: "",
    reason2: "",
    reason3: "병원",
  },
  {
    date: "2025-03-11",
    day: "화",
    period1: false,
    period2: true,
    period3: true,
    reason1: "무단",
    reason2: "",
    reason3: "",
  },
  {
    date: "2025-03-10",
    day: "월",
    period1: true,
    period2: true,
    period3: true,
    reason1: "",
    reason2: "",
    reason3: "",
  },
  {
    date: "2025-03-07",
    day: "금",
    period1: true,
    period2: true,
    period3: true,
    reason1: "",
    reason2: "",
    reason3: "",
  },
  {
    date: "2025-03-06",
    day: "목",
    period1: true,
    period2: true,
    period3: false,
    reason1: "",
    reason2: "",
    reason3: "기타 학교 활동",
  },
]

// 학생 정보
const studentInfo = {
  id: "20230001",
  name: "김민준",
  grade: "3",
  class: "8",
  number: "1",
}

export function TeacherStudentDetail() {
  const [searchTerm, setSearchTerm] = useState("")
  const [monthFilter, setMonthFilter] = useState("all")

  // 필터링된 출석 데이터
  const filteredAttendance = studentAttendance.filter((record) => {
    // 검색어 필터
    const matchesSearch =
      record.date.includes(searchTerm) ||
      record.day.includes(searchTerm) ||
      (record.reason1 && record.reason1.includes(searchTerm)) ||
      (record.reason2 && record.reason2.includes(searchTerm)) ||
      (record.reason3 && record.reason3.includes(searchTerm))

    // 월 필터
    const matchesMonth = monthFilter === "all" || (monthFilter && record.date.startsWith(`2025-${monthFilter}`))

    return matchesSearch && matchesMonth
  })

  // 출석률 계산
  const calculateAttendanceRate = () => {
    let totalPeriods = 0
    let attendedPeriods = 0

    studentAttendance.forEach((record) => {
      // 1차시
      totalPeriods++
      if (record.period1) attendedPeriods++

      // 2차시
      totalPeriods++
      if (record.period2) attendedPeriods++

      // 3차시 (3학년만)
      if (studentInfo.grade === "3") {
        totalPeriods++
        if (record.period3) attendedPeriods++
      }
    })

    return Math.round((attendedPeriods / totalPeriods) * 100)
  }

  // 불참 사유 텍스트 변환
  const getReasonText = (reason: string) => {
    switch (reason) {
      case "academy":
        return "학원"
      case "hospital":
        return "병원"
      case "unauthorized":
        return "무단"
      case "school":
        return "기타 학교 활동"
      case "other":
        return "기타"
      default:
        return reason
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/teacher-dashboard/students">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">학생 출석 상세</h1>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          엑셀로 내보내기
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">학생 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">학번</p>
              <p className="font-medium">{studentInfo.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">이름</p>
              <p className="font-medium">{studentInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">학년/반</p>
              <p className="font-medium">
                {studentInfo.grade}학년 {studentInfo.class}반
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">출석률</p>
              <p className="font-medium">{calculateAttendanceRate()}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">출석 기록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger className="w-40">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="월 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 기간</SelectItem>
                  <SelectItem value="03">3월</SelectItem>
                  <SelectItem value="02">2월</SelectItem>
                  <SelectItem value="01">1월</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>날짜</TableHead>
                    <TableHead>요일</TableHead>
                    <TableHead className="text-center">1차시</TableHead>
                    <TableHead className="text-center">2차시</TableHead>
                    {studentInfo.grade === "3" && <TableHead className="text-center">3차시</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.date}</TableCell>
                      <TableCell>{record.day}</TableCell>
                      <TableCell className="text-center">
                        {record.period1 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            출석
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            불참 ({getReasonText(record.reason1)})
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {record.period2 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            출석
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            불참 ({getReasonText(record.reason2)})
                          </Badge>
                        )}
                      </TableCell>
                      {studentInfo.grade === "3" && (
                        <TableCell className="text-center">
                          {record.period3 ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              출석
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700">
                              불참 ({getReasonText(record.reason3)})
                            </Badge>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

