import express from "express";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import "dotenv/config";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
const app = express();
connectDB();

app.use(notFound);
app.use(errorHandler);
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy",
  });
});

const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});

server.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  console.error("Error stack:", err.stack);

  server.close(() => {
    process.exit(1);
  });
});

server.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  console.error("Error stack:", err.stack);
  process.exit(1);
});

server.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully.");
  server.close(() => {
    console.log("Server closed.");
  });
});
