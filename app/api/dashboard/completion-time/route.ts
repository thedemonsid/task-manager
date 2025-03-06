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
    // @ts-expect-error DOEs not have time to fix this
    const userId = decodedToken.userId;
    const stats = await getUserTaskStats(userId);

    return NextResponse.json(
      {
        success: true,
        message: "Completion time statistics fetched successfully",
        data: {
          averageCompletionTimeHours: Number(
            stats.averageCompletionTime.toFixed(2)
          ),
          completedTaskCount: stats.completedTasks,
          pendingTaskCount: stats.pendingTasks,
          averageCompletionTimeMinutes: Number(
            (stats.averageCompletionTime * 60).toFixed(2)
          ),
          averageCompletionTimeDays: Number(
            (stats.averageCompletionTime / 24).toFixed(2)
          ),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch completion time statistics",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

async function getUserTaskStats(userId: string) {
  const completedTasks = await prisma.task.count({
    where: { userId, status: "FINISHED" },
  });
  const pendingTasks = await prisma.task.count({
    where: { userId, status: "PENDING" },
  });

  const completedTasksData = await prisma.task.findMany({
    where: { userId, status: "FINISHED" },
    select: { startTime: true, endTime: true },
  });

  const totalCompletionTime = completedTasksData.reduce((acc, task) => {
    const startTime = new Date(task.startTime).getTime();
    const endTime = new Date(task.endTime).getTime();
    return acc + (endTime - startTime);
  }, 0);

  const averageCompletionTime =
    completedTasks > 0
      ? totalCompletionTime / completedTasks / (1000 * 60 * 60)
      : 0;

  return {
    completedTasks,
    pendingTasks,
    averageCompletionTime,
  };
}
