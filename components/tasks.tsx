/* eslint-disable */

import { AnimatePresence, useAnimate, usePresence } from "framer-motion";
import { useEffect } from "react";
import { FiClock, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { format } from "date-fns";

const priorityColors = {
  LOW: "bg-zinc-500",
  MEDIUM: "bg-blue-500",
  HIGH: "bg-green-500",
  URGENT: "bg-orange-500",
  CRITICAL: "bg-red-500",
};

const Task = ({
  removeElement,
  handleCheck,
  id,
  children,
  checked,
  time,
  priority,
  startTime,
  endTime,
  status,
}: {
  removeElement: (id: number | string) => void;
  handleCheck: (id: number | string) => void;
  id: number | string;
  children: string;
  checked: boolean;
  time: string;
  priority: TaskPriority;
  startTime: string;
  endTime: string;
  status: TaskStatus;
}) => {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();

  // Format dates for display
  const formattedStartTime = format(new Date(startTime), "MMM d, h:mm a");
  const formattedEndTime = format(new Date(endTime), "MMM d, h:mm a");

  // Get color based on priority
  const priorityColor = priorityColors[priority] || "bg-zinc-500";

  useEffect(() => {
    if (!isPresent) {
      const exitAnimation = async () => {
        animate(
          "p",
          {
            color: checked ? "#6ee7b7" : "#fca5a5",
          },
          {
            ease: "easeIn",
            duration: 0.125,
          }
        );
        await animate(
          scope.current,
          {
            scale: 1.025,
          },
          {
            ease: "easeIn",
            duration: 0.125,
          }
        );

        await animate(
          scope.current,
          {
            opacity: 0,
            x: checked ? 24 : -24,
          },
          {
            delay: 0.75,
          }
        );
        safeToRemove();
      };

      exitAnimation();
    }
  }, [isPresent]);

  return (
    <motion.div
      ref={scope}
      layout
      className="relative flex flex-col w-full rounded border border-zinc-700 bg-zinc-900 p-3"
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => handleCheck(id)}
          className="size-4 accent-indigo-400"
        />

        <div
          className={`w-3 h-3 rounded-full ${priorityColor}`}
          title={`Priority: ${priority}`}
        />

        <p
          className={`text-white transition-colors ${
            checked && "text-zinc-400 line-through"
          }`}
        >
          {children}
        </p>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded bg-zinc-800 px-1.5 py-1 text-xs text-zinc-400">
            <FiClock />
            <span>{time}</span>
          </div>
          <button
            onClick={() => removeElement(id)}
            className="rounded bg-red-300/20 px-1.5 py-1 text-xs text-red-300 transition-colors hover:bg-red-600 hover:text-red-200"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      <div className="mt-2 text-xs text-zinc-500 grid grid-cols-2 gap-2">
        <div>
          <span className="font-medium">Start:</span> {formattedStartTime}
        </div>
        <div>
          <span className="font-medium">
            {status === "FINISHED" ? "Completed:" : "Estimated End:"}
          </span>{" "}
          {formattedEndTime}
        </div>
      </div>
    </motion.div>
  );
};

export const Tasks = ({
  tasks,
  handleCheck,
  removeElement,
}: {
  tasks: Task[];
  handleCheck: (id: number | string) => void;
  removeElement: (id: number | string) => void;
}) => {
  return (
    <div className="w-full space-y-3">
      <AnimatePresence>
        {tasks.map((t) => (
          <Task
            handleCheck={handleCheck}
            removeElement={removeElement}
            id={t.id}
            key={t.id}
            checked={t.checked}
            time={t.time}
            priority={t.priority}
            startTime={t.startTime}
            endTime={t.endTime}
            status={t.status}
          >
            {t.text}
          </Task>
        ))}
      </AnimatePresence>
    </div>
  );
};
