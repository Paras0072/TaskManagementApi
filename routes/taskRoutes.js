const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.post("/:projectId/tasks", taskController.createTask);//done
// router.get("/:projectId/tasks", taskController.getAllTasks);
// router.get("/:projectId/tasks/:taskId", taskController.getTaskById);
// router.put("/:projectId/tasks/:taskId", taskController.updateTask);
// router.delete("/:projectId/tasks/:taskId", taskController.deleteTask);
module.exports = router;