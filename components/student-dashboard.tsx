"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { mockWeeklyAttendanceData } from "@/lib/mock-data" // 목업 데이터 임포트

export function StudentDashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0)
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 백엔드에서 주간 출석 데이터 가져오기
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // 프리뷰 환경에서는 목업 데이터 사용
        setWeeklyData(mockWeeklyAttendanceData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching attendance data:", error)
        setIsLoading(false)
        // 오류 발생 시 목업 데이터 사용
        setWeeklyData(mockWeeklyAttendanceData)
      }
    }

    fetchAttendanceData()
  }, [])

  // 현재 주차 데이터
  const currentWeekData = weeklyData[currentWeekIndex] || {
    weekStart: "",
    weekEnd: "",
    attendance: [],
    classAttendance: [],
    totalStudents: 0,
    classAvgAttendance: 0,
  }

  // 이전/다음 주 데이터 보기 핸들러
  const handlePrevWeek = () => {
    if (currentWeekIndex < weeklyData.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1)
    }
  }

  const handleNextWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1)
    }
  }

  // 차트 그리기 로직
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Chart data - attendance counts by day (excluding weekends)
    // 요일 순서대로 정렬 (월화수목금)
    const sortedAttendance = [...(currentWeekData.attendance || [])].sort((a, b) => {
      const dayOrder = { 월: 1, 화: 2, 수: 3, 목: 4, 금: 5 }
      return dayOrder[a.day as keyof typeof dayOrder] - dayOrder[b.day as keyof typeof dayOrder]
    })

    const data = sortedAttendance.map(
      (day) =>
        currentWeekData.classAttendance[currentWeekData.attendance.findIndex((d: any) => d.date === day.date)] || 0,
    )
    const totalStudents = currentWeekData.totalStudents || 32
    const labels = sortedAttendance.map((a) => `${a.date?.slice(5) || ""} (${a.day || ""})`)

    // 차트 그리기 로직 (기존 코드 유지)
    // Chart dimensions
    const chartWidth = canvas.width - 60
    const chartHeight = canvas.height - 60
    const padding = { left: 40, right: 20, top: 30, bottom: 30 }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate scales
    const maxValue = totalStudents // Max is total students
    const barWidth = (chartWidth / data.length) * 0.7
    const barSpacing = (chartWidth / data.length) * 0.3

    // Draw title
    ctx.fillStyle = "#000000"
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(
      `3학년 8반 출석 현황 (${currentWeekData.weekStart || ""} ~ ${currentWeekData.weekEnd || ""})`,
      canvas.width / 2,
      20,
    )

    // Draw y-axis
    ctx.strokeStyle = "#e5e5ec"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, padding.top + chartHeight)
    ctx.stroke()

    // Draw y-axis labels and grid lines
    ctx.fillStyle = "#505050"
    ctx.font = "10px Arial"
    ctx.textAlign = "right"

    for (let i = 0; i <= 4; i++) {
      const value = Math.round((maxValue * i) / 4)
      const y = padding.top + chartHeight - (chartHeight * i) / 4

      // Grid line
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.strokeStyle = "#e5e5ec"
      ctx.stroke()

      // Label
      ctx.fillText(value.toString(), padding.left - 5, y + 3)
    }

    // Draw bars
    data.forEach((value, index) => {
      const x = padding.left + (chartWidth / data.length) * index + (chartWidth / data.length - barWidth) / 2
      const barHeight = (value / maxValue) * chartHeight
      const y = padding.top + chartHeight - barHeight

      // Bar
      ctx.fillStyle = "#099c34"
      ctx.fillRect(x, y, barWidth, barHeight)

      // Value on top of bar
      ctx.fillStyle = "#000000"
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5)

      // X-axis label
      ctx.fillStyle = "#505050"
      ctx.font = "10px Arial"
      ctx.fillText(labels[index], x + barWidth / 2, padding.top + chartHeight + 15)
    })
  }, [currentWeekData])

  // 개인 출석률 계산
  const calculatePersonalAttendanceRate = () => {
    if (!currentWeekData.attendance || currentWeekData.attendance.length === 0) return 0

    const totalPeriods = currentWeekData.attendance.length * 3 // 3차시 기준
    let attendedPeriods = 0

    currentWeekData.attendance.forEach((day: any) => {
      if (day.period1) attendedPeriods++
      if (day.period2) attendedPeriods++
      if (day.period3) attendedPeriods++
    })

    return Math.round((attendedPeriods / totalPeriods) * 100)
  }

  if (isLoading) {
    return <div>데이터를 불러오는 중입니다...</div>
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">출석 통계 대시보드</h1>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">3학년 8반 출석 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-[21/9] w-full">
            <canvas ref={canvasRef} className="h-full w-full" />
          </div>

          {/* 우리반 출석률 진행도 막대 추가 - 더 굵게 변경 */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">우리반 출석률</span>
              <span className="text-sm font-medium">{currentWeekData.classAvgAttendance || 0}%</span>
            </div>
            <Progress value={currentWeekData.classAvgAttendance || 0} className="h-4 bg-accent" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">내 출석 현황</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrevWeek}
              disabled={currentWeekIndex >= weeklyData.length - 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {currentWeekData.weekStart || ""} ~ {currentWeekData.weekEnd || ""}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleNextWeek}
              disabled={currentWeekIndex <= 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">내 출석률</span>
            <span className="text-sm font-medium">{calculatePersonalAttendanceRate()}%</span>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>날짜</TableHead>
                  <TableHead>요일</TableHead>
                  <TableHead className="text-center">1차시</TableHead>
                  <TableHead className="text-center">2차시</TableHead>
                  <TableHead className="text-center">3차시</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(currentWeekData.attendance || []).map((record: any) => (
                  <TableRow key={record.date}>
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell>{record.day}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={record.period1 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                      >
                        {record.period1 ? "출석" : "결석"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={record.period2 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                      >
                        {record.period2 ? "출석" : "결석"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={record.period3 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                      >
                        {record.period3 ? "출석" : "결석"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-muted-foreground">지난 주 출석 기록은 화살표를 눌러 확인할 수 있습니다.</p>
        </CardFooter>
      </Card>
    </div>
  )
}

