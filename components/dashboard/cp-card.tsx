import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CompletionProgressCardProps {
  stats: DashboardStats | null;
}

export default function CompletionProgressCard({
  stats,
}: CompletionProgressCardProps) {
  return (
    <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Task Completion Progress</CardTitle>
        <CardDescription>Total vs. Completed vs. Pending</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Progress</div>
              <div className="text-sm text-zinc-400">
                {stats?.percentCompleted || 0}%
              </div>
            </div>
            <Progress
              value={stats?.percentCompleted || 0}
              className="mt-2 h-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-green-500">
                Completed
              </div>
              <div className="text-2xl font-bold">
                {stats?.completedTasks || 0}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-amber-500">Pending</div>
              <div className="text-2xl font-bold">
                {stats?.pendingTasks || 0}
              </div>
            </div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Completed",
                      value: stats?.completedTasks || 0,
                    },
                    { name: "Pending", value: stats?.pendingTasks || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell key="completed" fill="#10b981" />
                  <Cell key="pending" fill="#f97316" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
