"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Download, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"

export function ExcelExportForm() {
  const [exportType, setExportType] = useState("all")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [gradeFilter, setGradeFilter] = useState("all")
  const [classFilter, setClassFilter] = useState("all")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // 내보내기 옵션
  const [includeOptions, setIncludeOptions] = useState({
    studentInfo: true,
    attendanceStatus: true,
    absenceReasons: true,
    statistics: true,
  })

  const handleOptionChange = (option: string, checked: boolean) => {
    setIncludeOptions({
      ...includeOptions,
      [option]: checked,
    })
  }

  const handleExport = () => {
    // 유효성 검사
    if (!startDate || !endDate) {
      setError("시작일과 종료일을 모두 선택해주세요.")
      return
    }

    if (startDate > endDate) {
      setError("종료일은 시작일 이후여야 합니다.")
      return
    }

    // 내보내기 옵션 중 하나 이상 선택되어야 함
    if (!Object.values(includeOptions).some((value) => value)) {
      setError("내보내기 옵션을 하나 이상 선택해주세요.")
      return
    }

    // 내보내기 처리
    console.log("Exporting data:", {
      exportType,
      startDate,
      endDate,
      gradeFilter,
      classFilter,
      includeOptions,
    })

    // 성공 메시지 표시
    setError("")
    setSuccess(true)

    // 3초 후 초기화
    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">출석 데이터 내보내기</h1>

      <Card>
        <CardHeader>
          <CardTitle>엑셀 파일로 내보내기</CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">내보내기 완료</AlertTitle>
              <AlertDescription className="text-green-700">
                출석 데이터가 성공적으로 엑셀 파일로 내보내졌습니다.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="exportType">내보내기 유형</Label>
                <Select value={exportType} onValueChange={setExportType}>
                  <SelectTrigger id="exportType">
                    <SelectValue placeholder="내보내기 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 출석 데이터</SelectItem>
                    <SelectItem value="daily">일별 출석 현황</SelectItem>
                    <SelectItem value="student">학생별 출석 현황</SelectItem>
                    <SelectItem value="class">반별 출석 현황</SelectItem>
                    <SelectItem value="statistics">통계 데이터</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>시작일</Label>
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>

                <div className="space-y-2">
                  <Label>종료일</Label>
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gradeFilter">학년 필터</Label>
                  <Select value={gradeFilter} onValueChange={setGradeFilter}>
                    <SelectTrigger id="gradeFilter">
                      <SelectValue placeholder="학년 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 학년</SelectItem>
                      <SelectItem value="1">1학년</SelectItem>
                      <SelectItem value="2">2학년</SelectItem>
                      <SelectItem value="3">3학년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classFilter">반 필터</Label>
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger id="classFilter">
                      <SelectValue placeholder="반 선택" />
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
              </div>

              <div className="space-y-3">
                <Label>내보내기 옵션</Label>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="studentInfo"
                    checked={includeOptions.studentInfo}
                    onCheckedChange={(checked) => handleOptionChange("studentInfo", checked as boolean)}
                  />
                  <Label htmlFor="studentInfo" className="text-sm font-normal">
                    학생 정보 (학번, 이름, 학년, 반, 번호)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="attendanceStatus"
                    checked={includeOptions.attendanceStatus}
                    onCheckedChange={(checked) => handleOptionChange("attendanceStatus", checked as boolean)}
                  />
                  <Label htmlFor="attendanceStatus" className="text-sm font-normal">
                    출석 상태 (출석/불참)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="absenceReasons"
                    checked={includeOptions.absenceReasons}
                    onCheckedChange={(checked) => handleOptionChange("absenceReasons", checked as boolean)}
                  />
                  <Label htmlFor="absenceReasons" className="text-sm font-normal">
                    불참 사유
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="statistics"
                    checked={includeOptions.statistics}
                    onCheckedChange={(checked) => handleOptionChange("statistics", checked as boolean)}
                  />
                  <Label htmlFor="statistics" className="text-sm font-normal">
                    통계 데이터 (출석률, 평균 등)
                  </Label>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">내보내기 정보</AlertTitle>
                <AlertDescription className="text-blue-700">
                  선택한 기간과 필터에 따라 출석 데이터가 엑셀 파일로 내보내집니다. 주말(토, 일)은 자동으로 제외됩니다.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        {!success && (
          <CardFooter>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              엑셀 파일로 내보내기
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

