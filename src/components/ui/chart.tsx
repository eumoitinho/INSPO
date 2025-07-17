import * as React from "react"

interface ChartContainerProps {
  children: React.ReactNode
  className?: string
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ children, className = "", ...props }, ref) => (
    <div
      ref={ref}
      className={`w-full h-full ${className}`}
      {...props}
    >
      {children}
    </div>
  )
)
ChartContainer.displayName = "ChartContainer"

interface ChartTooltipContentProps {
  active?: boolean
  payload?: any[]
  label?: string
  formatter?: (value: any, name: string) => [string, string]
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ active, payload, label, formatter, className = "", ...props }, ref) => {
    if (!active || !payload || !payload.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={`bg-background border rounded-lg shadow-lg p-3 ${className}`}
        {...props}
      >
        <div className="text-sm font-medium">{label}</div>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">
              {formatter ? formatter(entry.value, entry.name)[0] : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export {
  ChartContainer,
  ChartTooltipContent,
} 