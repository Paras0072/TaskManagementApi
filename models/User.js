const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: email, required: true },
  password: { type: password, required: true },
  confirmpassword: { type: password, required: true },
  creationDate: { type: Date, default: Date.now },
  
});

const User= mongoose.model("User", userSchema);

module.exports = User;
