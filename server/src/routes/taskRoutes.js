import { asyncHandler } from "../utils/asyncHandler.js";
import { Router } from "express";
import { createTask, deleteTask, getTask, listTasks, updateTask, updateTaskStatus } from "../controllers/taskController.js";
const router = Router();
router.route("/").get(asyncHandler(listTasks)).post(asyncHandler(createTask));
router.patch("/:id/status", asyncHandler(updateTaskStatus));
router.route("/:id").get(asyncHandler(getTask)).patch(asyncHandler(updateTask)).delete(asyncHandler(deleteTask));
export default router;
