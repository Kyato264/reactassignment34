// app/components/WeekBar.jsx
"use client";
import { useState } from "react";
import { formatDate, isOverdue } from "../utils/date";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import styles from "/styles/WeekBar.module.css";

export default function WeekBar({ tasks }) {
  const [visibleTaskList, setVisibleTaskList] = useState(null); // Track which task list is visible
  const [week, setWeek] = useState(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d;
    });
  });

  const toggleTaskList = (dateStr) => {
    setVisibleTaskList((prev) => (prev === dateStr ? null : dateStr));
  };

  const updateWeek = (newStartDate) => {
    const updatedWeek = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(newStartDate);
      d.setDate(newStartDate.getDate() + i);
      return d;
    });
    setWeek(updatedWeek);
  };

  const loadNextSevenDays = () => {
    const newStartDate = new Date(week[0]);
    newStartDate.setDate(newStartDate.getDate() + 7);
    updateWeek(newStartDate);
  };

  const loadPreviousSevenDays = () => {
    const newStartDate = new Date(week[0]);
    newStartDate.setDate(newStartDate.getDate() - 7);
    updateWeek(newStartDate);
  };

  const swipeHandlers = useSwipeable({
    onSwipedUp: loadNextSevenDays,
    onSwipedDown: loadPreviousSevenDays,
  });

  return (
    <div {...swipeHandlers} id="week-bar" className={styles.weekBar}>
      {week.map((date) => {
        const dateStr = date.toISOString().split("T")[0];
        const dayTasks = tasks.filter((t) => t.dueDate === dateStr);

        return (
          <div
            key={dateStr}
            className={`${styles.weekBar} ${
              dayTasks.some((t) => isOverdue(t.dueDate)) ? styles.overdue : ""
            }`}
            onClick={() => toggleTaskList(dateStr)}
          >
            <p>{formatDate(date)}</p>
            <ul 
              className={styles.taskList}
              style={{
                display: visibleTaskList === dateStr ? "block" : "none",
              }}
            >
              {dayTasks.length > 0 ? (
                dayTasks.map((task) => (
                  <li key={task.id} className={styles.taskItem}>
                    <Link href={`/task/${task.id}`}>{task.title}</Link>
                  </li>
                ))
              ) : (
                <li className={styles.taskItem}>No tasks for this day</li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
