const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    // Validate input data
    if (!req.body.title || !req.body.description) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Title and description are required",
        });
    }

    // Check if a task with the provided ID exists
    const existingTask = await Task.findOne({ taskId: req.body.taskId });

    // Find the ID of the last added task
    const lastAddedTask = await Task.findOne().sort({ _id: -1 });

    if (existingTask) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Task ID already exists",
          lastAddedId: lastAddedTask ? lastAddedTask.taskId : null,
        });
    }

    // Create task
    const task = await Task.create(req.body);
    res
      .status(201)
      .json({ status: "success", data: { task }, lastAddedId: task.taskId });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ status: "success", data: { tasks } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    // Find task by ID
    const task = await Task.findOne({ taskId: req.params.id });
    console.log(req.params.id);
    // Check if task exists
    if (!task) {
      return res
        .status(404)
        .json({ status: "error", message: "Task not found" });
    }
    // Task found, return it
    res.status(200).json({ status: "success", data: { task } });
  } catch (err) {
    // Handle errors
    res.status(500).json({ status: "error", message: err.message });
  }
};