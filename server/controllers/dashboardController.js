const Task = require("../models/Task");
const Project = require("../models/Project");

// @desc Get dashboard summary
// @route GET /api/dashboard/summary
const getDashboardSummary = async (req, res) => {
  try {
    let taskFilter = {};
    let projectFilter = {};

    if (req.user.role === "admin") {
      taskFilter = { createdBy: req.user._id };
      projectFilter = { admin: req.user._id };
    } else {
      taskFilter = { assignedTo: req.user._id };
      projectFilter = { members: req.user._id };
    }

    const totalTasks = await Task.countDocuments(taskFilter);

    const todoTasks = await Task.countDocuments({
      ...taskFilter,
      status: "todo",
    });

    const inProgressTasks = await Task.countDocuments({
      ...taskFilter,
      status: "in-progress",
    });

    const completedTasks = await Task.countDocuments({
      ...taskFilter,
      status: "completed",
    });

    const overdueTasks = await Task.countDocuments({
      ...taskFilter,
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    });

    const projectsCount = await Project.countDocuments(projectFilter);

    const recentTasks = await Task.find(taskFilter)
      .populate("project", "name")
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      summary: {
        projectsCount,
        totalTasks,
        todoTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
      },
      recentTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard summary",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
};