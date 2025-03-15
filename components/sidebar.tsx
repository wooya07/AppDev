"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Settings,
  LogOut,
  UserCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Define the SidebarProps interface
interface SidebarProps {
  userRole: "student" | "teacher" | "admin"
}

// 반장과 일반 학생 계정을 통합하고, 모든 학생이 출석부 제출 가능하도록 수정
// studentItems에 출석부 제출 메뉴 추가
const studentItems = [
  {
    name: "출석 통계",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "내 출석 현황",
    href: "/dashboard/my-attendance",
    icon: UserCircle,
  },
  {
    name: "출석부 제출",
    href: "/dashboard/submit-attendance",
    icon: ClipboardCheck,
  },
  {
    name: "비밀번호 변경",
    href: "/dashboard/change-password",
    icon: Lock,
  },
]

// Define teacherItems
const teacherItems = [
  {
    name: "출석 관리",
    href: "/teacher-dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "학생 관리",
    href: "/teacher-dashboard/students",
    icon: Users,
  },
  {
    name: "승인 관리",
    href: "/teacher-dashboard/approve",
    icon: ClipboardCheck,
  },
  {
    name: "비밀번호 변경",
    href: "/teacher-dashboard/change-password",
    icon: Lock,
  },
]

// Define adminItems
const adminItems = [
  {
    name: "대시보드",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "사용자 관리",
    href: "/admin-dashboard/user-management",
    icon: Users,
  },
  {
    name: "엑셀 업로드",
    href: "/admin-dashboard/excel-upload",
    icon: ClipboardCheck,
  },
  {
    name: "엑셀 내보내기",
    href: "/admin-dashboard/excel-export",
    icon: ClipboardCheck,
  },
  {
    name: "데이터 초기화",
    href: "/admin-dashboard/data-reset",
    icon: Settings,
  },
  {
    name: "비밀번호 변경",
    href: "/admin-dashboard/change-password",
    icon: Lock,
  },
]

// 사이드바 컴포넌트 수정
export function Sidebar({ userRole = "student" }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [userName, setUserName] = useState("")

  // 화면 크기에 따라 사이드바 상태 조정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }

    // 초기 로드 시 화면 크기 확인
    handleResize()

    // 화면 크기 변경 시 이벤트 리스너
    window.addEventListener("resize", handleResize)

    // 로컬 스토리지에서 사용자 이름 가져오기
    if (typeof window !== "undefined") {
      const storedName = window.localStorage.getItem("userName")
      if (storedName) {
        setUserName(storedName)
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // 로그아웃 기능 구현
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // 로컬 스토리지에서 토큰 및 사용자 정보 삭제
      window.localStorage.removeItem("token")
      window.localStorage.removeItem("userRole")
      window.localStorage.removeItem("userName")

      // 로그인 페이지로 리다이렉트
      window.location.href = "/"
    }
  }

  // Select sidebar items based on user role
  let sidebarItems = studentItems
  let dashboardPrefix = "/dashboard"

  if (userRole === "teacher") {
    sidebarItems = teacherItems
    dashboardPrefix = "/teacher-dashboard"
  } else if (userRole === "admin") {
    sidebarItems = adminItems
    dashboardPrefix = "/admin-dashboard"
  }

  // Determine user info based on role
  const userInfo = {
    name: userName || "사용자",
    role: userRole === "admin" ? "시스템 관리자" : userRole === "teacher" ? "선생님" : "학생",
  }

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center border-b px-4 justify-between">
        <Link href={dashboardPrefix} className="flex items-center gap-2 font-semibold">
          <div className="h-6 w-6 rounded-full bg-primary flex-shrink-0" />
          {!collapsed && <span>야간자율학습 관리</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-auto lg:flex"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!collapsed && (
        <div className="border-b p-4">
          <div className="font-medium">{userInfo.name}</div>
          <div className="text-sm text-muted-foreground">{userInfo.role}</div>
        </div>
      )}

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted",
                pathname === item.href ? "bg-muted font-medium" : "text-muted-foreground",
                collapsed ? "justify-center" : "",
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t p-2">
        <Button
          variant="ghost"
          className={cn("w-full justify-start gap-3 px-3", collapsed ? "justify-center" : "")}
          onClick={handleLogout}
          title={collapsed ? "로그아웃" : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>로그아웃</span>}
        </Button>
      </div>
    </div>
  )
}

