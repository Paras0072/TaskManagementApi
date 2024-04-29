const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["todo", "in progress", "completed", "Overdue"],
    default: "todo",
  },
  tags: { type: String, required: true },
  priority: { type: String, required: true },
  purpose: { type: String, required: true },
  duedate:{type: Date, default: Date.now },
  projectId: { type: String, },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
 
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;