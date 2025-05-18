import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TeachersLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <Skeleton className="h-4 w-72 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="rounded-md border">
            <div className="h-10 px-4 border-b flex items-center">
              <div className="grid grid-cols-7 w-full">
                {Array(7)
                  .fill(null)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-4 w-16" />
                  ))}
              </div>
            </div>

            {Array(5)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="h-16 px-4 border-b flex items-center">
                  <div className="grid grid-cols-7 w-full gap-4">
                    {Array(7)
                      .fill(null)
                      .map((_, j) => (
                        <Skeleton key={j} className="h-8 w-full" />
                      ))}
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-between mt-4">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
