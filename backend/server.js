import express from "express";
import cookieParser from "cookie-parser";

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import "dotenv/config";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import authRoute from "./routers/authRoute.js";
import adminRoute from "./routers/adminRoute.js";
import userRoute from "./routers/userRoute.js";
const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/user", userRoute);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy",
  });
});
app.use(notFound);
app.use(errorHandler);

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
