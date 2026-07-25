const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});
const { startJobs } = require("./jobs/index");
const { connectCache } = require("./cache/client");

const app = require("./app");

const startServer = async () => {
  try {
    // MongoDB
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("Connected to MongoDB");

    // Redis
    await connectCache();

    // Jobs
    startJobs();

    // Express
    const port = process.env.PORT || 3000;

    const server = app.listen(port, () => {
      console.log("Express Server is up and running..");
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
};

startServer();
