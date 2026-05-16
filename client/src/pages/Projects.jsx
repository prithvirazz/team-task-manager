import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [memberEmail, setMemberEmail] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchProjects = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);

      const res = await API.get("/projects");
      setProjects(res.data.projects);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await API.post("/projects", formData);

      setFormData({
        name: "",
        description: "",
      });

      setMessage("Project created successfully");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!selectedProjectId) {
      setError("Please select a project");
      return;
    }

    try {
      await API.post(`/projects/${selectedProjectId}/members`, {
        email: memberEmail,
      });

      setMemberEmail("");
      setSelectedProjectId("");
      setMessage("Member added successfully");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
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
          <p>Projects and team management</p>
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
            <h1>Projects</h1>
            <p>Create projects and manage team members</p>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}
        {message && <div className="success-box">{message}</div>}

        {user?.role === "admin" && (
          <div className="forms-grid">
            <section className="form-card">
              <h2>Create Project</h2>

              <form onSubmit={handleCreateProject}>
                <div className="form-group">
                  <label>Project Name</label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Enter project description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <button className="primary-btn" type="submit">
                  Create Project
                </button>
              </form>
            </section>

            <section className="form-card">
              <h2>Add Member to Project</h2>

              <form onSubmit={handleAddMember}>
                <div className="form-group">
                  <label>Select Project</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    required
                  >
                    <option value="">Choose project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Member Email</label>
                  <input
                    type="email"
                    placeholder="member@test.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    required
                  />
                </div>

                <button className="primary-btn" type="submit">
                  Add Member
                </button>
              </form>
            </section>
          </div>
        )}

        <section className="table-section">
          <div className="section-header">
            <h2>All Projects</h2>
            <p>Projects available for your role</p>
          </div>

          {projects.length === 0 ? (
            <div className="empty-state">No projects found.</div>
          ) : (
            <div className="project-grid">
              {projects.map((project) => (
                <div className="project-card" key={project._id}>
                  <h3>{project.name}</h3>
                  <p>{project.description || "No description added"}</p>

                  <div className="project-meta">
                    <strong>Admin:</strong> {project.admin?.name}
                  </div>

                  <div className="project-meta">
                    <strong>Members:</strong> {project.members?.length || 0}
                  </div>

                  <div className="member-list">
                    {project.members?.map((member) => (
                      <span key={member._id}>{member.name}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Projects;