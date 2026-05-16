const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject,
} = require("../controllers/projectController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/")
  .post(protect, adminOnly, createProject)
  .get(protect, getProjects);

router.route("/:id")
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.post("/:id/members", protect, adminOnly, addMemberToProject);

module.exports = router;