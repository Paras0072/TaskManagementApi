const User= require("../models/User");
const { passport, hashPassword } = require("../config/passport");

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, confirmpassword } = req.body;

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check  email already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "email already exists" });
    }

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      confirmpassword: hashedPassword, // We can store the hashed password in confirmPassword field temporarily
    });
    const doc = await newUser.save();
    // Log in the user
    // req.loginUser(doc, (err) => {
    //   if (err) {
    //     return res.status(500).json({ message: "Error logging in user" });
    //   }
      return res
        .status(201)
        .json({ message: "User registered successfully", user: doc });
    // });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
exports.loginUser = async (req, res) => {
  const user = req.user;
  res.status(200)
     .json({ message: "Login successful", user: req.user });
};
