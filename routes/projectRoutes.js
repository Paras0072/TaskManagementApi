const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
  updateProject
} = require("../controllers/projectController");


// /projects is already in base path
router
  .post("/", createProject)
  .get("/", getAllProjects)
  .get("/:projectId", getProjectById)
  .put("/:projectId", updateProject)
  .delete("/:projectId", deleteProject);

module.exports = router;
