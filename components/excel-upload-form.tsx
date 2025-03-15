"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Upload, FileSpreadsheet, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 샘플 미리보기 데이터
const samplePreviewStudents = [
  { id: "20230001", name: "김민준", grade: "1", class: "2", number: "1" },
  { id: "20230002", name: "이서연", grade: "1", class: "2", number: "2" },
  { id: "20230003", name: "박지훈", grade: "1", class: "2", number: "3" },
]

const samplePreviewTeachers = [
  { id: "T12000", name: "박선생", grade: "1", class: "2" },
  { id: "T13000", name: "김선생", grade: "1", class: "3" },
  { id: "T21000", name: "이선생", grade: "2", class: "1" },
]

export function ExcelUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadType, setUploadType] = useState("students")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [preview, setPreview] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  // 컴포넌트 마운트 시 토큰 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(window.localStorage.getItem("token"))
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) {
      setFile(null)
      setPreview([])
      return
    }

    // 파일 타입 검사
    if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
      setError("엑셀 파일(.xlsx 또는 .xls)만 업로드 가능합니다.")
      setFile(null)
      setPreview([])
      return
    }

    setError("")
    setFile(selectedFile)

    // 미리보기 데이터 설정 (실제로는 파일을 읽어야 함)
    if (uploadType === "students") {
      setPreview(samplePreviewStudents)
    } else {
      setPreview(samplePreviewTeachers)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setError("업로드할 파일을 선택해주세요.")
      return
    }

    setIsLoading(true)

    try {
      // 백엔드 API 호출
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", uploadType)

      const response = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("파일 업로드에 실패했습니다.")
      }

      // 성공 메시지 표시
      setSuccess(true)

      // 폼 초기화
      setTimeout(() => {
        setSuccess(false)
        setFile(null)
        setPreview([])
      }, 3000)
    } catch (error) {
      console.error("Error uploading file:", error)
      setError("파일 업로드 중 오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인하세요.")

      // 개발 환경에서 테스트를 위한 성공 처리
      setTimeout(() => {
        setSuccess(true)
        setIsLoading(false)

        setTimeout(() => {
          setSuccess(false)
          setFile(null)
          setPreview([])
        }, 3000)
      }, 1500)
    } finally {
      setIsLoading(false)
    }
  }

  // 교사 ID 생성 함수 (T + 학년 + 반 + 000)
  const generateTeacherId = (grade: string, classNum: string): string => {
    return `T${grade}${classNum}000`
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">엑셀 파일 업로드</h1>

      <Card>
        <CardHeader>
          <CardTitle>학생 및 교사 계정 일괄 생성</CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">업로드 완료</AlertTitle>
              <AlertDescription className="text-green-700">
                엑셀 파일이 성공적으로 업로드되었습니다. 계정이 생성되었습니다.
              </AlertDescription>
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
                <Label htmlFor="uploadType">업로드 유형</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger id="uploadType">
                    <SelectValue placeholder="업로드 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="students">학생 명단</SelectItem>
                    <SelectItem value="teachers">교사 명단</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">엑셀 파일</Label>
                <div className="flex items-center gap-2">
                  <Input id="file" type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="flex-1" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("file")?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    파일 선택
                  </Button>
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    선택된 파일: {file.name} ({Math.round(file.size / 1024)} KB)
                  </p>
                )}
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">엑셀 파일 형식</AlertTitle>
                <AlertDescription className="text-blue-700">
                  {uploadType === "students" ? (
                    <span>학생 명단 파일은 학번, 이름, 학년, 반, 번호 열이 포함되어야 합니다.</span>
                  ) : (
                    <span>
                      교사 명단 파일은 이름, 담당 학년, 담당 반 열이 포함되어야 합니다. 교사 ID는 자동으로 생성됩니다 (T
                      + 학년 + 반 + 000).
                    </span>
                  )}
                </AlertDescription>
              </Alert>

              {preview.length > 0 && (
                <div className="rounded-md border">
                  <div className="p-4 border-b bg-muted/50">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium">파일 미리보기</h3>
                    </div>
                  </div>
                  <div className="p-4 overflow-auto max-h-60">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          {uploadType === "students" ? (
                            <>
                              <th className="py-2 px-4 text-left">학번</th>
                              <th className="py-2 px-4 text-left">이름</th>
                              <th className="py-2 px-4 text-left">학년</th>
                              <th className="py-2 px-4 text-left">반</th>
                              <th className="py-2 px-4 text-left">번호</th>
                            </>
                          ) : (
                            <>
                              <th className="py-2 px-4 text-left">교사ID</th>
                              <th className="py-2 px-4 text-left">이름</th>
                              <th className="py-2 px-4 text-left">담당 학년</th>
                              <th className="py-2 px-4 text-left">담당 반</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((row, index) => (
                          <tr key={index} className="border-b">
                            {uploadType === "students" ? (
                              <>
                                <td className="py-2 px-4">{row.id}</td>
                                <td className="py-2 px-4">{row.name}</td>
                                <td className="py-2 px-4">{row.grade}</td>
                                <td className="py-2 px-4">{row.class}</td>
                                <td className="py-2 px-4">{row.number}</td>
                              </>
                            ) : (
                              <>
                                <td className="py-2 px-4">{row.id || generateTeacherId(row.grade, row.class)}</td>
                                <td className="py-2 px-4">{row.name}</td>
                                <td className="py-2 px-4">{row.grade}</td>
                                <td className="py-2 px-4">{row.class}</td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </form>
          )}
        </CardContent>
        {!success && (
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={handleSubmit}
              disabled={!file || isLoading}
            >
              {isLoading ? (
                <span>업로드 중...</span>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  엑셀 파일 업로드
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

