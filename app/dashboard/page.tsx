"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Types for API responses
type DashboardStats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  percentCompleted: number;
  percentPending: number;
  averageCompletionTime: number;
};

type PriorityMetric = {
  priority: string;
  pendingCount: number;
  averageTimeLapsed: number;
  averageTimeRemaining: number;
  totalTimeLapsed: number;
  totalTimeRemaining: number;
};

type PriorityStats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  priorityStats: PriorityMetric[];
};

type CompletionTimeStats = {
  averageCompletionTimeHours: number;
  completedTaskCount: number;
  pendingTaskCount: number;
  averageCompletionTimeMinutes: number;
  averageCompletionTimeDays: number;
};

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for API data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [priorityStats, setPriorityStats] = useState<PriorityStats | null>(
    null
  );
  const [completionTimeStats, setCompletionTimeStats] =
    useState<CompletionTimeStats | null>(null);

  // Priority colors for charts
  const priorityColors = {
    LOW: "#94a3b8", // slate-400
    MEDIUM: "#60a5fa", // blue-400
    HIGH: "#4ade80", // green-400
    URGENT: "#fb923c", // orange-400
    CRITICAL: "#f87171", // red-400
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        if (!token) {
          router.push("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Fetch all dashboard data in parallel
        const [statsResponse, priorityResponse, completionResponse] =
          await Promise.all([
            axios.get("http://localhost:8080/api/dashboard/stats", { headers }),
            axios.get("http://localhost:8080/api/dashboard/priority", {
              headers,
            }),
            axios.get("http://localhost:8080/api/dashboard/completion-time", {
              headers,
            }),
          ]);

        setDashboardStats(statsResponse.data);
        setPriorityStats(priorityResponse.data);
        setCompletionTimeStats(completionResponse.data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(
          err.response?.data?.error ||
            "An error occurred while fetching dashboard data"
        );

        if (err.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // Prepare data for pie chart
  const pieChartData = dashboardStats
    ? [
        { name: "Completed", value: dashboardStats.completedTasks },
        { name: "Pending", value: dashboardStats.pendingTasks },
      ]
    : [];

  // Format time to human readable hours
  const formatHours = (hours: number) => {
    if (hours === 0) return "0 hours";
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours === 1) return "1 hour";
    return `${hours.toFixed(1)} hours`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-[120px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[80px] mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-zinc-900">
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-[250px] rounded-full" />
            </CardContent>
          </Card>
          <Card className="bg-zinc-900">
            <CardHeader>
              <Skeleton className="h-6 w-[180px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <button
              onClick={() => router.push("/tasks")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Go to Tasks
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-zinc-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardStats?.totalTasks || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {dashboardStats?.completedTasks || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {dashboardStats?.pendingTasks || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Completion Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatHours(
                completionTimeStats?.averageCompletionTimeHours || 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6 bg-zinc-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="priority">Priority Analysis</TabsTrigger>
          <TabsTrigger value="completion">Time Analysis</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Distribution Pie Chart */}
            <Card className="bg-zinc-900">
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      dataKey="value"
                    >
                      <Cell fill="#4ade80" /> {/* Green for completed */}
                      <Cell fill="#fb923c" /> {/* Orange for pending */}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(value) => [`${value} tasks`]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Task Completion Progress */}
            <Card className="bg-zinc-900">
              <CardHeader>
                <CardTitle>Task Completion Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">
                      Overall Completion
                    </div>
                    <div className="text-sm font-medium">
                      {dashboardStats?.percentCompleted.toFixed(0)}%
                    </div>
                  </div>
                  <Progress
                    value={dashboardStats?.percentCompleted || 0}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium mb-3">Task Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800/40 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">
                        Completed
                      </div>
                      <div className="text-xl font-bold text-green-500 mt-1">
                        {dashboardStats?.percentCompleted.toFixed(0)}%
                      </div>
                    </div>
                    <div className="bg-zinc-800/40 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">
                        Pending
                      </div>
                      <div className="text-xl font-bold text-orange-500 mt-1">
                        {dashboardStats?.percentPending.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Average Time Stats */}
                <div>
                  <h4 className="font-medium mb-3">Time Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800/40 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">
                        In Minutes
                      </div>
                      <div className="text-xl font-bold mt-1">
                        {Math.round(
                          completionTimeStats?.averageCompletionTimeMinutes || 0
                        )}
                      </div>
                    </div>
                    <div className="bg-zinc-800/40 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">
                        In Days
                      </div>
                      <div className="text-xl font-bold mt-1">
                        {(
                          completionTimeStats?.averageCompletionTimeDays || 0
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Priority Analysis Tab */}
        <TabsContent value="priority" className="space-y-6">
          <Card className="bg-zinc-900">
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityStats?.priorityStats || []}>
                  <XAxis dataKey="priority" />
                  <YAxis
                    label={{
                      value: "Hours",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value: any) => [
                      `${parseFloat(value).toFixed(2)} hours`,
                    ]}
                    labelFormatter={(label) => `Priority: ${label}`}
                  />
                  <Legend />
                  <Bar
                    name="Time Lapsed"
                    dataKey="totalTimeLapsed"
                    fill="#fb923c"
                  >
                    {priorityStats?.priorityStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          priorityColors[
                            entry.priority as keyof typeof priorityColors
                          ] || "#fb923c"
                        }
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                  <Bar
                    name="Time Remaining"
                    dataKey="totalTimeRemaining"
                    fill="#60a5fa"
                  >
                    {priorityStats?.priorityStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          priorityColors[
                            entry.priority as keyof typeof priorityColors
                          ] || "#60a5fa"
                        }
                        fillOpacity={0.4}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Priority Metrics Detailed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priorityStats?.priorityStats.map((stat, index) => (
              <Card key={index} className="bg-zinc-900">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor:
                          priorityColors[
                            stat.priority as keyof typeof priorityColors
                          ],
                      }}
                    />
                    <CardTitle className="text-base">
                      {stat.priority} Priority
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pending Tasks</span>
                    <span>{stat.pendingCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time Lapsed</span>
                    <span>{formatHours(stat.totalTimeLapsed)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Time Remaining
                    </span>
                    <span>{formatHours(stat.totalTimeRemaining)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Average Time Lapsed
                    </span>
                    <span>{formatHours(stat.averageTimeLapsed)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Time Analysis Tab */}
        <TabsContent value="completion" className="space-y-6">
          <Card className="bg-zinc-900">
            <CardHeader>
              <CardTitle>Task Completion Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-800/40 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    Average Completion Time
                  </div>
                  <div className="text-xl font-bold">
                    {formatHours(
                      completionTimeStats?.averageCompletionTimeHours || 0
                    )}
                  </div>
                </div>

                <div className="bg-zinc-800/40 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    In Minutes
                  </div>
                  <div className="text-xl font-bold">
                    {Math.round(
                      completionTimeStats?.averageCompletionTimeMinutes || 0
                    )}{" "}
                    mins
                  </div>
                </div>

                <div className="bg-zinc-800/40 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    In Days
                  </div>
                  <div className="text-xl font-bold">
                    {(
                      completionTimeStats?.averageCompletionTimeDays || 0
                    ).toFixed(2)}{" "}
                    days
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/20 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">
                  Task Completion Efficiency
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        Completed Tasks
                      </span>
                      <span className="text-sm">
                        {completionTimeStats?.completedTaskCount || 0} tasks
                      </span>
                    </div>
                    <Progress
                      value={
                        dashboardStats?.totalTasks
                          ? ((completionTimeStats?.completedTaskCount || 0) /
                              dashboardStats.totalTasks) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        Pending Tasks
                      </span>
                      <span className="text-sm">
                        {completionTimeStats?.pendingTaskCount || 0} tasks
                      </span>
                    </div>
                    <Progress
                      value={
                        dashboardStats?.totalTasks
                          ? ((completionTimeStats?.pendingTaskCount || 0) /
                              dashboardStats.totalTasks) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
