import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { parseRoadmapToTasks, getTasksForDay } from "../../utils/roadmapParser";

const PROJECT_START_KEY = "projectStartDate";

/* ---------- Helpers ---------- */

function getProjectDay() {
  const stored = localStorage.getItem(PROJECT_START_KEY);
  const start = stored ? new Date(stored) : new Date();

  if (!stored) {
    localStorage.setItem(PROJECT_START_KEY, start.toISOString());
  }

  const today = new Date();
  return Math.floor((today - start) / 86400000) + 1;
}

function getWeeklySummary(startupId, currentDay) {
  const weekStart = currentDay - ((currentDay - 1) % 7);
  const weekEnd = weekStart + 6;

  let total = 0;
  let completed = 0;

  for (let d = weekStart; d <= weekEnd; d++) {
    const data = localStorage.getItem(`planner-${startupId}-day-${d}`);
    if (!data) continue;

    const tasks = JSON.parse(data);
    total += tasks.length;
    completed += tasks.filter(t => t.completed).length;
  }

  return { total, completed };
}

/* ---------- Component ---------- */

export default function DailyPlanner() {
  const { startupId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const day = getProjectDay();
  const todayKey = `planner-${startupId}-day-${day}`;
  const yesterdayKey = `planner-${startupId}-day-${day - 1}`;

  useEffect(() => {
    // If today already exists → load and stop
    const savedToday = localStorage.getItem(todayKey);
    if (savedToday) {
      setTasks(JSON.parse(savedToday));
      setLoading(false);
      return;
    }

    const yesterdayTasks =
      JSON.parse(localStorage.getItem(yesterdayKey)) || [];

    fetch(`http://localhost:5000/api/roadmap/${startupId}`)
      .then(res => res.json())
      .then(data => {
        const text = data.roadmap.replace(/\*\*/g, "");
        const sections = parseRoadmapToTasks(text);

        // Fresh roadmap tasks
        const todaysTasks = getTasksForDay(sections, day).map(t => ({
          ...t,
          id: `${t.title}-${t.startDay}-${t.endDay}`
        }));

        // Carry-forward logic
        const carryForward = yesterdayTasks
          .filter(t =>
            !t.completed &&
            day >= t.startDay &&
            day <= t.endDay
          )
          .map(t => ({
            ...t,
            carriedFrom: t.carriedFrom ?? day - 1
          }));

        const mergedTasks = [
          ...todaysTasks,
          ...carryForward.filter(
            t => !todaysTasks.some(td => td.id === t.id)
          )
        ];

        setTasks(mergedTasks);
        setLoading(false);
      });
  }, [startupId, day, todayKey, yesterdayKey]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(todayKey, JSON.stringify(tasks));
    }
  }, [tasks, loading, todayKey]);

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
    ? Math.round(
        (tasks.filter(t => t.completed).length / tasks.length) * 100
      )
    : 0;

  const week = Math.ceil(day / 7);
  const { total, completed } = getWeeklySummary(startupId, day);
  const weekProgress = total
    ? Math.round((completed / total) * 100)
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
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggle(task.id)}
                className="w-5 h-5 mt-1 accent-blue-500"
              />
              <div>
                <p className={task.completed ? "line-through text-zinc-500" : ""}>
                  {task.title}
                </p>

                {task.carriedFrom && (
                  <p className="text-xs text-yellow-400 mt-1">
                    Carried from Day {task.carriedFrom}
                  </p>
                )}
              </div>
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

      {/* Daily Progress */}
      {tasks.length > 0 && (
        <div className="max-w-3xl mt-8">
          <div className="h-2 bg-zinc-800 rounded">
            <div
              className="h-2 bg-blue-500 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            {progress}% completed today
          </p>
        </div>
      )}

      {/* Weekly Summary */}
      <div className="max-w-3xl mt-10 border-t border-zinc-800 pt-6">
        <p className="text-sm text-zinc-400 mb-2">
          Week {week} Summary
        </p>

        <div className="h-2 bg-zinc-800 rounded">
          <div
            className="h-2 bg-emerald-500 rounded"
            style={{ width: `${weekProgress}%` }}
          />
        </div>

        <p className="text-xs text-zinc-500 mt-2">
          {completed} / {total} tasks completed this week
        </p>
      </div>
    </div>
  );
}
