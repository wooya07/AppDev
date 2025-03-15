import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { mockWeeklyAttendanceData } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    // 세션 확인 (인증된 사용자만 접근 가능)
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // URL 파라미터에서 학생 ID 가져오기
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    // 목업 데이터 반환 (실제 환경에서는 백엔드 API 호출)
    return NextResponse.json(mockWeeklyAttendanceData)
  } catch (error) {
    console.error("Error fetching weekly attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

