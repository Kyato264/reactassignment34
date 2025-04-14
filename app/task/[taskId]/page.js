// app/task/[taskId]/page.js
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTasksFromStorage } from "./utils/localStorage";

export default function TaskDetails() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const tasks = getTasksFromStorage();
    const found = tasks.find(t => String(t.id) === taskId);
    setTask(found);
  }, [taskId]);

  if (!task) return <p>Task not found.</p>;

  return (
    <div>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <p>Due: {task.dueDate}</p>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
    </div>
  );
}
