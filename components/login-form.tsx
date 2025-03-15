"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [idError, setIdError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [rememberLogin, setRememberLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사 로직
    setIdError("")
    setPasswordError("")
    let isValid = true

    if (!userId) {
      setIdError("아이디를 입력해주세요")
      isValid = false
    }

    if (!password) {
      setPasswordError("비밀번호를 입력해주세요")
      isValid = false
    }

    if (isValid) {
      setIsLoading(true)

      try {
        // 프리뷰 환경에서는 하드코딩된 계정으로 로그인 처리
        // 관리자 계정
        if (userId === "A0001" && password === "admin1234") {
          if (typeof window !== "undefined") {
            window.localStorage.setItem("token", "mock-token")
            window.localStorage.setItem("userRole", "admin")
            window.localStorage.setItem("userName", "관리자")
          }

          setTimeout(() => {
            router.push("/admin-dashboard")
          }, 500)
          return
        }

        // 교사 계정
        if (userId === "T1001" && password === "teacher1234") {
          if (typeof window !== "undefined") {
            window.localStorage.setItem("token", "mock-token")
            window.localStorage.setItem("userRole", "teacher")
            window.localStorage.setItem("userName", "박선생")
          }

          setTimeout(() => {
            router.push("/teacher-dashboard")
          }, 500)
          return
        }

        // 학생 계정
        if (userId === "20230001" && password === "student1234") {
          if (typeof window !== "undefined") {
            window.localStorage.setItem("token", "mock-token")
            window.localStorage.setItem("userRole", "student")
            window.localStorage.setItem("userName", "김민준")
          }

          setTimeout(() => {
            router.push("/dashboard")
          }, 500)
          return
        }

        // 계정 정보가 일치하지 않는 경우
        setPasswordError("아이디 또는 비밀번호가 올바르지 않습니다")
      } catch (error) {
        console.error("Login error:", error)
        setPasswordError("로그인 처리 중 오류가 발생했습니다")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <h2 className="text-xl font-bold">야간자율학습 출석 관리 시스템</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">아이디</Label>
            <Input
              id="userId"
              placeholder="아이디를 입력하세요"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={idError ? "border-destructive" : ""}
            />
            {idError && <p className="text-sm text-destructive">{idError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? "border-destructive" : ""}
            />
            {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberLogin"
              checked={rememberLogin}
              onCheckedChange={(checked) => setRememberLogin(!!checked)}
            />
            <Label htmlFor="rememberLogin" className="text-sm font-normal">
              로그인 유지하기
            </Label>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>비밀번호를 잊으셨나요? 담임선생님께 문의하세요.</p>
            <p className="mt-1 text-primary">테스트 계정:</p>
            <p className="text-primary">관리자: A0001 / admin1234</p>
            <p className="text-primary">교사: T1001 / teacher1234</p>
            <p className="text-primary">학생: 20230001 / student1234</p>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-white"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          해당 사이트는 <span className="text-[#099C34] font-medium">학교에서 발급한 계정</span>으로만 로그인이
          가능해요.
        </p>
      </CardFooter>
    </Card>
  )
}

