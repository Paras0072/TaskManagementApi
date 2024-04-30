const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
} = require("../controllers/projectController");



router
  .post("/", createProject)
  .get("/", getAllProjects)
  .get("/:projectId", getProjectById)
  .delete("/:projectId", deleteProject);

module.exports = router;
