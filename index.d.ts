// Updated type definitions to match Prisma schema
type TaskStatus = "PENDING" | "FINISHED";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT" | "CRITICAL";

// Updated type name from TODO to Task
type Task = {
  id: number | string;
  text: string;
  checked: boolean;
  time: string;
  startTime: string;
  endTime: string;
  priority: TaskPriority;
  status: TaskStatus;
};
