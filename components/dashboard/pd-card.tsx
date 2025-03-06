import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const CHART_COLORS = ["#3b82f6", "#f97316", "#10b981", "#f59e0b"];
interface PriorityDistributionCardProps {
  priorityStats: PriorityStats | null;
}

export default function PriorityDistributionCard({
  priorityStats,
}: PriorityDistributionCardProps) {
  const priorityChartData =
    priorityStats?.priorityStats.map((stat) => ({
      name: stat.priority,
      value: stat.pendingCount,
    })) || [];

  return (
    <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Tasks by Priority</CardTitle>
        <CardDescription>Distribution of pending tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <TabsContent value="chart">
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[index % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="list">
              <div className="space-y-2">
                {priorityStats?.priorityStats.map((stat, i) => (
                  <div
                    key={stat.priority}
                    className="flex items-center justify-between p-2 rounded-md bg-zinc-800"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      ></div>
                      <span className="capitalize">
                        {stat.priority.toLowerCase()}
                      </span>
                    </div>
                    <div className="font-medium">{stat.pendingCount} tasks</div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
