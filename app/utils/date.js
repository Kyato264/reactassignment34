// app/utils/date.js
export function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  export function isOverdue(dueDate) {
    return new Date(dueDate) < new Date();
  }
  