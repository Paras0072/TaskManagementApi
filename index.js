const express = require("express");
const dotenv = require("dotenv");
 const taskRoutes = require("./routes/taskRoutes");
const projectRoutes = require("./routes/projectRoutes");
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
const db = require("./config/mongoose");
// Middleware
app.use(express.json()); // Body parser middleware
app.use(express.urlencoded());
// calling the routes
// Mount project routes to the root URL path
app.use("/", projectRoutes);
// Mount task routes to the project URL path
app.use('/projects', taskRoutes);
// listening to the port 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.log("error in starting the server", err);
    return;
  }
 console.log(`Server running on port ${PORT}`);
});