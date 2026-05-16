import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);

      const res = await API.get("/dashboard/summary");

      setSummary(res.data.summary);
      setRecentTasks(res.data.recentTasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return <div className="page-loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div>
          <h2>Team Task Manager</h2>
          <p>Project and task tracking dashboard</p>
        </div>

        <div className="nav-user">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/tasks">Tasks</Link>
  <span>
    {user?.name} ({user?.role})
  </span>
  <button onClick={handleLogout}>Logout</button>
</div>
      </nav>

      <main className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.name}</p>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        {summary && (
          <div className="summary-grid">
            <div className="summary-card">
              <p>Projects</p>
              <h2>{summary.projectsCount}</h2>
            </div>

            <div className="summary-card">
              <p>Total Tasks</p>
              <h2>{summary.totalTasks}</h2>
            </div>

            <div className="summary-card">
              <p>Todo</p>
              <h2>{summary.todoTasks}</h2>
            </div>

            <div className="summary-card">
              <p>In Progress</p>
              <h2>{summary.inProgressTasks}</h2>
            </div>

            <div className="summary-card">
              <p>Completed</p>
              <h2>{summary.completedTasks}</h2>
            </div>

            <div className="summary-card danger">
              <p>Overdue</p>
              <h2>{summary.overdueTasks}</h2>
            </div>
          </div>
        )}

        <section className="table-section">
          <div className="section-header">
            <h2>Recent Tasks</h2>
            <p>Latest tasks from your workspace</p>
          </div>

          {recentTasks.length === 0 ? (
            <div className="empty-state">No recent tasks found.</div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Project</th>
                    <th>Assigned To</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentTasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>{task.project?.name}</td>
                      <td>{task.assignedTo?.name}</td>
                      <td>
                        <span className={`badge ${task.status}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <span className={`priority ${task.priority}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;