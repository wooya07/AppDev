"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// 불참 사유 옵션
const absenceReasons = [
  { value: "academy", label: "학원" },
  { value: "hospital", label: "병원" },
  { value: "unauthorized", label: "무단" },
  { value: "school", label: "기타 학교 활동" },
  { value: "other", label: "기타" },
]

// 차시별 상태 정보 - 시간 수정
const periodStatus = {
  period1: { label: "1차시", time: "18:00 ~ 19:10" },
  period2: { label: "2차시", time: "19:20 ~ 21:00" },
  period3: { label: "3차시", time: "21:10 ~ 22:00" },
}

// 샘플 학생 데이터 (백엔드 연결 전 테스트용)
const sampleStudents = [
  { id: "20230001", name: "김민준", grade: "3", class: "8", number: "1" },
  { id: "20230002", name: "이서연", grade: "3", class: "8", number: "2" },
  { id: "20230003", name: "박지훈", grade: "3", class: "8", number: "3" },
  { id: "20230004", name: "최수아", grade: "3", class: "8", number: "4" },
  { id: "20230005", name: "정우진", grade: "3", class: "8", number: "5" },
  { id: "20230006", name: "강하은", grade: "3", class: "8", number: "6" },
  { id: "20230007", name: "조현우", grade: "3", class: "8", number: "7" },
  { id: "20230008", name: "윤지민", grade: "3", class: "8", number: "8" },
  { id: "20230009", name: "임준호", grade: "3", class: "8", number: "9" },
  { id: "20230010", name: "한소희", grade: "3", class: "8", number: "10" },
]

export function SubmitAttendanceForm() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [currentPeriod, setCurrentPeriod] = useState("period1")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [students, setStudents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock session for preview environment
  const session = {
    user: {
      id: "20230001",
      name: "김민준",
      class: "3-8",
    },
  }

  // 학년에 따라 차시 표시 조정
  const [studentGrade, setStudentGrade] = useState("3") // 실제로는 로그인한 학생의 학년 정보를 가져와야 함

  // 차시별 제출 상태 관리
  const [periodSubmissionStatus, setPeriodSubmissionStatus] = useState({
    period1: false, // false = 미제출, true = 제출됨
    period2: false,
    period3: false,
  })

  // 학생별 출석 상태 관리
  const [attendance, setAttendance] = useState<Record<string, any>>({})

  // 백엔드에서 학생 목록 및 제출 상태 가져오기
  useEffect(() => {
    const fetchData = async () => {
      // 프리뷰 환경에서는 API 호출 대신 샘플 데이터 직접 사용
      try {
        // 샘플 데이터 사용
        setStudents(sampleStudents)

        // 초기 출석 상태 설정
        const initialAttendance = sampleStudents.reduce((acc, student) => {
          return {
            ...acc,
            [student.id]: {
              period1: { present: true, reason: "" },
              period2: { present: true, reason: "" },
              period3: { present: true, reason: "" },
            },
          }
        }, {})

        setAttendance(initialAttendance)
        setIsLoading(false)
      } catch (error) {
        console.error("Error setting up data:", error)
        setError("데이터를 불러오는 중 오류가 발생했습니다.")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [date])

  // 체크박스 변경 핸들러
  const handleAttendanceChange = (studentId: string, period: string, checked: boolean) => {
    // 현재 학생의 출석 상태 복사
    const studentAttendance = { ...attendance[studentId] }

    // 현재 차시 출석 상태 업데이트
    studentAttendance[period] = {
      ...studentAttendance[period],
      present: checked,
    }

    // 앞 차시에 불참했다면 뒤 차시도 자동으로 불참 처리
    if (period === "period1" && !checked) {
      studentAttendance.period2 = { present: false, reason: studentAttendance.period2.reason || "academy" }
      studentAttendance.period3 = { present: false, reason: studentAttendance.period3.reason || "academy" }
    } else if (period === "period2" && !checked) {
      studentAttendance.period3 = { present: false, reason: studentAttendance.period3.reason || "academy" }
    }

    // 출석 상태 업데이트
    setAttendance({
      ...attendance,
      [studentId]: studentAttendance,
    })
  }

  // 불참 사유 변경 핸들러
  const handleReasonChange = (studentId: string, period: string, reason: string) => {
    setAttendance({
      ...attendance,
      [studentId]: {
        ...attendance[studentId],
        [period]: {
          ...attendance[studentId][period],
          reason,
        },
      },
    })
  }

  // 차시 변경 핸들러
  const handlePeriodChange = (period: string) => {
    setCurrentPeriod(period)
    setSubmitted(false)
  }

  // 제출 전 확인 다이얼로그 표시
  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사
    if (!date) {
      setError("날짜를 선택해주세요.")
      return
    }

    // 불참 학생들의 사유가 모두 선택되었는지 확인
    let missingReason = false
    Object.keys(attendance).forEach((studentId) => {
      const studentAttendance = attendance[studentId]
      if (!studentAttendance[currentPeriod].present && !studentAttendance[currentPeriod].reason) {
        missingReason = true
      }
    })

    if (missingReason) {
      setError("불참 학생의 사유를 모두 선택해주세요.")
      return
    }

    // 확인 다이얼로그 표시
    setError("")
    setConfirmDialogOpen(true)
  }

  // 출석부 제출 처리
  const handleConfirmSubmit = async () => {
    try {
      // 프리뷰 환경에서는 API 호출 대신 성공 처리 시뮬레이션
      // 다이얼로그 닫기
      setConfirmDialogOpen(false)

      // 성공 메시지 표시
      setSubmitted(true)

      // 현재 차시 제출 상태 업데이트
      setPeriodSubmissionStatus({
        ...periodSubmissionStatus,
        [currentPeriod]: true,
      })

      // 3초 후 성공 메시지 숨기기
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting attendance:", error)
      setError("출석부 제출 중 오류가 발생했습니다.")
      setConfirmDialogOpen(false)
    }
  }

  // 특정 차시가 제출 가능한지 확인
  const isPeriodSubmittable = (period: string) => {
    // 이미 제출된 차시는 제출 불가
    if (periodSubmissionStatus[period as keyof typeof periodSubmissionStatus]) {
      return false
    }

    // 앞 차시가 제출되지 않았다면 제출 불가
    if (period === "period2" && !periodSubmissionStatus.period1) {
      return false
    }

    if (period === "period3" && (!periodSubmissionStatus.period1 || !periodSubmissionStatus.period2)) {
      return false
    }

    return true
  }

  // 특정 차시의 체크박스가 비활성화되어야 하는지 확인
  const isCheckboxDisabled = (studentId: string, period: string) => {
    // 이미 제출된 차시는 수정 불가
    if (periodSubmissionStatus[period as keyof typeof periodSubmissionStatus]) {
      return true
    }

    // 앞 차시에 불참했다면 뒤 차시도 비활성화
    if (period === "period2" && !attendance[studentId]?.period1.present) {
      return true
    }

    if (period === "period3" && (!attendance[studentId]?.period1.present || !attendance[studentId]?.period2.present)) {
      return true
    }

    return false
  }

  // 출석 인원 계산
  const calculateAttendanceCount = () => {
    let count = 0
    Object.keys(attendance).forEach((studentId) => {
      if (attendance[studentId]?.[currentPeriod]?.present) {
        count++
      }
    })
    return count
  }

  if (isLoading) {
    return <div>데이터를 불러오는 중입니다...</div>
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">출석부 제출</h1>

      <Card>
        <CardHeader>
          <CardTitle>야간자율학습 출석부 제출</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">제출 완료</AlertTitle>
              <AlertDescription className="text-green-700">
                {periodStatus[currentPeriod as keyof typeof periodStatus].label} 출석부가 성공적으로 제출되었습니다.
                감독 선생님의 승인을 기다려주세요.
              </AlertDescription>
            </Alert>
          ) : (
            <form className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">날짜</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                {/* 차시 선택 부분 수정 */}
                <div className="space-y-2">
                  <Label htmlFor="period">차시</Label>
                  <Select value={currentPeriod} onValueChange={handlePeriodChange}>
                    <SelectTrigger id="period">
                      <SelectValue placeholder="차시 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="period1" disabled={!isPeriodSubmittable("period1")}>
                        {periodStatus.period1.label} ({periodStatus.period1.time})
                        {periodSubmissionStatus.period1 && " - 제출됨"}
                      </SelectItem>
                      <SelectItem value="period2" disabled={!isPeriodSubmittable("period2")}>
                        {periodStatus.period2.label} ({periodStatus.period2.time})
                        {periodSubmissionStatus.period2 && " - 제출됨"}
                      </SelectItem>
                      {studentGrade === "3" && (
                        <SelectItem value="period3" disabled={!isPeriodSubmittable("period3")}>
                          {periodStatus.period3.label} ({periodStatus.period3.time})
                          {periodSubmissionStatus.period3 && " - 제출됨"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">출석부 제출 안내</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    <li>각 차시별로 출석부를 제출해야 합니다.</li>
                    <li>앞 차시에 불참한 학생은 뒤 차시도 자동으로 불참 처리됩니다.</li>
                    <li>불참 학생은 반드시 사유를 선택해야 합니다.</li>
                    <li>제출 후에는 감독 선생님의 승인이 필요합니다.</li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="rounded-md border overflow-hidden">
                <div className="bg-muted p-2 flex justify-between items-center">
                  <span className="font-medium">3학년 8반 출석부</span>
                  <span className="text-sm">
                    출석: <span className="font-medium text-green-600">{calculateAttendanceCount()}</span> / 전체:{" "}
                    <span className="font-medium">{students.length}</span>
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">학번</TableHead>
                        <TableHead className="w-[100px]">이름</TableHead>
                        <TableHead className="text-center">출석</TableHead>
                        <TableHead>불참 사유</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>

                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={attendance[student.id]?.[currentPeriod]?.present}
                                onCheckedChange={(checked) =>
                                  handleAttendanceChange(student.id, currentPeriod, checked as boolean)
                                }
                                disabled={isCheckboxDisabled(student.id, currentPeriod)}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            {attendance[student.id] && !attendance[student.id][currentPeriod]?.present && (
                              <Select
                                value={attendance[student.id][currentPeriod]?.reason}
                                onValueChange={(value) => handleReasonChange(student.id, currentPeriod, value)}
                                disabled={periodSubmissionStatus[currentPeriod as keyof typeof periodSubmissionStatus]}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="사유 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                  {absenceReasons.map((reason) => (
                                    <SelectItem key={reason.value} value={reason.value}>
                                      {reason.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  3학년 8반의 야간자율학습 {periodStatus[currentPeriod as keyof typeof periodStatus].label} 출석부를
                  제출합니다. 제출 후 감독 선생님의 승인이 필요합니다.
                </p>
              </div>
            </form>
          )}
        </CardContent>
        {!submitted && !periodSubmissionStatus[currentPeriod as keyof typeof periodSubmissionStatus] && (
          <CardFooter>
            <Button
              type="button"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={handleSubmitClick}
            >
              {periodStatus[currentPeriod as keyof typeof periodStatus].label} 출석부 제출
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* 제출 확인 다이얼로그 */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>출석부 제출 확인</DialogTitle>
            <DialogDescription>
              {periodStatus[currentPeriod as keyof typeof periodStatus].label} 출석부를 제출하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-md bg-muted p-4">
              <div className="flex justify-between mb-2">
                <span>날짜:</span>
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>차시:</span>
                <span className="font-medium">
                  {periodStatus[currentPeriod as keyof typeof periodStatus].label}(
                  {periodStatus[currentPeriod as keyof typeof periodStatus].time})
                </span>
              </div>
              <div className="flex justify-between">
                <span>출석 인원:</span>
                <span className="font-medium">
                  {calculateAttendanceCount()} / {students.length}명
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">감독선생님의 승인 이후 수정할 수 없어요</p>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              취소하기
            </Button>
            <Button type="button" className="bg-primary hover:bg-primary/90 text-white" onClick={handleConfirmSubmit}>
              제출하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

