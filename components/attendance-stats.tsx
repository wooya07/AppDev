import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export function AttendanceStats() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">출석 현황</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">전체 출석률</span>
            <span className="text-sm font-medium">91%</span>
          </div>
          <Progress value={91} className="h-2 bg-accent" />
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border border-accent">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">총 학생 수</div>
                <div className="text-2xl font-bold">32명</div>
              </CardContent>
            </Card>
            <Card className="border border-accent">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">오늘 출석</div>
                <div className="text-2xl font-bold">29명</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border border-accent">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">지각</div>
                <div className="text-2xl font-bold">2명</div>
              </CardContent>
            </Card>
            <Card className="border border-accent">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">결석</div>
                <div className="text-2xl font-bold">1명</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-white">상세 보기</Button>
      </CardContent>
    </Card>
  )
}

