const express = require("express");
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
// /projects/task already in base path
router.post("/:projectId", createTask)
      .get("/:projectId", getAllTasks)
      .get("/:projectId/:taskId", getTaskById)
      .put("/:projectId/:taskId", updateTask)
      .delete("/:projectId/:taskId", deleteTask);
module.exports = router;