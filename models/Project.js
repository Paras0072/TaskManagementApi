const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  projectName: { type: String, required: true },
  purpose: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const Project= mongoose.model("Project", projectSchema);

module.exports = Project;
