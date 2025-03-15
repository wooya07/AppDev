"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Info, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AdminDataReset() {
  const [exportBeforeReset, setExportBeforeReset] = useState(true)
  const [resetType, setResetType] = useState("year")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // 초기화 옵션
  const [resetOptions, setResetOptions] = useState({
    attendanceData: true,
    keepStudentAccounts: true,
    keepTeacherAccounts: true,
    keepAdminAccounts: true,
  })

  const handleOptionChange = (option: string, checked: boolean) => {
    setResetOptions({
      ...resetOptions,
      [option]: checked,
    })
  }

  const handleResetClick = () => {
    // 유효성 검사
    if (
      !resetOptions.attendanceData &&
      !resetOptions.keepStudentAccounts &&
      !resetOptions.keepTeacherAccounts &&
      !resetOptions.keepAdminAccounts
    ) {
      setError("초기화 옵션을 하나 이상 선택해주세요.")
      return
    }

    // 확인 다이얼로그 표시
    setError("")
    setConfirmDialogOpen(true)
  }

  const handleConfirmReset = () => {
    // 실제 구현에서는 API 호출 등으로 데이터 초기화
    console.log("Resetting data:", {
      resetType,
      exportBeforeReset,
      resetOptions,
    })

    // 다이얼로그 닫기
    setConfirmDialogOpen(false)

    // 성공 메시지 표시
    setSuccess(true)

    // 5초 후 성공 메시지 숨기기
    setTimeout(() => {
      setSuccess(false)
    }, 5000)
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">데이터 초기화</h1>

      <Card>
        <CardHeader>
          <CardTitle>시스템 데이터 초기화</CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">초기화 완료</AlertTitle>
              <AlertDescription className="text-green-700">
                시스템 데이터가 성공적으로 초기화되었습니다.
                {exportBeforeReset && " 초기화 전 데이터는 엑셀 파일로 내보내졌습니다."}
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

              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">주의</AlertTitle>
                <AlertDescription className="text-amber-700">
                  데이터 초기화는 되돌릴 수 없습니다. 초기화 전에 데이터를 백업하는 것을 권장합니다.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="resetType">초기화 유형</Label>
                <Select value={resetType} onValueChange={setResetType}>
                  <SelectTrigger id="resetType">
                    <SelectValue placeholder="초기화 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="year">학년도 전환 초기화 (출석 데이터만)</SelectItem>
                    <SelectItem value="semester">학기 전환 초기화 (출석 데이터만)</SelectItem>
                    <SelectItem value="full">전체 시스템 초기화 (모든 데이터)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {resetType === "year" &&
                    "학년도가 바뀔 때 사용합니다. 학생 계정은 유지되고 출석 데이터만 초기화됩니다."}
                  {resetType === "semester" &&
                    "학기가 바뀔 때 사용합니다. 학생 계정은 유지되고 출석 데이터만 초기화됩니다."}
                  {resetType === "full" && "모든 데이터를 초기화합니다. 관리자 계정만 유지됩니다."}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exportBeforeReset"
                  checked={exportBeforeReset}
                  onCheckedChange={(checked) => setExportBeforeReset(checked as boolean)}
                />
                <Label htmlFor="exportBeforeReset" className="text-sm font-normal">
                  초기화 전 데이터 엑셀로 내보내기
                </Label>
              </div>

              <div className="space-y-3">
                <Label>초기화 옵션</Label>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="attendanceData"
                    checked={resetOptions.attendanceData}
                    onCheckedChange={(checked) => handleOptionChange("attendanceData", checked as boolean)}
                  />
                  <Label htmlFor="attendanceData" className="text-sm font-normal">
                    출석 데이터 초기화
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="keepStudentAccounts"
                    checked={resetOptions.keepStudentAccounts}
                    onCheckedChange={(checked) => handleOptionChange("keepStudentAccounts", checked as boolean)}
                  />
                  <Label htmlFor="keepStudentAccounts" className="text-sm font-normal">
                    학생 계정 유지 (체크 해제 시 삭제)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="keepTeacherAccounts"
                    checked={resetOptions.keepTeacherAccounts}
                    onCheckedChange={(checked) => handleOptionChange("keepTeacherAccounts", checked as boolean)}
                  />
                  <Label htmlFor="keepTeacherAccounts" className="text-sm font-normal">
                    교사 계정 유지 (체크 해제 시 삭제)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="keepAdminAccounts"
                    checked={resetOptions.keepAdminAccounts}
                    onCheckedChange={(checked) => handleOptionChange("keepAdminAccounts", checked as boolean)}
                  />
                  <Label htmlFor="keepAdminAccounts" className="text-sm font-normal">
                    관리자 계정 유지 (체크 해제 시 삭제)
                  </Label>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">초기화 정보</AlertTitle>
                <AlertDescription className="text-blue-700">
                  학년도 전환 초기화는 매년 3월 초에 진행하는 것을 권장합니다. 초기화 전에 반드시 데이터를 백업해주세요.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        {!success && (
          <CardFooter>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleResetClick}>
              <Trash2 className="mr-2 h-4 w-4" />
              데이터 초기화
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* 초기화 확인 다이얼로그 */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>데이터 초기화 확인</DialogTitle>
            <DialogDescription>
              정말로 시스템 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="rounded-md bg-muted p-4">
              <div className="flex justify-between mb-2">
                <span>초기화 유형:</span>
                <span className="font-medium">
                  {resetType === "year" && "학년도 전환 초기화"}
                  {resetType === "semester" && "학기 전환 초기화"}
                  {resetType === "full" && "전체 시스템 초기화"}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>데이터 내보내기:</span>
                <span className="font-medium">{exportBeforeReset ? "예" : "아니오"}</span>
              </div>
              <div className="flex justify-between">
                <span>초기화 항목:</span>
                <span className="font-medium">
                  {resetOptions.attendanceData ? "출석 데이터, " : ""}
                  {!resetOptions.keepStudentAccounts ? "학생 계정, " : ""}
                  {!resetOptions.keepTeacherAccounts ? "교사 계정, " : ""}
                  {!resetOptions.keepAdminAccounts ? "관리자 계정" : ""}
                </span>
              </div>
            </div>
            <p className="text-xs text-red-600 mt-2 text-center font-medium">이 작업은 되돌릴 수 없습니다!</p>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              취소하기
            </Button>
            <Button type="button" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirmReset}>
              초기화 진행
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

