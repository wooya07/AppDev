"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockClassAttendanceData, mockRecentClassAttendance, mockPendingApprovals } from "@/lib/mock-data" // 목업 데이터 임포트

export function TeacherDashboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedClassNumber, setSelectedClassNumber] = useState("all")
  const [classAttendanceData, setClassAttendanceData] = useState<any[]>([])
  const [recentClassAttendance, setRecentClassAttendance] = useState<any[]>([])
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 백엔드에서 데이터 가져오기
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 프리뷰 환경에서는 목업 데이터 사용
        setClassAttendanceData(mockClassAttendanceData)
        setRecentClassAttendance(mockRecentClassAttendance)
        setPendingApprovals(mockPendingApprovals)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // 오류 발생 시 목업 데이터 사용
        setClassAttendanceData(mockClassAttendanceData)
        setRecentClassAttendance(mockRecentClassAttendance)
        setPendingApprovals(mockPendingApprovals)
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [selectedGrade, selectedClassNumber])

  // 출석부 승인 처리
  const handleApproveAttendance = async (attendanceId: string) => {
    try {
      // 프리뷰 환경에서는 UI만 업데이트
      setPendingApprovals(pendingApprovals.filter((item) => item.id !== attendanceId))
    } catch (error) {
      console.error("Error approving attendance:", error)
    }
  }

  // 출석부 거부 처리
  const handleRejectAttendance = async (attendanceId: string) => {
    try {
      // 프리뷰 환경에서는 UI만 업데이트
      setPendingApprovals(pendingApprovals.filter((item) => item.id !== attendanceId))
    } catch (error) {
      console.error("Error rejecting attendance:", error)
    }
  }

  // 엑셀 내보내기 처리
  const handleExportExcel = async () => {
    alert("프리뷰 환경에서는 엑셀 내보내기 기능이 지원되지 않습니다.")
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

    // Filter data based on selected class
    let data = classAttendanceData
    if (selectedClass !== "all") {
      data = classAttendanceData.filter((item) => {
        const grade = selectedClass.split("학년")[0]
        return item.className.startsWith(`${grade}학년`)
      })
    }

    // Chart dimensions
    const chartWidth = canvas.width - 60
    const chartHeight = canvas.height - 60
    const padding = { left: 40, right: 20, top: 30, bottom: 30 }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate scales
    const maxValue = 100 // Max is 100%
    const barWidth = (chartWidth / data.length) * 0.7
    const barSpacing = (chartWidth / data.length) * 0.3

    // Draw title
    ctx.fillStyle = "#000000"
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.fillText("학급별 야간자율학습 참여율", canvas.width / 2, 20)

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

    for (let i = 0; i <= 5; i++) {
      const value = Math.round((maxValue * i) / 5)
      const y = padding.top + chartHeight - (chartHeight * i) / 5

      // Grid line
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.strokeStyle = "#e5e5ec"
      ctx.stroke()

      // Label
      ctx.fillText(value.toString() + "%", padding.left - 5, y + 3)
    }

    // Draw bars
    data.forEach((item, index) => {
      const x = padding.left + (chartWidth / data.length) * index + (chartWidth / data.length - barWidth) / 2
      const barHeight = (item.rate / maxValue) * chartHeight
      const y = padding.top + chartHeight - barHeight

      // Bar
      ctx.fillStyle = "#099c34"
      ctx.fillRect(x, y, barWidth, barHeight)

      // Value on top of bar
      ctx.fillStyle = "#000000"
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(item.rate.toString() + "%", x + barWidth / 2, y - 5)

      // X-axis label
      ctx.fillStyle = "#505050"
      ctx.font = "10px Arial"
      ctx.fillText(item.className, x + barWidth / 2, padding.top + chartHeight + 15)
    })
  }, [selectedClass, classAttendanceData])

  if (isLoading) {
    return <div>데이터를 불러오는 중입니다...</div>
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">교사 대시보드</h1>

      <Tabs defaultValue="attendance-rate">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attendance-rate">학급별 출석률</TabsTrigger>
          <TabsTrigger value="recent-attendance">최근 출석 현황</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance-rate" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-lg font-medium">학급별 출석률</CardTitle>
                <div className="flex gap-2">
                  <select
                    className="text-sm border rounded px-2 py-1"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="all">전체 학년</option>
                    <option value="1학년">1학년</option>
                    <option value="2학년">2학년</option>
                    <option value="3학년">3학년</option>
                  </select>
                  <Button variant="outline" size="sm" className="h-8" onClick={handleExportExcel}>
                    <Download className="h-4 w-4 mr-1" />
                    내보내기
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[21/9] w-full">
                <canvas ref={canvasRef} className="h-full w-full" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent-attendance" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <CardTitle className="text-lg font-medium">최근 5일간 학급별 출석 현황</CardTitle>
                <div className="flex gap-2">
                  <Select defaultValue="all" value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="학년" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 학년</SelectItem>
                      <SelectItem value="1">1학년</SelectItem>
                      <SelectItem value="2">2학년</SelectItem>
                      <SelectItem value="3">3학년</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all" value={selectedClassNumber} onValueChange={setSelectedClassNumber}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="반" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 반</SelectItem>
                      <SelectItem value="1">1반</SelectItem>
                      <SelectItem value="2">2반</SelectItem>
                      <SelectItem value="3">3반</SelectItem>
                      <SelectItem value="4">4반</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="h-8" onClick={handleExportExcel}>
                    <Download className="h-4 w-4 mr-1" />
                    내보내기
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {recentClassAttendance.map((classData, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{classData.className}</h3>
                      <span className="text-sm text-muted-foreground">
                        평균 출석률:{" "}
                        {Math.round(
                          (classData.days.reduce((sum: number, day: any) => sum + day.attendance, 0) /
                            (classData.days.length * classData.totalStudents)) *
                            100,
                        )}
                        %
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {classData.days.map((day: any, dayIndex: number) => (
                        <div key={dayIndex} className="border rounded-md p-2 text-center">
                          <div className="text-xs text-muted-foreground">{day.date.slice(5)}</div>
                          <div className="font-medium">
                            {day.attendance}/{classData.totalStudents}
                          </div>
                          <Progress value={(day.attendance / classData.totalStudents) * 100} className="h-1 mt-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">승인 대기 중인 출석부</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingApprovals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle className="mb-2 h-10 w-10 text-green-500" />
              <h3 className="text-lg font-medium">승인 대기 중인 출석부가 없습니다</h3>
              <p className="text-sm text-muted-foreground">모든 출석부가 승인되었습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>날짜</TableHead>
                    <TableHead>학급</TableHead>
                    <TableHead>차시</TableHead>
                    <TableHead>참여 인원</TableHead>
                    <TableHead>제출자</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovals.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.date} ({record.day})
                      </TableCell>
                      <TableCell>{record.className}</TableCell>
                      <TableCell>{record.period}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {record.attendanceCount}/{record.totalStudents}
                          </span>
                          <Progress
                            value={(record.attendanceCount / record.totalStudents) * 100}
                            className="w-16 h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{record.submittedBy}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleApproveAttendance(record.id)}
                          >
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleRejectAttendance(record.id)}
                          >
                            거부
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

