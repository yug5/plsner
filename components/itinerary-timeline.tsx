import type React from "react"
interface Activity {
  time: string
  title: string
  description: string
  type: string
}

interface Day {
  day: number
  activities: Activity[]
}

interface ItineraryTimelineProps {
  days: Day[]
  getActivityIcon: (type: string) => React.ReactNode
}

export function ItineraryTimeline({ days, getActivityIcon }: ItineraryTimelineProps) {
  return (
    <div className="space-y-8">
      {days.map((day) => (
        <div key={day.day} className="space-y-4">
          <h3 className="text-xl font-bold">Day {day.day}</h3>
          <div className="space-y-4">
            {day.activities.map((activity, index) => (
              <div key={index} className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    {getActivityIcon(activity.type)}
                  </div>
                  {index < day.activities.length - 1 && <div className="h-full w-0.5 bg-border" />}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-muted-foreground">{activity.time}</div>
                  </div>
                  <h4 className="text-base font-semibold">{activity.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

