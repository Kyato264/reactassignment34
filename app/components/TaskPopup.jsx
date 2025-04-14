"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "/styles/TaskPopup.module.css";

export default function TaskPopup({ tasks, show, onClose }) {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  // Filter tasks based on search query, priority, and status
  const filtered = Array.isArray(tasks)
    ? tasks.filter((task) => {
        const matchText = task.title.toLowerCase().includes(query.toLowerCase());
        const matchPriority = priority ? task.priority == priority : true;
        const matchStatus = status ? task.status === status : true;
        return matchText && matchPriority && matchStatus;
      })
    : [];

  if (!show) {
    return null; // Do not render anything if `show` is false
  }

  return (
    <div className={styles["popup-overlay"]}>
      <div className={styles["popup-content"]}>
        {/* Close button */}
        <span className={styles["close-btn"]} onClick={onClose}>
          &times;
        </span>

        <h3>Search Tasks</h3>
        <div className={styles["task-list"]}>
          {filtered.length > 0 ? (
            filtered.map((task) => (
              <div key={task.id}>
                <Link href={`/task/${task.id}`}>{task.title}</Link>
              </div>
            ))
          ) : (
            <p>No tasks found</p>
          )}
        </div>
      </div>
    </div>
  );
}
