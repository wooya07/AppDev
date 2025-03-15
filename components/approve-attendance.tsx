"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Search, Filter, Eye, CheckCircle, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// 샘플 데이터 - 출석 기록
const attendanceRecords = [
  {
    id: "ATT-1001",
    date: "2025-03-14",
    day: "금",
    className: "1학년 2반",
    period: "1차시 (18:00 ~ 19:10)",
    attendanceCount: 29,
    totalStudents: 32,
    submittedBy: "이반장",
    status: "대기중",
    details: [
      { id: "20230101", name: "김태현", present: true },
      { id: "20230102", name: "박민지", present: true },
      { id: "20230103", name: "이준영", present: false, reason: "학원" },
      { id: "20230104", name: "최지우", present: true },
      { id: "20230105", name: "정민준", present: true },
    ],
  },
  {
    id: "ATT-1002",
    date: "2025-03-14",
    day: "금",
    className: "1학년 2반",
    period: "2차시 (19:20 ~ 21:00)",
    attendanceCount: 28,
    totalStudents: 32,
    submittedBy: "이반장",
    status: "대기중",
    details: [
      { id: "20230101", name: "김태현", present: true },
      { id: "20230102", name: "박민지", present: true },
      { id: "20230103", name: "이준영", present: false, reason: "학원" },
      { id: "20230104", name: "최지우", present: false, reason: "병원" },
      { id: "20230105", name: "정민준", present: true },
    ],
  },
  {
    id: "ATT-1000",
    date: "2025-03-13",
    day: "목",
    className: "1학년 2반",
    period: "1차시 (18:00 ~ 19:10)",
    attendanceCount: 30,
    totalStudents: 32,
    submittedBy: "이반장",
    status: "승인됨",
    details: [
      { id: "20230101", name: "김태현", present: true },
      { id: "20230102", name: "박민지", present: true },
      { id: "20230103", name: "이준영", present: true },
      { id: "20230104", name: "최지우", present: true },
      { id: "20230105", name: "정민준", present: false, reason: "무단" },
    ],
  },
]

export function ApproveAttendance() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [records, setRecords] = useState(attendanceRecords)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const filteredRecords = records.filter((record) => {
    // 검색어 필터
    const matchesSearch =
      record.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm) ||
      record.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())

    // 상태 필터
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && record.status === "대기중") ||
      (statusFilter === "approved" && record.status === "승인됨") ||
      (statusFilter === "rejected" && record.status === "거부됨")

    return matchesSearch && matchesStatus
  })

  // 출석부 상세 보기
  const handleViewDetails = (record: any) => {
    setSelectedRecord(record)
    setDetailDialogOpen(true)
  }

  // 승인 다이얼로그 열기
  const handleOpenApproveDialog = (record: any) => {
    setSelectedRecord(record)
    setApproveDialogOpen(true)
    setActionSuccess(null)
  }

  // 거부 다이얼로그 열기
  const handleOpenRejectDialog = (record: any) => {
    setSelectedRecord(record)
    setRejectDialogOpen(true)
    setActionSuccess(null)
  }

  // 출석부 승인 처리
  const handleApprove = () => {
    setRecords(records.map((record) => (record.id === selectedRecord.id ? { ...record, status: "승인됨" } : record)))
    setActionSuccess("approve")

    // 3초 후 다이얼로그 닫기
    setTimeout(() => {
      setApproveDialogOpen(false)
      setSelectedRecord(null)
    }, 3000)
  }

  // 출석부 거부 처리
  const handleReject = () => {
    setRecords(records.map((record) => (record.id === selectedRecord.id ? { ...record, status: "거부됨" } : record)))
    setActionSuccess("reject")

    // 3초 후 다이얼로그 닫기
    setTimeout(() => {
      setRejectDialogOpen(false)
      setSelectedRecord(null)
    }, 3000)
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">출석부 승인</h1>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">출석부 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="approved">승인됨</SelectItem>
                  <SelectItem value="rejected">거부됨</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-medium">검색 결과가 없습니다</h3>
                <p className="text-sm text-muted-foreground">다른 검색어나 필터를 사용해보세요.</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
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
                      {filteredRecords.map((record) => (
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
                            <Badge
                              variant="outline"
                              className={
                                record.status === "승인됨"
                                  ? "bg-green-50 text-green-700"
                                  : record.status === "거부됨"
                                    ? "bg-red-50 text-red-700"
                                    : "bg-yellow-50 text-yellow-700"
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => handleViewDetails(record)}
                                title="상세보기"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              {record.status === "대기중" && (
                                <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => handleOpenApproveDialog(record)}
                                    title="승인"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleOpenRejectDialog(record)}
                                    title="거부"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 출석부 상세 다이얼로그 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>출석부 상세</DialogTitle>
            <DialogDescription>
              {selectedRecord && `${selectedRecord.className} ${selectedRecord.period} (${selectedRecord.date})`}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="py-4">
              <div className="rounded-md bg-muted p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>제출자:</span>
                  <span className="font-medium">{selectedRecord.submittedBy}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>출석 인원:</span>
                  <span className="font-medium">
                    {selectedRecord.attendanceCount} / {selectedRecord.totalStudents}명
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>출석률:</span>
                  <span className="font-medium">
                    {Math.round((selectedRecord.attendanceCount / selectedRecord.totalStudents) * 100)}%
                  </span>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>학번</TableHead>
                      <TableHead>이름</TableHead>
                      <TableHead>출석 상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRecord.details.map((student: any) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          {student.present ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              출석
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700">
                              불참 ({student.reason})
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" onClick={() => setDetailDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 승인 확인 다이얼로그 */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>출석부 승인</DialogTitle>
            <DialogDescription>
              {selectedRecord && `${selectedRecord.className} ${selectedRecord.period} 출석부를 승인하시겠습니까?`}
            </DialogDescription>
          </DialogHeader>

          {actionSuccess === "approve" ? (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <AlertTitle className="text-green-800">승인 완료</AlertTitle>
              <AlertDescription className="text-green-700">출석부가 성공적으로 승인되었습니다.</AlertDescription>
            </Alert>
          ) : (
            <div className="py-4">
              {selectedRecord && (
                <div className="rounded-md bg-muted p-4">
                  <div className="flex justify-between mb-2">
                    <span>날짜:</span>
                    <span className="font-medium">
                      {selectedRecord.date} ({selectedRecord.day})
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>차시:</span>
                    <span className="font-medium">{selectedRecord.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>출석 인원:</span>
                    <span className="font-medium">
                      {selectedRecord.attendanceCount} / {selectedRecord.totalStudents}명
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            {actionSuccess !== "approve" && (
              <>
                <Button type="button" variant="outline" onClick={() => setApproveDialogOpen(false)}>
                  취소
                </Button>
                <Button type="button" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleApprove}>
                  승인하기
                </Button>
              </>
            )}
            {actionSuccess === "approve" && (
              <Button type="button" onClick={() => setApproveDialogOpen(false)}>
                닫기
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 거부 확인 다이얼로그 */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>출석부 거부</DialogTitle>
            <DialogDescription>
              {selectedRecord && `${selectedRecord.className} ${selectedRecord.period} 출석부를 거부하시겠습니까?`}
            </DialogDescription>
          </DialogHeader>

          {actionSuccess === "reject" ? (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertTitle className="text-red-800">거부 완료</AlertTitle>
              <AlertDescription className="text-red-700">
                출석부가 거부되었습니다. 제출자에게 수정 요청이 전송되었습니다.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="py-4">
              {selectedRecord && (
                <div className="rounded-md bg-muted p-4">
                  <div className="flex justify-between mb-2">
                    <span>날짜:</span>
                    <span className="font-medium">
                      {selectedRecord.date} ({selectedRecord.day})
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>차시:</span>
                    <span className="font-medium">{selectedRecord.period}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>출석 인원:</span>
                    <span className="font-medium">
                      {selectedRecord.attendanceCount} / {selectedRecord.totalStudents}명
                    </span>
                  </div>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-4">출석부를 거부하면 제출자에게 수정 요청이 전송됩니다.</p>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            {actionSuccess !== "reject" && (
              <>
                <Button type="button" variant="outline" onClick={() => setRejectDialogOpen(false)}>
                  취소
                </Button>
                <Button type="button" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleReject}>
                  거부하기
                </Button>
              </>
            )}
            {actionSuccess === "reject" && (
              <Button type="button" onClick={() => setRejectDialogOpen(false)}>
                닫기
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

