const Project = require("../models/Project");
const User = require("../models/User");
exports.createProject = async (req, res) => {
  try {
    // Extract user ID from authenticated user
    const userId = req.user.id;

    const { projectId, projectName, purpose } = req.body;

    // Validate input data
    if (!projectName || !purpose) {
      return res.status(400).json({
        status: "error",
        message: "Project Name and Purpose are required",
      });
    }

    // Check if a project with the provided ID exists
    const existingProject = await Project.findOne({
      user: userId,
      projectId,
    });

    // Find the ID of the last added project
    const lastAddedProject = await Project.findOne({ user: userId }).sort({
      _id: -1,
    });

    if (existingProject) {
      return res.status(400).json({
        status: "error",
        message: "Project ID already exists",
        lastAddedId: lastAddedProject ? lastAddedProject.projectId : null,
      });
    }

    // Create task
    const project = await Project.create({ ...req.body, user: userId });
    // Save project to database
    await project.save();
    // Update user's project array with the ID of the new project
    await User.findByIdAndUpdate(userId, {
      $push: { projects: project._id },
    });
    res.status(201).json({
      status: "success",
      data: { project },
      lastAddedId: project.projectId,
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
exports.getAllProjects = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const projects = await Project.find({ user: userId });
    res.json({ status: "success", data: projects });
  } catch {
    console.error("Error fetching projects:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch projects" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const projectId = req.params.projectId;
    // Find the project by ID and check if it belongs to the authenticated user
    const project = await Project.findOne({
      _id: projectId,
      user: userId,
    });
    if (!project) {
      return res
        .status(404)
        .json({ status: "error", message: "Project not found" });
    }
    res.json({ status: "success", data: project });
  } catch {
    console.error("Error fetching project by ID:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch project" });
  }
};
exports.deleteProject = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const projectId = req.params.projectId;
    // Find the project by ID and check if it belongs to the authenticated user
    const project = await Project.findOne({
      _id: projectId,
      user: userId,
    });
    if (!project) {
      return res
        .status(404)
        .json({ status: "error", message: "Project not found" });
    }
    await project.remove();

    // Remove project reference from user's project array
    await User.findByIdAndUpdate(userId, {
      $pull: { projects: projectId },
    });

    res.json({ status: "success", message: "Project deleted successfully" });
  } catch {
    console.error("Error deleting project by ID:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to delete project" });
  }
};
