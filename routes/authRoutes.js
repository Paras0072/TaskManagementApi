const express = require("express");
const { passport } = require("../config/passport");
const router = express.Router();
const {
  createUser,
  loginUser,
  checkAuth,
  logout,
  //   resetPasswordRequest,
  //   resetPassword,
} = require("../controllers/authController");

router
  .post("/register", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check", passport.authenticate("jwt"), checkAuth)
  .get("/logout", logout);

//   .post("/reset-password-request", resetPasswordRequest)
//   .post("/reset-password", resetPassword);

module.exports = router;
