import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decodedToken = verifyJwtToken(token);
    if (!decodedToken) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    // @ts-ignore
    const userId = decodedToken.userId;
    const stats = await getUserTaskStats(userId);

    const priorityStats = Object.entries(stats.pendingTasksMetrics).map(
      ([priority, metrics]) => {
        return {
          priority,
          pendingCount: metrics.count,
          averageTimeLapsed:
            metrics.count > 0
              ? Number((metrics.timeLapsed / metrics.count).toFixed(2))
              : 0,
          averageTimeRemaining:
            metrics.count > 0
              ? Number((metrics.timeRemaining / metrics.count).toFixed(2))
              : 0,
          totalTimeLapsed: Number(metrics.timeLapsed.toFixed(2)),
          totalTimeRemaining: Number(metrics.timeRemaining.toFixed(2)),
        };
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Priority statistics fetched successfully",
        data: {
          totalTasks: stats.totalTasks,
          completedTasks: stats.completedTasks,
          pendingTasks: stats.pendingTasks,
          priorityStats,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch priority statistics",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

async function getUserTaskStats(userId: string) {
  const totalTasks = await prisma.task.count({ where: { userId } });
  const completedTasks = await prisma.task.count({
    where: { userId, status: "FINISHED" },
  });
  const pendingTasks = totalTasks - completedTasks;

  const pendingTasksData = await prisma.task.findMany({
    where: { userId, status: "PENDING" },
    select: { priority: true, startTime: true, endTime: true },
  });

  const pendingTasksMetrics = pendingTasksData.reduce((acc, task) => {
    const priority = task.priority;
    const startTime = new Date(task.startTime).getTime();
    const endTime = new Date(task.endTime).getTime();
    const currentTime = new Date().getTime();
    const timeLapsed = Math.max(0, currentTime - startTime);
    const timeRemaining = Math.max(0, endTime - currentTime);

    if (!acc[priority]) {
      acc[priority] = { count: 0, timeLapsed: 0, timeRemaining: 0 };
    }

    acc[priority].count++;
    acc[priority].timeLapsed += timeLapsed;
    acc[priority].timeRemaining += timeRemaining;

    return acc;
  }, {} as Record<string, { count: number; timeLapsed: number; timeRemaining: number }>);

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    pendingTasksMetrics,
  };
}
