const Task = require("../models/Task");
const Project = require("../models/Project");
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if projectId is provided
    if (!projectId) {
      throw new Error(
        "Project ID is required. Add project first, then add task."
      );
    }

    // Check if project exists
    const project = await Project.findOne({ projectId });
    if (!project) {
      throw new Error("Project not found. Add project first, then add task.");
    }
    // Validate input data

    if (!req.body.title || !req.body.description) {
      return res.status(400).json({
        status: "error",
        message: "Title and description are required",
      });
    }

    const taskIdToCheck = req.body.taskId;

    // Check if a task with the provided ID exists
    const existingTask = await Task.findOne({ taskId: taskIdToCheck });
    // // Find the ID of the last added task
    const lastAddedTask = await Task.findOne().sort({ _id: -1 });

    if (existingTask) {
      return res.status(400).json({
        status: "error",
        message: "Task ID already exists",
        lastAddedId: lastAddedTask ? lastAddedTask.taskId : null,
      });
    } else {
      // Create task
      const task = await Task.create(req.body);
      // Add task to project
      project.tasks.push(task._id);
      await project.save();

      res.status(201).json({
        status: "success",
        data: { task, project },
        lastAddedId: task.taskId,
      });
    }
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
exports.updateTask = async (req, res) => {
  try {
    // Validate input data
    if (!req.body.title && !req.body.description) {
      return res.status(400).json({
        status: "error",
        message:
          "At least one field (title or description) is required for updating task",
      });
    }

    // Update task by taskId
    const task = await Task.findOneAndUpdate(
      { taskId: req.params.id },
      req.body,
      { new: true }
    );

    // Check if task exists
    if (!task) {
      return res
        .status(404)
        .json({ status: "error", message: "Task not found" });
    }

    // Task updated, return it
    res.status(200).json({ status: "success", data: { task } });
  } catch (err) {
    // Handle errors
    res.status(500).json({ status: "error", message: err.message });
  }
};
