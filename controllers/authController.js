const User = require("../models/User");
const { passport, hashPassword } = require("../config/passport");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");

// for creating user and store the hashed password
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, confirmpassword } = req.body;
    const salt = crypto.randomBytes(16);
    const iterations = 310000;
    const keyLength = 32;
    const digest = "sha256";
    crypto.pbkdf2(
      password,
      salt,
      iterations,
      keyLength,
      digest,
      async function (err, hashedPassword) {
        // matching the password
        if (password !== confirmpassword) {
          return res.status(400).json({ message: "Passwords do not match" });
        }

        // Check  email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "email already exists" });
        }

      
    // creating user with hashed password
        const user = new User({
          ...req.body,
          password: hashedPassword,
          confirmpassword: hashedPassword,
          salt,
        });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(
              sanitizeUser(doc),
              process.env.JWT_SECRET_KEY
            );
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({ id: doc.id, role: doc.role });
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

// login user
exports.loginUser = async (req, res) => {
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role });
};
exports.logout = async (req, res) => {
  res
    .cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200);
};
exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};
// exports.createUser = async (req, res) => {
//   try {
//     const { username, email, password, confirmpassword } = req.body;

//     if (password !== confirmpassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }

//     // Check  email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "email already exists" });
//     }

//     // Hash the password
//     const hashedPassword = hashPassword(password);

//     // Create a new user
//     const newUser = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       confirmpassword: hashedPassword, // We can store the hashed password in confirmPassword field temporarily
//     });
//     const doc = await newUser.save();
//     // Log in the user
//     // req.loginUser(doc, (err) => {
//     //   if (err) {
//     //     return res.status(500).json({ message: "Error logging in user" });
//     //   }
//     return res
//       .status(201)
//       .json({ message: "User registered successfully", user: doc });
//     // });
//   } catch (err) {
//     res.status(400).json({ status: "error", message: err.message });
//   }
// };
