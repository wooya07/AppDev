"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function DashboardChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Chart data
    const data = [20, 35, 25, 45, 30, 55, 40, 60, 45, 70, 55, 65]
    const labels = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

    // Chart dimensions
    const chartWidth = canvas.width - 40
    const chartHeight = canvas.height - 40
    const padding = 20

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw chart background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(padding, padding, chartWidth, chartHeight)

    // Calculate scales
    const maxValue = Math.max(...data) * 1.2
    const xStep = chartWidth / (data.length - 1)
    const yStep = chartHeight / maxValue

    // Draw grid lines
    ctx.strokeStyle = "#e5e5ec"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + chartHeight - (i * chartHeight) / 5
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()
    }

    // Draw line chart
    ctx.strokeStyle = "#099c34"
    ctx.lineWidth = 2
    ctx.beginPath()

    // Plot points and line
    data.forEach((value, index) => {
      const x = padding + index * xStep
      const y = padding + chartHeight - value * yStep

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(padding + (data.length - 1) * xStep, padding + chartHeight)
    ctx.lineTo(padding, padding + chartHeight)
    ctx.closePath()
    ctx.fillStyle = "rgba(9, 156, 52, 0.1)"
    ctx.fill()

    // Draw points
    data.forEach((value, index) => {
      const x = padding + index * xStep
      const y = padding + chartHeight - value * yStep

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.fill()
      ctx.strokeStyle = "#099c34"
      ctx.lineWidth = 2
      ctx.stroke()
    })

    // Draw x-axis labels
    ctx.fillStyle = "#505050"
    ctx.font = "10px Arial"
    ctx.textAlign = "center"

    labels.forEach((label, index) => {
      if (index % 2 === 0) {
        // Show every other label to avoid crowding
        const x = padding + index * xStep
        const y = padding + chartHeight + 15
        ctx.fillText(label, x, y)
      }
    })
  }, [])

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">월간 데이터 통계 그래프</CardTitle>
        <Button variant="ghost" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-[16/9] w-full">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

