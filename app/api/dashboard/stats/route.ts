import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    const decodedToken = verifyJwtToken(token);
    if (!decodedToken) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }
    // @ts-expect-error DOEs not have time to fix this
    const userId = decodedToken.userId;
    const stats = await getUserTaskStats(userId);

    return NextResponse.json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        ...stats,
        percentCompleted: Number(stats.percentCompleted.toFixed(2)),
        percentPending: Number(stats.percentPending.toFixed(2)),
        averageCompletionTime: Number(stats.averageCompletionTime.toFixed(2)),
      },
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

async function getUserTaskStats(userId: string) {
  const totalTasks = await prisma.task.count({ where: { userId } });
  const completedTasks = await prisma.task.count({ where: { userId, status: "FINISHED" } });
  const pendingTasks = totalTasks - completedTasks;

  const completedTasksData = await prisma.task.findMany({
    where: { userId, status: "FINISHED" },
    select: { startTime: true, endTime: true },
  });

  const totalCompletionTime = completedTasksData.reduce((acc, task) => {
    const startTime = new Date(task.startTime).getTime();
    const endTime = new Date(task.endTime).getTime();
    return acc + (endTime - startTime);
  }, 0);

  const averageCompletionTime = completedTasks > 0 ? totalCompletionTime / completedTasks / (1000 * 60 * 60) : 0;

  const percentCompleted = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const percentPending = 100 - percentCompleted;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    percentCompleted,
    percentPending,
    averageCompletionTime,
  };
}