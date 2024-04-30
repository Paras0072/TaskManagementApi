const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/Project");

exports.createTask = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const projectId = req.params.projectId;
    req.body.projectId = projectId;
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

      const project = await Project.findOneAndUpdate(
        { projectId: projectId },
        { $push: { tasks: task._id } },
        { new: true }
      );

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
    const projectId = req.params.projectId;

    const tasks = await Task.find({ projectId }); // get all tasks
    res.status(200).json({ status: "success", data: { tasks } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    // Find task by ID
    const { taskId, projectId } = req.params;

    const task = await Task.findOne({ taskId, projectId }); // finding task by id in project

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
    const { taskId, projectId } = req.params;
    // Validate input data
    if (!req.body.title && !req.body.description) {
      return res.status(400).json({
        status: "error",
        message:
          "At least one field (title or description) is required for updating task",
      });
    }

    // Update task by taskId
    const task = await Task.findOneAndUpdate({ taskId, projectId }, req.body, {
      new: true,
    });

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

exports.deleteTask = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    //  Step 1: Delete the task document from the Task collection
    const task = await Task.findOneAndDelete({ taskId, projectId });

    if (!task) {
      return res.status(404).json({
        status: "error",
        message: "Task not found in the specified project",
      });
    }
    res.status(200).json({
      status: "success",
      data: { task },
      message: "Task deleted from project and Task collection",
    });

    //  Step 2: Remove the reference to the deleted task from the tasks array in the Project collection

    await Project.findOneAndUpdate(
      { projectId: projectId },
      { $pull: { tasks: task._id } },
      { new: true }
    );
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
