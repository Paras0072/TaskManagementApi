const express = require("express");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/taskRoutes");
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
const db = require("./config/mongoose");
app.use(express.json());
// calling the routes
app.use("/", taskRoutes);
// listening to the port 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.log("error in starting the server", err);
    return;
  }
 console.log(`Server running on port ${PORT}`);
});