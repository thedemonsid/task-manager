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
