import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";
import { Priority, TaskStatus } from "@prisma/client";
import { z } from "zod";

const taskUpdateSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    startTime: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid start time format",
    }),
    endTime: z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid end time format",
    }),
    priority: z.nativeEnum(Priority, {
      errorMap: () => ({ message: "Invalid priority value" }),
    }),
    status: z.nativeEnum(TaskStatus, {
      errorMap: () => ({ message: "Invalid status value" }),
    }),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startTime);
      const endDate = new Date(data.endTime);
      return startDate < endDate;
    },
    {
      message: "Start time must be before end time",
      path: ["startTime"], // Attach the error to the startTime field
    }
  );
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

    // @ts-expect-error DOEs not have time to fix this
    const userId = decodedToken.userId;
    if (!userId) {
      console.log("Invalid token: no userId");
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Get and validate task ID
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

    const requestBody = await request.json();
    const validationResult = taskUpdateSchema.safeParse(requestBody);

    if (!validationResult.success) {
      const errors = validationResult.error.format();
      console.log("Validation errors:", errors);
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { title, startTime, endTime, priority, status } =
      validationResult.data;

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        priority,
        status,
      },
    });

    console.log("Task updated successfully");
    return NextResponse.json(
      {
        success: true,
        message: "Task updated successfully",
        task: updatedTask,
      },
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
