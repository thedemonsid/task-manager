import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJwtToken } from "@/lib/auth";
import { Priority } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

const TaskCreateSchema = z
  .object({
    title: z
      .string({
        required_error: "Task title is required",
        invalid_type_error: "Task title must be a string",
      })
      .min(2, "Task title must be at least 2 characters long"),
    description: z
      .string({
        invalid_type_error: "Description must be a string",
      })
      .optional(),
    startTime: z
      .string({
        required_error: "Start time is required",
        invalid_type_error: "Start time must be a valid date string",
      })
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "Start time must be a valid date format",
      }),
    endTime: z
      .string({
        required_error: "End time is required",
        invalid_type_error: "End time must be a valid date string",
      })
      .refine((val) => !isNaN(new Date(val).getTime()), {
        message: "End time must be a valid date format",
      }),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT", "CRITICAL"], {
      required_error: "Priority is required",
      invalid_type_error:
        "Priority must be one of: LOW, MEDIUM, HIGH, URGENT, CRITICAL",
    }),
  })
  .refine(
    (data) => {
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);
      return endTime > startTime;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

const TaskUpdateSchema = z.object({
  title: z
    .string({
      invalid_type_error: "Task title must be a string",
    })
    .min(2, "Task title must be at least 2 characters long")
    .optional(),
  description: z
    .string({
      invalid_type_error: "Description must be a string",
    })
    .optional(),
  startTime: z
    .string({
      invalid_type_error: "Start time must be a valid date string",
    })
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Start time must be a valid date format",
    })
    .optional(),
  endTime: z
    .string({
      invalid_type_error: "End time must be a valid date string",
    })
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "End time must be a valid date format",
    })
    .optional(),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT", "CRITICAL"], {
      invalid_type_error:
        "Priority must be one of: LOW, MEDIUM, HIGH, URGENT, CRITICAL",
    })
    .optional(),
  status: z
    .enum(["PENDING", "FINISHED"], {
      invalid_type_error: "Status must be either PENDING or FINISHED",
    })
    .optional(),
});

const TaskQuerySchema = z.object({
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT", "CRITICAL"]).optional(),
  status: z.enum(["PENDING", "FINISHED"]).optional(),
  sortBy: z.enum(["startTime", "endTime"]).optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
});

export async function POST(request: NextRequest) {
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

    const userId = (decodedToken as JwtPayload).userId;
    const body = await request.json();
    const validationResult = TaskCreateSchema.safeParse(body);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const { title, description, startTime, endTime, priority } =
      validationResult.data;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        priority: priority as Priority,
        userId,
      },
    });

    return NextResponse.json(
      { success: true, message: "Task created successfully", task },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create task",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

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

    const userId = (decodedToken as JwtPayload).userId;
    const query = Object.fromEntries(request.nextUrl.searchParams.entries());
    const validationResult = TaskQuerySchema.safeParse(query);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      return NextResponse.json(
        {
          success: false,
          message: "Invalid query parameters",
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const { priority, status, sortBy, sortDir } = validationResult.data;

    const filters: { priority?: Priority; status?: "PENDING" | "FINISHED" } =
      {};
    if (priority) filters.priority = priority as Priority;
    if (status) filters.status = status as "PENDING" | "FINISHED";

    const sort = sortBy
      ? {
          [sortBy]: sortDir || "asc",
        }
      : undefined;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        ...filters,
      },
      orderBy: sort,
    });

    return NextResponse.json(
      { success: true, message: "Tasks fetched successfully", tasks },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tasks",
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

    const userId = (decodedToken as JwtPayload).userId;
    const body = await request.json();
    const validationResult = TaskUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const { id } = await params;
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    if (task.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    if (validationResult.data.startTime && validationResult.data.endTime) {
      const startTime = new Date(validationResult.data.startTime);
      const endTime = new Date(validationResult.data.endTime);

      if (endTime <= startTime) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            details: { endTime: ["End time must be after start time"] },
          },
          { status: 400 }
        );
      }
    }

    const updateData = { ...validationResult.data };
    if (updateData.startTime)
      updateData.startTime = new Date(updateData.startTime).toISOString();
    if (updateData.endTime)
      updateData.endTime = new Date(updateData.endTime).toISOString();

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Task updated successfully",
        task: updatedTask,
      },
      { status: 200 }
    );
  } catch (error) {
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const userId = (decodedToken as JwtPayload).userId;
    const { id } = await params;
    const task = await prisma.task.findUnique({ where: { id } });

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    if (task.userId !== userId) {
      return NextResponse.json(
        { success: false, message: "Not authorized" },
        { status: 403 }
      );
    }

    await prisma.task.delete({ where: { id } });
    return NextResponse.json(
      { success: true, message: "Task deleted successfully" },
      { status: 204 }
    );
  } catch (error) {
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
