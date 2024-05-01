const User = require("../models/User");
const { passport, hashPassword } = require("../config/passport");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");

function isUsernameNotEmpty(username) {
  // Check if username is defined and not null
  if (username && typeof username === "string") {
    // Trim the username and check if it's not an empty string
    return username.trim() !== "";
  }
  // If username is undefined or not a string, return false
  return false;
}

function validatePassword(password) {
  // Define the regular expressions for validation
  const minLength = 8; // Minimum length of the password
  const uppercaseRegex = /[A-Z]/; // At least one uppercase letter
  const lowercaseRegex = /[a-z]/; // At least one lowercase letter
  const digitRegex = /[0-9]/; // At least one digit

  // Check if the password meets all criteria
  if (
    password.length < minLength ||
    !uppercaseRegex.test(password) ||
    !lowercaseRegex.test(password) ||
    !digitRegex.test(password)
  ) {
    // If any of the criteria are not met, return false
    return false;
  }

  // Otherwise, the password is valid
  return true;
}
function validateEmail(email) {
  // Define the regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Check if the email matches the regular expression
  return emailRegex.test(email);
}

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
        // checking username is empty or not
        if (!isUsernameNotEmpty(username)) {
          console.log("Username is empty");
          return res.status(400).json({ message: "Username is empty " });
        } else if (!validateEmail(email)) {
          // checking mail is valid mail or not
          console.log("Email is invalid");
          return res.status(400).json({ message: "Email is invalid " });
        } else if (!validatePassword(password)) {
          // check password is valid password or not
          return res.status(400).json({
            message:
              "Password does not meet the criteria: Min Length > 8, At least One Upper And One Lower case Letter & one Digit should be present",
          });
        } else if (password !== confirmpassword) {
          // matching password and confirm password
          return res
            .status(400)
            .json({ message: "Passwords do not match with confirm password" });
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
