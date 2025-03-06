import { Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatsCardsProps {
  stats: DashboardStats | null;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
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
  );
}
