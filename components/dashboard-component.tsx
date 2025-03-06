"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

import StatsCards from "@/components/dashboard/stats-cards";
import CompletionProgressCard from "@/components/dashboard/cp-card";
import PriorityDistributionCard from "@/components/dashboard/pd-card";
import TimeRemainingCard from "@/components/dashboard/time-remaining-card";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import AuthRequiredCard from "@/components/dashboard/auth-required-card";

// Type definitions

const DashboardComponent = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [priorityStats, setPriorityStats] = useState<PriorityStats | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Safe localStorage access after component mounts
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setAuthToken(token);
  }, []);

  // Data fetching effect
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authToken) return;

      setIsLoading(true);
      setError(null);

      try {
        await Promise.all([fetchStats(), fetchPriorityStats()]);
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

    const fetchStats = async () => {
      const response = await fetch("/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await response.json();
      setStats(data.data);
    };

    const fetchPriorityStats = async () => {
      const response = await fetch("/api/dashboard/priority", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch priority stats");
      const data = await response.json();
      setPriorityStats(data.data);
    };

    fetchDashboardData();
  }, [authToken]);

  // Auth check
  if (!authToken) {
    return <AuthRequiredCard />;
  }

  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Error state
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

  return (
    <div className="container mx-auto p-4 space-y-8 max-w-6xl">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-400">
          Welcome back! Here&apos;s an overview of your tasks.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Progress Card */}
        <CompletionProgressCard stats={stats} />

        {/* Priority Distribution Card */}
        <PriorityDistributionCard priorityStats={priorityStats} />
      </div>

      {/* Time Remaining Card */}
      <TimeRemainingCard priorityStats={priorityStats} />

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

export default DashboardComponent;
