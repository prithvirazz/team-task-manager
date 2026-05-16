const Task = require("../models/Task");
const Project = require("../models/Project");

// @desc Create task
// @route POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, project, assignedTo, status, priority, dueDate } =
      req.body;

    if (!title || !project || !assignedTo || !dueDate) {
      return res.status(400).json({
        message: "Title, project, assignedTo and dueDate are required",
      });
    }

    const projectData = await Project.findById(project);

    if (!projectData) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (projectData.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only project admin can create tasks for this project",
      });
    }

    const isProjectMember = projectData.members.some(
      (memberId) => memberId.toString() === assignedTo
    );

    if (!isProjectMember) {
      return res.status(400).json({
        message: "Assigned user must be a member of this project",
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user._id,
      status: status || "todo",
      priority: priority || "medium",
      dueDate,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name description")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// @desc Get tasks
// @route GET /api/tasks
const getTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find({ createdBy: req.user._id })
        .populate("project", "name description")
        .populate("assignedTo", "name email role")
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate("project", "name description")
        .populate("assignedTo", "name email role")
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// @desc Get single task
// @route GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name description")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const isCreator = task.createdBy._id.toString() === req.user._id.toString();
    const isAssignedUser =
      task.assignedTo._id.toString() === req.user._id.toString();

    if (!isCreator && !isAssignedUser) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json({
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

// @desc Update task
// @route PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } =
      req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssignedUser =
      task.assignedTo.toString() === req.user._id.toString();

    if (!isCreator && !isAssignedUser) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (req.user.role === "member") {
      task.status = status || task.status;
    } else {
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
      task.assignedTo = assignedTo || task.assignedTo;
    }

    const updatedTask = await task.save();

    const populatedTask = await Task.findById(updatedTask._id)
      .populate("project", "name description")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    res.status(200).json({
      message: "Task updated successfully",
      task: populatedTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// @desc Delete task
// @route DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only task creator can delete this task",
      });
    }

    await task.deleteOne();

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};