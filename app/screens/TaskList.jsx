"use client";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import WeekBar from "../components/WeekBar";
import TaskPopup from "../components/TaskPopup";
import { getTasksFromStorage } from "../utils/localStorage";
import "../styles/globals.css";



export default function TaskList() {
  const [tasks, setTasks] = useState([]); // All tasks
  const [searchValue, setSearchValue] = useState(""); // Search input
  const [filteredTasks, setFilteredTasks] = useState([]); // Filtered tasks
  const [priorityFilter, setPriorityFilter] = useState(""); // Priority filter
  const [statusFilter, setStatusFilter] = useState(""); // Status filter
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Track popup state
  const [currentScreen, setCurrentScreen] = useState("task-list"); // Track current screen
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    const storedTasks = getTasksFromStorage() || []; // Ensure default empty array if no tasks found
    console.log("Loaded tasks:", storedTasks);
    setTasks(storedTasks);
  }, []);

  // Filter tasks based on search value and filters
  useEffect(() => {
    const filtered = tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchValue.toLowerCase());
      const matchesPriority = priorityFilter ? task.priority.toString() === priorityFilter : true;
      const matchesStatus = statusFilter ? task.status === statusFilter : true;
      return matchesSearch && matchesPriority && matchesStatus;
    });
    setFilteredTasks(filtered);

    // Show popup only if there is a search value
    setIsPopupOpen(searchValue !== "");
  }, [searchValue, tasks, priorityFilter, statusFilter]);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchValue(searchValue);
  };

  const closePopup = () => {
    setSearchValue(""); // Optionally clear search when closing popup
    setIsPopupOpen(false); // Close the popup when the user clears the search
  };

  const handleSwipeLeft = () => {
    if (currentScreen === "task-list") {
      setCurrentScreen("completed-tasks");
    } else if (currentScreen === "high-priority") {
      setCurrentScreen("task-list");
    }
  };

  const handleSwipeRight = () => {
    if (currentScreen === "task-list") {
      setCurrentScreen("high-priority");
    } else if (currentScreen === "completed-tasks") {
      setCurrentScreen("task-list");
    }
  };

  const loadNextSevenDays = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    setStartDate(newStartDate);
    generateWeekBars(newStartDate);
  };

  const loadPreviousSevenDays = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    setStartDate(newStartDate);
    generateWeekBars(newStartDate);
  };

  const generateWeekBars = (startDate) => {
    const weekBars = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const tasksForDate = tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === date.toDateString();
      });
      weekBars.push({
        date: date.toDateString(),
        tasks: tasksForDate
      });
    }
    console.log("Generated Week Bars:", weekBars);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    onSwipedUp: loadNextSevenDays,
    onSwipedDown: loadPreviousSevenDays,
  });

  return (
    <div {...swipeHandlers} id="task-list-screen">
      {currentScreen === "task-list" && (
        <>
          <div id="task-text">
            <h3>Task List</h3>
          </div>
          <header>
            <input
              type="text"
              id="search-bar"
              placeholder="Search for a task"
              value={searchValue}
              onChange={handleSearchChange}
            />
            <div id="filters-container">
              <div id="priority-filter">
                <select
                  id="priority-filter"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">Priorities</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              <div id="status-filter">
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </header>

          <TaskPopup
            tasks={filteredTasks}
            show={isPopupOpen}
            onClose={closePopup}
          />

          <div id="task-list-container">
            <div id="week-bars">
              <WeekBar tasks={tasks} />
            </div>
          </div>
        </>
      )}

      {currentScreen === "completed-tasks" && (
        <div id="completed-tasks-screen">
          <h2>Completed Tasks</h2>
          {tasks.filter(task => task.status === "completed").length === 0 ? (
            <p>No completed tasks.</p>
          ) : (
            tasks.filter(task => task.status === "completed").map(task => (
              <div class ="SwipedTasked" key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Completed: {task.dueDate}</p>
                <p>Status: {task.status}</p>
              </div>
            ))
          )}
        </div>
      )}

      {currentScreen === "high-priority" && (
        <div id="high-priority-screen">
        <h2>High Priority Tasks</h2>
        {tasks.filter(task => task.priority <= 3 && task.status !== "completed").length === 0 ? (
          <p>No high-priority tasks.</p>
         ) : (
          tasks.filter(task => task.priority <= 3 && task.status !== "completed").map(task => (
            <div class ="SwipedTasked" key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Completed: {task.dueDate}</p>
              <p>Status: {task.status}</p>
            </div>
          ))
        )}
      </div>
      )}
    </div>
  );
}
