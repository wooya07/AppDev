"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Reset states
    setError("")
    setSuccess(false)

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.")
      return
    }

    if (newPassword.length < 4) {
      setError("비밀번호는 최소 4자 이상이어야 합니다.")
      return
    }

    // In a real app, you would verify the current password and update to the new one
    console.log("Changing password:", {
      currentPassword,
      newPassword,
      confirmPassword,
    })

    // Show success message
    setSuccess(true)

    // Reset form
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">비밀번호 변경</h1>

      <Card>
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">변경 완료</AlertTitle>
              <AlertDescription className="text-green-700">비밀번호가 성공적으로 변경되었습니다.</AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>오류</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground">비밀번호는 최소 4자 이상이어야 합니다.</p>
              </div>
            </form>
          )}
        </CardContent>
        {!success && (
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" onClick={handleSubmit}>
              비밀번호 변경
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

