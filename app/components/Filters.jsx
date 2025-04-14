// app/components/Filters.jsx
export default function Filters({ setPriority, setStatus }) {
    return (
      <div>
        <select onChange={(e) => setPriority(e.target.value)}>
          <option value="">All Priorities</option>
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <select onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    );
  }
  