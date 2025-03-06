import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { log } from "node:console";

type FormProps = {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  priorityMapping: Record<number, TaskPriority>;
};

export const Form = ({ setTasks, priorityMapping }: FormProps) => {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState(2);

  const localDateTimeFormat = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  //* Using ISO string format for indian time zone , there was time gap of 5.30 hours
  const [startTime, setStartTime] = useState(localDateTimeFormat(new Date()));
  const [endTime, setEndTime] = useState(
    localDateTimeFormat(new Date(Date.now() + 30 * 60 * 1000))
  );

  const handleSubmit = async () => {
    if (!text.length) return;

    try {
      const startTimeISO = new Date(startTime).toISOString();
      const endTimeISO = new Date(endTime).toISOString();

      if (new Date(endTime) <= new Date(startTime)) {
        alert("End time must be after start time");
        return;
      }

      const priorityEnum = priorityMapping[priority];

      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "/api/tasks",
        {
          title: text,
          startTime: startTimeISO,
          endTime: endTimeISO,
          priority: priorityEnum,
          status: "PENDING",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const diffMs =
        new Date(endTime).getTime() - new Date(startTime).getTime();
      const diffHrs = diffMs / (1000 * 60 * 60);
      const timeDisplay =
        diffHrs < 1
          ? `${Math.round(diffHrs * 60)} mins`
          : `${Math.round(diffHrs)} hrs`;
      console.log(response.data);

      const newTask: Task = {
        id: response.data.task.id,
        text,
        checked: false,
        time: timeDisplay,
        startTime: startTimeISO,
        endTime: endTimeISO,
        priority: priorityEnum,
        status: "PENDING",
      };

      setTasks((pv) => [newTask, ...pv]);

      setText("");
      setPriority(2);
      setStartTime(localDateTimeFormat(new Date()));
      setEndTime(localDateTimeFormat(new Date(Date.now() + 30 * 60 * 1000)));
      setVisible(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 w-full max-w-xl md:max-w-3xl -translate-x-1/2 px-4">
      <AnimatePresence>
        {visible && (
          <motion.form
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="mb-6 w-full rounded border border-zinc-700 bg-zinc-900 p-3"
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you need to do?"
              className="h-24 w-full resize-none rounded bg-zinc-900 p-3 text-sm text-zinc-50 placeholder-zinc-500 caret-zinc-50 focus:outline-0 opacity-70"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-3">
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-sm">Priority:</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="bg-zinc-700 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="1">1 - LOW</option>
                  <option value="2">2 - MEDIUM</option>
                  <option value="3">3 - HIGH</option>
                  <option value="4">4 - URGENT</option>
                  <option value="5">5 - CRITICAL</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 text-sm">Start time:</label>
                  <input
                    type="datetime-local"
                    className="w-full rounded bg-zinc-700 px-2 py-1 text-sm text-zinc-50 focus:outline-none border-none"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-zinc-400 text-sm">End time:</label>
                  <input
                    type="datetime-local"
                    className="w-full rounded bg-zinc-700 px-2 py-1 text-sm text-zinc-50 focus:outline-none border-none"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                disabled={!text.length}
                type="submit"
                className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-indigo-50 transition-colors hover:bg-indigo-500 cursor-pointer disabled:opacity-70"
              >
                Create Task
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <button
        onClick={() => setVisible((pv) => !pv)}
        className="grid w-full place-content-center rounded-full border border-zinc-700 bg-zinc-900 opacity-70 cursor-pointer py-3 text-lg text-white transition-colors hover:bg-zinc-800 active:bg-zinc-900"
      >
        <FiPlus
          className={`transition-transform ${
            visible ? "rotate-45" : "rotate-0"
          }`}
        />
      </button>
    </div>
  );
};
