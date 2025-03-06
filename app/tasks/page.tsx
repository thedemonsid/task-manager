/* eslint-disable */
"use client";
import React, { useEffect, useState, JSX } from "react";
import { FiFilter, FiArrowUp, FiArrowDown } from "react-icons/fi";
import axios from "axios";
import { Tasks } from "@/components/tasks";
import { Form } from "@/components/task-form";
import { Header } from "@/components/task-header";

// Map numeric values back to priority enum
const numberToPriority = {
  1: "LOW",
  2: "MEDIUM",
  3: "HIGH",
  4: "URGENT",
  5: "CRITICAL",
} as const;

export default function TaskManager(): JSX.Element {
  // Rename state variables
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | TaskStatus>("all");
  const [sortBy, setSortBy] = useState<"startTime" | "endTime" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get("/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Transform the backend data to match our Task type
        const transformedTasks: Task[] = response.data.tasks.map(
          (task: any) => ({
            id: task.id,
            text: task.title,
            checked: task.status === "FINISHED",
            time: calculateTimeDisplay(task.startTime, task.endTime),
            startTime: task.startTime,
            endTime: task.endTime,
            priority: task.priority,
            status: task.status,
          })
        );

        setTasks(transformedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // Apply filters and sorting whenever tasks change or filters change
  useEffect(() => {
    let result = [...tasks];

    // Apply priority filter using the enum mapping
    if (priorityFilter !== null) {
      const priorityEnum =
        numberToPriority[priorityFilter as keyof typeof numberToPriority];
      result = result.filter((task) => task.priority === priorityEnum);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Apply sorting
    if (sortBy) {
      result.sort((a, b) => {
        const dateA = new Date(a[sortBy]);
        const dateB = new Date(b[sortBy]);

        if (sortDirection === "asc") {
          return dateA.getTime() - dateB.getTime();
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      });
    }

    setFilteredTasks(result);
  }, [tasks, priorityFilter, statusFilter, sortBy, sortDirection]);

  // Helper function to calculate time display
  const calculateTimeDisplay = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);

    if (diffHrs < 1) {
      return `${Math.round(diffHrs * 60)} mins`;
    }
    return `${Math.round(diffHrs)} hrs`;
  };

  const handleCheck = async (id: number | string) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      // Determine if we're completing or un-completing the task
      const isCompleting = task.status === "PENDING";
      const newStatus = isCompleting ? "FINISHED" : "PENDING";
      const endTime = isCompleting ? new Date().toISOString() : task.endTime;

      // Get the authentication token
      const token = localStorage.getItem("authToken");

      if (isCompleting) {
        await axios.patch(
          `/api/tasks/${id}`,
          {
            status: "FINISHED",
            endTime,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // If un-completing the task, use the regular update endpoint
        await axios.patch(
          `/api/tasks/${id}`,
          {
            status: "PENDING",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Update frontend state
      setTasks(
        tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                status: newStatus,
                checked: newStatus === "FINISHED",
                endTime,
                time: calculateTimeDisplay(t.startTime, endTime),
              }
            : t
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const removeElement = async (id: number | string) => {
    try {
      // Delete from backend
      const token = localStorage.getItem("authToken");
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update frontend state
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-xl md:max-w-3xl px-4 pt-4">
        <Header />

        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <div className="bg-zinc-800/80 p-2 rounded-md flex items-center gap-2">
            <FiFilter className="text-zinc-400" />
            <select
              className="bg-zinc-700 text-white rounded px-2 py-1 text-sm"
              value={
                priorityFilter === null ? "all" : priorityFilter.toString()
              }
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value === "all" ? null : Number(e.target.value)
                )
              }
            >
              <option value="all">All Priorities</option>
              <option value="1">1 - LOW</option>
              <option value="2">2 - MEDIUM</option>
              <option value="3">3 - HIGH</option>
              <option value="4">4 - URGENT</option>
              <option value="5">5 - CRITICAL</option>
            </select>
          </div>

          <div className="bg-zinc-800/80 p-2 rounded-md flex items-center gap-2">
            <FiFilter className="text-zinc-400" />
            <select
              className="bg-zinc-700 text-white rounded px-2 py-1 text-sm"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | TaskStatus)
              }
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="FINISHED">Finished</option>
            </select>
          </div>

          <div className="bg-zinc-800/80 p-2 rounded-md flex items-center gap-2">
            <select
              className="bg-zinc-700 text-white rounded px-2 py-1 text-sm"
              value={sortBy || "none"}
              onChange={(e) => {
                const value = e.target.value;
                setSortBy(
                  value === "none" ? null : (value as "startTime" | "endTime")
                );
              }}
            >
              <option value="none">Sort by</option>
              <option value="startTime">Start Time</option>
              <option value="endTime">End Time</option>
            </select>
            <button
              onClick={() =>
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              className="bg-zinc-700 text-white rounded p-1"
            >
              {sortDirection === "asc" ? <FiArrowUp /> : <FiArrowDown />}
            </button>
          </div>
        </div>

        <Tasks
          removeElement={removeElement}
          tasks={filteredTasks} // This prop name could also be changed to tasks
          handleCheck={handleCheck}
        />
      </div>
      <Form setTasks={setTasks} priorityMapping={numberToPriority} />
    </>
  );
}
