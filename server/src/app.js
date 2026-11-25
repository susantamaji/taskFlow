import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { protect } from "./middleware/auth.js";
import { dashboard } from "./controllers/dashboardController.js";
import { listUsers } from "./controllers/userController.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { errorHandler, notFound } from "./middleware/errors.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));
app.use(
  "/api/auth",
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }),
  authRoutes,
);
app.get("/api/health", (req, res) =>
  res.json({ success: true, message: "TaskFlow API is running." }),
);
app.use("/api", protect);
app.get("/api/dashboard", asyncHandler(dashboard));
app.get("/api/users", asyncHandler(listUsers));
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
