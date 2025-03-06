"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  ArrowRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";

type DashboardStats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  percentCompleted: number;
  percentPending: number;
  averageCompletionTime: number;
};

type CompletionTimeStats = {
  averageCompletionTimeHours: number;
  completedTaskCount: number;
  pendingTaskCount: number;
  averageCompletionTimeMinutes: number;
  averageCompletionTimeDays: number;
};

type PriorityStats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  priorityStats: {
    priority: string;
    pendingCount: number;
    averageTimeLapsed: number;
    averageTimeRemaining: number;
    totalTimeLapsed: number;
    totalTimeRemaining: number;
  }[];
};

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [completionStats, setCompletionStats] =
    useState<CompletionTimeStats | null>(null);
  const [priorityStats, setPriorityStats] = useState<PriorityStats | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authToken = localStorage.getItem("authToken");
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authToken) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch general stats
        const statsResponse = await fetch("/api/dashboard/stats", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!statsResponse.ok)
          throw new Error("Failed to fetch dashboard stats");
        const statsData = await statsResponse.json();
        setStats(statsData.data);

        // Fetch completion time stats
        const completionResponse = await fetch(
          "/api/dashboard/completion-time",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (!completionResponse.ok)
          throw new Error("Failed to fetch completion time stats");
        const completionData = await completionResponse.json();
        setCompletionStats(completionData.data);

        // Fetch priority stats
        const priorityResponse = await fetch("/api/dashboard/priority", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!priorityResponse.ok)
          throw new Error("Failed to fetch priority stats");
        const priorityData = await priorityResponse.json();
        setPriorityStats(priorityData.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching dashboard data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [authToken]);

  if (!authToken) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Sign In Required</CardTitle>
            <CardDescription className="text-center">
              Please sign in to view your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/login">
              <Button>Go to Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="my-4 px-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#f97316", "#10b981", "#f59e0b"];

  const priorityChartData =
    priorityStats?.priorityStats.map((stat) => ({
      name: stat.priority,
      value: stat.pendingCount,
    })) || [];

  const timeRemainingData =
    priorityStats?.priorityStats.map((stat) => ({
      name: stat.priority,
      value: Math.round(stat.averageTimeRemaining / (1000 * 60 * 60)), // Convert to hours
    })) || [];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-400">
          Welcome back, {localStorage.userEmail}! Here's an overview of your
          tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-2xl">{stats?.totalTasks || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-zinc-400">
              <Activity className="mr-1 h-4 w-4" />
              All tasks in your system
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl text-green-500">
              {stats?.completedTasks || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-zinc-400">
              <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
              {stats?.percentCompleted || 0}% completion rate
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-2xl text-amber-500">
              {stats?.pendingTasks || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-zinc-400">
              <AlertTriangle className="mr-1 h-4 w-4 text-amber-500" />
              {stats?.percentPending || 0}% tasks pending
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardDescription>Avg. Completion Time</CardDescription>
            <CardTitle className="text-2xl">
              {stats?.averageCompletionTime.toFixed(1) || 0} hrs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-zinc-400">
              <Clock className="mr-1 h-4 w-4" />
              Per task on average
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <div className="text-sm font-medium text-amber-500">
                    Pending
                  </div>
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
                              fill={COLORS[index % COLORS.length]}
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
                              backgroundColor: COLORS[i % COLORS.length],
                            }}
                          ></div>
                          <span className="capitalize">
                            {stat.priority.toLowerCase()}
                          </span>
                        </div>
                        <div className="font-medium">
                          {stat.pendingCount} tasks
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

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
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-8">
        <Link href="/tasks">
          <Button className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90">
            Manage Your Tasks
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

// Loading skeleton for the dashboard
const DashboardSkeleton = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Card
              key={i}
              className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm"
            >
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-[240px] w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
