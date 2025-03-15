"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, FileSpreadsheet, Settings, ArrowRight, Download } from "lucide-react"
import Link from "next/link"

// Sample data for system stats
const systemStats = [
  {
    title: "총 학생 수",
    value: "1,234명",
    icon: Users,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "오늘 출석률",
    value: "92%",
    icon: BarChart3,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "최근 업로드",
    value: "2025-03-10",
    icon: FileSpreadsheet,
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "시스템 상태",
    value: "정상",
    icon: Settings,
    color: "bg-purple-100 text-purple-700",
  },
]

// Sample data for recent activities
const recentActivities = [
  {
    id: "ACT-1001",
    date: "2025-03-14 14:23",
    user: "관리자 (A0001)",
    action: "엑셀 파일 업로드",
    details: "1학년 학생 명단.xlsx",
  },
  {
    id: "ACT-1000",
    date: "2025-03-14 10:15",
    user: "박선생 (T0001)",
    action: "출석부 승인",
    details: "1학년 2반 (2025-03-13)",
  },
  {
    id: "ACT-999",
    date: "2025-03-13 18:45",
    user: "이반장 (20230101)",
    action: "출석부 제출",
    details: "1학년 2반 (2025-03-13)",
  },
  {
    id: "ACT-998",
    date: "2025-03-13 16:30",
    user: "관리자 (A0001)",
    action: "계정 생성",
    details: "신규 교사 계정 3개",
  },
]

export function AdminDashboard() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">관리자 대시보드</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-2 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">최근 활동</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              모든 활동 보기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>날짜</TableHead>
                  <TableHead>사용자</TableHead>
                  <TableHead>작업</TableHead>
                  <TableHead>상세</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.date}</TableCell>
                    <TableCell>{activity.user}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          activity.action.includes("업로드")
                            ? "bg-blue-50 text-blue-700"
                            : activity.action.includes("승인")
                              ? "bg-green-50 text-green-700"
                              : activity.action.includes("제출")
                                ? "bg-amber-50 text-amber-700"
                                : "bg-purple-50 text-purple-700"
                        }
                      >
                        {activity.action}
                      </Badge>
                    </TableCell>
                    <TableCell>{activity.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">빠른 작업</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link href="/admin-dashboard/excel-upload">
              <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-white">
                <FileSpreadsheet className="h-4 w-4" />
                학생 명단 업로드
              </Button>
            </Link>
            <Link href="/admin-dashboard/excel-export">
              <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-white">
                <Download className="h-4 w-4" />
                출석 데이터 내보내기
              </Button>
            </Link>
            <Link href="/admin-dashboard/accounts">
              <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-white">
                <Users className="h-4 w-4" />
                계정 관리
              </Button>
            </Link>
            <Link href="/admin-dashboard/settings">
              <Button className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-white">
                <Settings className="h-4 w-4" />
                시스템 설정
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">시스템 정보</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">버전</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">마지막 업데이트</span>
              <span className="font-medium">2025-03-10</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">데이터베이스 상태</span>
              <span className="font-medium text-green-600">정상</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">서버 상태</span>
              <span className="font-medium text-green-600">정상</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">저장 공간</span>
              <span className="font-medium">2.4GB / 10GB</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

