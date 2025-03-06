import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export const CHART_COLORS = ["#3b82f6", "#f97316", "#10b981", "#f59e0b"];

interface TimeRemainingCardProps {
  priorityStats: PriorityStats | null;
}

export default function TimeRemainingCard({
  priorityStats,
}: TimeRemainingCardProps) {
  const timeRemainingData =
    priorityStats?.priorityStats.map((stat) => ({
      name: stat.priority,
      value: Math.round(stat.averageTimeRemaining / (1000 * 60 * 60)), // Convert to hours
    })) || [];

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl">
            Average Time Remaining by Priority
          </CardTitle>
          <CardDescription>Hours remaining for pending tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeRemainingData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Hours Remaining">
                  {timeRemainingData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
