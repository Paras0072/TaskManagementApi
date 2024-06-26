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
      projectName
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

    // Create Project
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
    const projects = await Project.find({ user: userId }); // getting all projects
    res.json({ status: "success", data: projects });
  } catch(error) {
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
      projectId, 
      user: userId,
    });
    if (!project) {
      return res
        .status(404)
        .json({ status: "error", message: "Project not found" });
    }
    res.json({ status: "success", data: project });
  } catch (error){
    console.error("Error fetching project by ID:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch project" });
  }
};
exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id; // Assuming user is authenticated
    // Validate input data
    if (!req.body.projectName && !req.body.purpose) {
      return res.status(400).json({
        status: "error",
        message:
          "At least one field (projectName or purpose) is required for updating Project",
      });
    }

    // Update project by projectId
    const project = await Project.findOneAndUpdate(
      { projectId, user: userId },
      req.body,
      {
        new: true,
      }
    );

    // Check if task exists
    if (!project) {
      return res
        .status(404)
        .json({ status: "error", message: "Project not found" });
    }

    // Task updated, return it
    res.status(200).json({ status: "success", data: { project } });
  } catch (err) {
    // Handle errors
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const projectId = req.params.projectId;
    // Find the project by ID and check if it belongs to the authenticated user Amd Delete it
    const project = await Project.findOneAndDelete({
      projectId,
      user: userId,
    });
    if (!project) {
      return res
        .status(404)
        .json({ status: "error", message: "Project not found" });
    }


    // Remove project reference from user's project array
    await User.findByIdAndUpdate(userId, {
      $pull: { projects: project._id },
    });

    res.json({ status: "success", message: "Project deleted successfully" });
  } catch (error){
    console.error("Error deleting project by ID:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to delete project" });
  }
};
