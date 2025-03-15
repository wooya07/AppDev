import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export function DashboardStats() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">진행 상황</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">전체 진행률</span>
            <span className="text-sm font-medium">67%</span>
          </div>
          <Progress value={67} className="h-2 bg-accent" />
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="border border-accent">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">총 사용자</div>
                <div className="text-2xl font-bold">1,234</div>
              </CardContent>
            </Card>
            <Card className="border border-accent">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">신규 가입</div>
                <div className="text-2xl font-bold">56</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border border-accent">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">완료된 작업</div>
                <div className="text-2xl font-bold">89</div>
              </CardContent>
            </Card>
            <Card className="border border-accent">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">대기 중</div>
                <div className="text-2xl font-bold">23</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-white">상세 보기</Button>
      </CardContent>
    </Card>
  )
}

