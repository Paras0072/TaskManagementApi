const express = require("express");
const { passport }  = require("./config/passport");
const session = require("express-session");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();
// Middleware
app.use(express.json()); // Body parser middleware
app.use(express.urlencoded({ extended: true }));

// Configure express-session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());



// calling the routes
app.use("/", userRoutes);
const db = require("./config/mongoose");
const PORT = process.env.PORT || 3000;
// listening to the port 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.log("error in starting the server", err);
    return;
  }
  console.log(`Server running on port ${PORT}`);
});
