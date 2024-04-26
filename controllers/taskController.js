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

    // Create task, let Mongoose populate the default values
    console.log(req.body)
    const task = await Task.create(req.body);
    res.status(201).json({ status: "success", data: { task } });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
