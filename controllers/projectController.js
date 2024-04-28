const Project= require("../models/Project");

exports.createProject = async (req, res) => {
  try {
    // Validate input data
    if (!req.body.projectName || !req.body.purpose) {
      return res.status(400).json({
        status: "error",
        message: "Project Name and Purpose are required",
      });
    }

    // Check if a project with the provided ID exists
    const existingProject = await Project.findOne({  projectId: req.body. projectId });

    // Find the ID of the last added project
    const lastAddedProject = await Project.findOne().sort({ _id: -1 });

    if (existingProject) {
      return res.status(400).json({
        status: "error",
        message: "Project ID already exists",
        lastAddedId: lastAddedProject ? lastAddedProject.projectId : null,
      });
    }

    // Create task
    const project = await Project.create(req.body);
    res
      .status(201)
      .json({
        status: "success",
        data: { project },
        lastAddedId: project.projectId,
      });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
