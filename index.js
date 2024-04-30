const express = require("express");
const { passport } = require("./config/passport"); // for athentication
const session = require("express-session");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes")
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express"); /// for swagger api testing
const swaggerDocument = require("./swagger.json"); // Path to your swagger.json file
const { isAuth } = require("./services/common");
const cors = require("cors"); // for connecting to frontend
dotenv.config();

// const path = require("path");
const app = express();
// Serve Swagger UI at /api-docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Start the server and navigate to http://localhost:<PORT>/api-docs to view the Swagger documentation.
// Enable CORS for all requests
app.use(cors());

// middlewares
// server.use(express.static(path.resolve(__dirname, "build")));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.authenticate("session"));

app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

// Parse application/json
app.use(bodyParser.json());

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// calling the routes
app.use("/auth", authRoutes);
app.use("/users", isAuth(), userRoutes);
app.use("/projects", isAuth(),projectRoutes);
app.use("/projects/task", isAuth(), taskRoutes);
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


module.exports = app;