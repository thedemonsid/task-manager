import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";
import { Priority } from "@prisma/client";
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("DELETE request received");
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      console.log("No token provided");
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decodedToken = verifyJwtToken(token);
    if (!decodedToken) {
      console.log("Invalid token");
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    // @ts-expect-error DOEs not have time to fix this
    const userId = decodedToken.userId;
    if (!userId) {
      console.log("Invalid token: no userId");
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { id } = await params;
    console.log(`Task ID to delete: ${id}`);

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      console.log("Task not found");
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    if (task.userId !== userId) {
      console.log("Not authorized to delete this task");
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    await prisma.task.delete({ where: { id } });
    console.log("Task deleted successfully");
    return NextResponse.json(
      { success: true, message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete task",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("PUT request received");
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      console.log("No token provided");
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decodedToken = verifyJwtToken(token);
    if (!decodedToken) {
      console.log("Invalid token");
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    // @ts-expect-error DOEs not have time to fix this
    const userId = decodedToken.userId;
    if (!userId) {
      console.log("Invalid token: no userId");
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { id } = await params;
    console.log(`Task ID to update: ${id}`);

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      console.log("Task not found");
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    if (task.userId !== userId) {
      console.log("Not authorized to update this task");
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    const { status } = await request.json();
    console.log(`New status: ${status}`);

    if (status === "FINISHED") {
      await prisma.task.update({
        where: { id },
        data: { status, endTime: new Date() },
      });
    } else if (status === "PENDING") {
      await prisma.task.update({
        where: { id },
        data: {
          status,
          endTime: new Date(new Date().setDate(new Date().getDate() + 1)),
        },
      });
    } else {
      console.log("Invalid status");
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    console.log("Task updated successfully");
    return NextResponse.json(
      { success: true, message: "Task updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update task",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Updtate the tasks using put method with id and body with new data
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("PUT request received");
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      console.log("No token provided");
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decodedToken = verifyJwtToken(token);
    if (!decodedToken) {
      console.log("Invalid token");
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
    // @ts-expect-error  DOEs not have time to fix this
    const userId = decodedToken.userId;
    if (!userId) {
      console.log("Invalid token: no userId");
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const { id } = await params;
    console.log(`Task ID to update: ${id}`);

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      console.log("Task not found");
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    if (task.userId !== userId) {
      console.log("Not authorized to update this task");
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    const { title, startTime, endTime, priority, status } =
      await request.json();
    console.log(`New title: ${title}`);
    console.log(`New startTime: ${startTime}`);
    console.log(`New endTime: ${endTime}`);
    console.log(`New priority: ${priority}`);
    console.log(`New status: ${status}`);

    const priorityEnum = priority.toUpperCase();
    if (!Object.values(Priority).includes(priorityEnum)) {
      console.log("Invalid priority");
      return NextResponse.json(
        { success: false, message: "Invalid priority" },
        { status: 400 }
      );
    }

    if (!["PENDING", "FINISHED"].includes(status)) {
      console.log("Invalid status");
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    await prisma.task.update({
      where: { id },
      data: { title, startTime, endTime, priority: priorityEnum, status },
    });

    console.log("Task updated successfully");
    return NextResponse.json(
      { success: true, message: "Task updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update task",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
