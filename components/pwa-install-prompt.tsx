"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // PWA가 이미 설치되어 있는지 확인
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // beforeinstallprompt 이벤트 리스너 등록
    const handleBeforeInstallPrompt = (e: Event) => {
      // 브라우저 기본 설치 프롬프트 방지
      e.preventDefault()
      // 이벤트 저장
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // 사용자가 이전에 프롬프트를 닫지 않았다면 프롬프트 표시
      const promptClosed = localStorage.getItem("pwaPromptClosed")
      if (!promptClosed || Date.now() > Number.parseInt(promptClosed) + 7 * 24 * 60 * 60 * 1000) {
        setShowPrompt(true)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      }
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // 설치 프롬프트 표시
    await deferredPrompt.prompt()

    // 사용자 선택 결과 확인
    const choiceResult = await deferredPrompt.userChoice

    if (choiceResult.outcome === "accepted") {
      console.log("사용자가 앱 설치를 수락했습니다")
      setIsInstalled(true)
    }

    // 프롬프트 사용 후 초기화
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleClosePrompt = () => {
    setShowPrompt(false)
    // 7일 동안 프롬프트 다시 표시하지 않음
    localStorage.setItem("pwaPromptClosed", Date.now().toString())
  }

  if (!showPrompt || isInstalled) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-base font-medium mb-1">앱 설치하기</h3>
              <p className="text-sm text-muted-foreground mb-3">
                출석 관리 시스템을 홈 화면에 설치하여 더 빠르게 접근하세요.
              </p>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white" onClick={handleInstallClick}>
                <Download className="mr-2 h-4 w-4" />앱 설치하기
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClosePrompt}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

