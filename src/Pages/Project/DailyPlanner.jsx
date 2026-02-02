import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { parseRoadmapToTasks, getTasksForDay } from "../../utils/roadmapParser";

const PROJECT_START_KEY = "projectStartDate";

function getProjectDay() {
  const stored = localStorage.getItem(PROJECT_START_KEY);
  const start = stored ? new Date(stored) : new Date();

  if (!stored) {
    localStorage.setItem(PROJECT_START_KEY, start.toISOString());
  }

  const today = new Date();
  return Math.floor((today - start) / 86400000) + 1;
}

export default function DailyPlanner() {
  const { startupId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const day = getProjectDay();
  const storageKey = `planner-${startupId}-day-${day}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setTasks(JSON.parse(saved));
      setLoading(false);
      return;
    }

    // Fetch roadmap text
    fetch(`http://localhost:5000/api/roadmap/${startupId}`)
      .then(res => res.json())
      .then(data => {
        const text = data.roadmap.replace(/\*\*/g, "");
        const sections = parseRoadmapToTasks(text);
        const todaysTasks = getTasksForDay(sections, day);
        setTasks(todaysTasks);
        setLoading(false);
      });
  }, [startupId, day]);

  useEffect(() => {
    if (tasks.length) {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    }
  }, [tasks]);

  const toggle = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const updateNote = (id, note) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, note } : t
    ));
  };

  const progress = tasks.length
    ? Math.round(tasks.filter(t => t.completed).length / tasks.length * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
        Loading daily plan…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-10 text-white">
      <h1 className="text-3xl font-semibold mb-1">Daily Planner</h1>
      <p className="text-sm text-zinc-400 mb-8">
        Project Day {day}
      </p>

      <div className="space-y-4 max-w-3xl">
        {tasks.length === 0 && (
          <p className="text-zinc-500">
            No roadmap tasks scheduled for today.
          </p>
        )}

        {tasks.map(task => (
          <div
            key={task.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggle(task.id)}
                className="w-5 h-5 accent-blue-500"
              />
              <span className={task.completed ? "line-through text-zinc-500" : ""}>
                {task.title}
              </span>
            </label>

            <textarea
              placeholder="Reflection / notes"
              value={task.note}
              onChange={(e) => updateNote(task.id, e.target.value)}
              className="mt-3 w-full bg-transparent border border-zinc-700 rounded-lg p-2 text-sm text-zinc-300 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {tasks.length > 0 && (
        <div className="max-w-3xl mt-8">
          <div className="h-2 bg-zinc-800 rounded">
            <div
              className="h-2 bg-blue-500 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            {progress}% completed
          </p>
        </div>
      )}
    </div>
  );
}
