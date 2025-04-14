// app/utils/localStorage.js
import predefinedTasks from "../data/predefinedTasks";

export function getTasksFromStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return Array.isArray(tasks) ? tasks : [];
}

export function initializeTasksInStorage() {
    if (typeof window !== "undefined" && !localStorage.getItem("tasks")) {
        localStorage.setItem("tasks", JSON.stringify(predefinedTasks));
    }
}
