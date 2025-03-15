"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function AttendanceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Chart data - attendance rates by week (%)
    const data = [85, 92, 88, 95, 90, 87, 93, 91, 89, 94, 92, 96]
    const labels = [
      "1주차",
      "2주차",
      "3주차",
      "4주차",
      "5주차",
      "6주차",
      "7주차",
      "8주차",
      "9주차",
      "10주차",
      "11주차",
      "12주차",
    ]

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
    const maxValue = 100 // attendance is percentage
    const minValue = 70 // start y-axis from 70% for better visualization
    const valueRange = maxValue - minValue
    const xStep = chartWidth / (data.length - 1)
    const yStep = chartHeight / valueRange

    // Draw grid lines
    ctx.strokeStyle = "#e5e5ec"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 6; i++) {
      const value = minValue + (i * valueRange) / 6
      const y = padding + chartHeight - (value - minValue) * yStep
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(padding + chartWidth, y)
      ctx.stroke()

      // Draw y-axis labels
      ctx.fillStyle = "#505050"
      ctx.font = "10px Arial"
      ctx.textAlign = "right"
      ctx.fillText(`${Math.round(value)}%`, padding - 5, y + 3)
    }

    // Draw line chart
    ctx.strokeStyle = "#099c34"
    ctx.lineWidth = 2
    ctx.beginPath()

    // Plot points and line
    data.forEach((value, index) => {
      const x = padding + index * xStep
      const y = padding + chartHeight - (value - minValue) * yStep

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
      const y = padding + chartHeight - (value - minValue) * yStep

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
        <CardTitle className="text-lg font-medium">주간 출석률 추이</CardTitle>
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

