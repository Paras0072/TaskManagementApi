const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: Buffer, required: true },
    password: { type: Buffer, required: true },
    role: { type: String, required: true, default: "user" },
    salt: { type: Buffer },
    resetPasswordToken: { type: String, default: "" },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

const User= mongoose.model("User", userSchema);

module.exports = User;
