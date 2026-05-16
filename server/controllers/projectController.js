const Project = require("../models/Project");
const User = require("../models/User");

// @desc Create project
// @route POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      admin: req.user._id,
      members: members || [],
    });

    const populatedProject = await Project.findById(project._id)
      .populate("admin", "name email role")
      .populate("members", "name email role");

    res.status(201).json({
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create project",
      error: error.message,
    });
  }
};

// @desc Get projects
// @route GET /api/projects
const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find({ admin: req.user._id })
        .populate("admin", "name email role")
        .populate("members", "name email role")
        .sort({ createdAt: -1 });
    } else {
      projects = await Project.find({ members: req.user._id })
        .populate("admin", "name email role")
        .populate("members", "name email role")
        .sort({ createdAt: -1 });
    }

    res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
      error: error.message,
    });
  }
};

// @desc Get single project
// @route GET /api/projects/:id
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("admin", "name email role")
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isAdmin = project.admin._id.toString() === req.user._id.toString();
    const isMember = project.members.some(
      (member) => member._id.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json({
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};

// @desc Update project
// @route PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only project admin can update this project",
      });
    }

    project.name = name || project.name;
    project.description = description || project.description;

    const updatedProject = await project.save();

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update project",
      error: error.message,
    });
  }
};

// @desc Delete project
// @route DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only project admin can delete this project",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

// @desc Add member to project
// @route POST /api/projects/:id/members
const addMemberToProject = async (req, res) => {
  try {
    const { email } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only project admin can add members",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found with this email",
      });
    }

    if (user.role !== "member") {
      return res.status(400).json({
        message: "Only member users can be added to projects",
      });
    }

    if (project.members.includes(user._id)) {
      return res.status(400).json({
        message: "User is already a project member",
      });
    }

    project.members.push(user._id);
    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("admin", "name email role")
      .populate("members", "name email role");

    res.status(200).json({
      message: "Member added successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add member",
      error: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject,
};