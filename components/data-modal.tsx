"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface DataModalProps {
  isOpen: boolean
  onClose: () => void
  item: any
}

export function DataModal({ isOpen, onClose, item }: DataModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    status: "",
    date: "",
    amount: "",
  })

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id || "",
        name: item.name || "",
        status: item.status || "",
        date: item.date || "",
        amount: item.amount ? item.amount.toString() : "",
      })
    }
  }, [item])

  if (!isOpen) return null

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save the data here
    console.log("Saving data:", formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">항목 편집</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">ID</Label>
            <Input id="id" value={formData.id} onChange={(e) => handleChange("id", e.target.value)} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">상태</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="완료">완료</SelectItem>
                <SelectItem value="진행 중">진행 중</SelectItem>
                <SelectItem value="대기 중">대기 중</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">날짜</Label>
            <Input id="date" type="date" value={formData.date} onChange={(e) => handleChange("date", e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">금액</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              저장
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

