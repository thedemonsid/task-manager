import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      value: Math.round(stat.averageTimeRemaining / (1000 * 60 * 60)),
    })) || [];

  const maxValue = Math.max(...timeRemainingData.map((item) => item.value), 1);
  const yAxisMax = Math.max(Math.ceil(maxValue * 1.2), 10);

  const formatHours = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    } else if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }
    return `${hours} hours`;
  };

  //* Custom tooltip
  interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900 p-2 border border-zinc-700 rounded shadow-lg">
          <p className="font-medium">{`${label} Priority`}</p>
          <p className="text-indigo-400">{`Average Time: ${formatHours(
            payload[0].value
          )}`}</p>
        </div>
      );
    }
    return null;
  };

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
          <Tabs defaultValue="bar" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>

            <TabsContent value="bar">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeRemainingData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#a1a1aa" }}
                      tickLine={{ stroke: "#a1a1aa" }}
                    />
                    <YAxis
                      domain={[0, yAxisMax]}
                      tick={{ fill: "#a1a1aa" }}
                      tickLine={{ stroke: "#a1a1aa" }}
                      label={{
                        value: "Hours",
                        angle: -90,
                        position: "insideLeft",
                        style: { fill: "#a1a1aa" },
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={0} stroke="#a1a1aa" />
                    <Bar dataKey="value" name="Hours Remaining" maxBarSize={50}>
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
            </TabsContent>

            <TabsContent value="table">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="text-left py-3 px-4">Priority</th>
                      <th className="text-right py-3 px-4">
                        Average Time Remaining
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeRemainingData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-zinc-800 hover:bg-zinc-800/50"
                      >
                        <td className="py-3 px-4 flex items-center">
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{
                              backgroundColor:
                                CHART_COLORS[index % CHART_COLORS.length],
                            }}
                          ></span>
                          {item.name}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {formatHours(item.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-zinc-400 mt-4">
            *Time values are averages across all pending tasks with the given
            priority.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
