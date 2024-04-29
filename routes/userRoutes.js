const express = require("express");
const { passport } = require("../config/passport");
const router = express.Router();
const {
  createUser,
  loginUser,
  //   resetPasswordRequest,
  //   resetPassword,
} = require("../controllers/userController");

router
  .post("/register", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/logout", (req, res) => {
    req.logout((err) => {
      // Passport method to clear the session and log out the user
      if (err) {
        console.error("Error logging out:", err);
        // Handle the error (e.g., display an error message)
      } else {
        return res.status(200).json({ message: "Logout successful" });
               res.redirect("/login"); // Redirect the user to the login page after logout
      }
    });
  });
//   .post("/reset-password-request", resetPasswordRequest)
//   .post("/reset-password", resetPassword);

module.exports = router;
