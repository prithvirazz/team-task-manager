import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });
  const [selectedProjectMembers, setSelectedProjectMembers] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data.projects);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      navigate("/login");
      return;
    }

    setUser(storedUser);
    fetchTasks();
    fetchProjects();
  }, []);

  const handleProjectChange = (projectId) => {
    const selectedProject = projects.find((project) => project._id === projectId);

    setFormData({
      ...formData,
      project: projectId,
      assignedTo: "",
    });

    setSelectedProjectMembers(selectedProject?.members || []);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await API.post("/tasks", {
        ...formData,
        status: "todo",
      });

      setFormData({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        priority: "medium",
        dueDate: "",
      });

      setSelectedProjectMembers([]);
      setMessage("Task created successfully");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleStatusUpdate = async (taskId, status) => {
    setError("");
    setMessage("");

    try {
      await API.put(`/tasks/${taskId}`, { status });
      setMessage("Task status updated");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div>
          <h2>Team Task Manager</h2>
          <p>Task creation, assignment, and tracking</p>
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
            <h1>Tasks</h1>
            <p>Assign and track task progress</p>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}
        {message && <div className="success-box">{message}</div>}

        {user?.role === "admin" && (
          <section className="form-card full-width">
            <h2>Create Task</h2>

            <form onSubmit={handleCreateTask}>
              <div className="form-row">
                <div className="form-group">
                  <label>Task Title</label>
                  <input
                    type="text"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Project</label>
                  <select
                    value={formData.project}
                    onChange={(e) => handleProjectChange(e.target.value)}
                    required
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Assign To</label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedTo: e.target.value })
                    }
                    required
                  >
                    <option value="">Select member</option>
                    {selectedProjectMembers.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <button className="primary-btn small-btn" type="submit">
                Create Task
              </button>
            </form>
          </section>
        )}

        <section className="table-section">
          <div className="section-header">
            <h2>{user?.role === "admin" ? "All Tasks" : "My Tasks"}</h2>
            <p>
              {user?.role === "admin"
                ? "Tasks created by you"
                : "Tasks assigned to you"}
            </p>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">No tasks found.</div>
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
                    <th>Update</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
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
                      <td>
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusUpdate(task._id, e.target.value)
                          }
                        >
                          <option value="todo">Todo</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
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

export default Tasks;