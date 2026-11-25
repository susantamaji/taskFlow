import { asyncHandler } from "../utils/asyncHandler.js";
import { Router } from "express";
import { createProject, deleteProject, getProject, listProjects, updateProject } from "../controllers/projectController.js";
const router = Router();
router.route("/").get(asyncHandler(listProjects)).post(asyncHandler(createProject));
router.route("/:id").get(asyncHandler(getProject)).patch(asyncHandler(updateProject)).delete(asyncHandler(deleteProject));
export default router;
