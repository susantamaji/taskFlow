import mongoose from "mongoose";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

const validId = id => mongoose.Types.ObjectId.isValid(id);
export async function listProjects(req, res) {
  const projects = await Project.find({ owner: req.user._id }).sort({ updatedAt: -1 });
  res.json({ success: true, projects });
}
export async function createProject(req, res) {
  const { name, description = "", startDate, endDate, status = "Planned" } = req.body;
  if (!name?.trim() || !startDate || !endDate) return res.status(400).json({ success: false, message: "Name, start date and end date are required." });
  if (new Date(endDate) < new Date(startDate)) return res.status(400).json({ success: false, message: "End date cannot be earlier than start date." });
  const project = await Project.create({ name, description, startDate, endDate, status, owner: req.user._id });
  res.status(201).json({ success: true, project });
}
export async function getProject(req, res) {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid project ID." });
  const project = await Project.findById(req.params.id).populate("owner", "firstName lastName username");
  if (!project) return res.status(404).json({ success: false, message: "Project not found." });
  if (!project.owner._id.equals(req.user._id)) return res.status(403).json({ success: false, message: "You are not permitted to view this project." });
  const tasks = await Task.find({ project: project._id }).populate("assignedUser", "firstName lastName username").sort({ dueDate: 1 });
  res.json({ success: true, project, tasks });
}
export async function updateProject(req, res) {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid project ID." });
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found." });
  if (!project.owner.equals(req.user._id)) return res.status(403).json({ success: false, message: "You are not permitted to update this project." });
  const allowed = ["name", "description", "startDate", "endDate", "status"];
  allowed.forEach(k => { if (req.body[k] !== undefined) project[k] = req.body[k]; });
  if (project.endDate < project.startDate) return res.status(400).json({ success: false, message: "End date cannot be earlier than start date." });
  await project.save();
  res.json({ success: true, project });
}
export async function deleteProject(req, res) {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid project ID." });
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found." });
  if (!project.owner.equals(req.user._id)) return res.status(403).json({ success: false, message: "You are not permitted to delete this project." });
  await Task.deleteMany({ project: project._id });
  await project.deleteOne();
  res.json({ success: true, message: "Project and its tasks deleted." });
}
