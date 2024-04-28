const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.post("/:projectId/tasks", taskController.createTask);
router.get("/:projectId/tasks", taskController.getAllTasks);
router.get("/:projectId/tasks/:id", taskController.getTaskById);
router.put("/:projectId/tasks/:id", taskController.updateTask);
module.exports = router;