import mongoose from "mongoose";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const validId = id => mongoose.Types.ObjectId.isValid(id);
const populateTask = q => q.populate("project", "name startDate endDate").populate("assignedUser", "firstName lastName username").populate("createdBy", "firstName lastName username");

export async function listTasks(req, res) {
  const { search, project, status, priority, assignedUser } = req.query;
  const projects = await Project.find({ owner: req.user._id }).select("_id");
  const ownedProjectIds = projects.map(p => p._id);
  const visibility = { $or: [{ project: { $in: ownedProjectIds } }, { assignedUser: req.user._id }] };
  const conditions = [visibility];

  if (project) {
    if (!validId(project)) return res.status(400).json({ success: false, message: "Invalid project filter." });
    conditions.push({ project });
  }
  if (search?.trim()) {
    const term = search.trim().slice(0, 100);
    conditions.push({ $or: [
      { title: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } }
    ] });
  }
  if (status) {
    if (!["To Do", "In Progress", "Completed", "Blocked"].includes(status)) return res.status(400).json({ success: false, message: "Invalid status filter." });
    conditions.push({ status });
  }
  if (priority) {
    if (!["Low", "Medium", "High", "Critical"].includes(priority)) return res.status(400).json({ success: false, message: "Invalid priority filter." });
    conditions.push({ priority });
  }
  if (assignedUser) {
    if (!validId(assignedUser)) return res.status(400).json({ success: false, message: "Invalid assigned user filter." });
    conditions.push({ assignedUser });
  }
  const tasks = await populateTask(Task.find({ $and: conditions }).sort({ updatedAt: -1 }));
  res.json({ success: true, tasks });
}

export async function createTask(req, res) {
  const { title, description = "", project, assignedUser, priority = "Medium", status = "To Do", dueDate } = req.body;
  if (!title?.trim() || !project || !assignedUser || !dueDate) return res.status(400).json({ success: false, message: "Title, project, assignee and due date are required." });
  if (!validId(project) || !validId(assignedUser)) return res.status(400).json({ success: false, message: "Invalid project or user ID." });
  const [projectDoc, user] = await Promise.all([Project.findById(project), User.findById(assignedUser)]);
  if (!projectDoc) return res.status(404).json({ success: false, message: "Project not found." });
  if (!projectDoc.owner.equals(req.user._id)) return res.status(403).json({ success: false, message: "Only the project owner can create tasks." });
  if (!user) return res.status(404).json({ success: false, message: "Assigned user not found." });
  const due = new Date(dueDate);
  if (Number.isNaN(due.getTime()) || due < projectDoc.startDate || due > projectDoc.endDate) return res.status(400).json({ success: false, message: "Due date must be within the project date range." });
  const task = await Task.create({ title, description, project, assignedUser, createdBy: req.user._id, priority, status, dueDate: due });
  res.status(201).json({ success: true, task: await populateTask(Task.findById(task._id)) });
}

export async function getTask(req, res) {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid task ID." });
  const task = await populateTask(Task.findById(req.params.id));
  if (!task) return res.status(404).json({ success: false, message: "Task not found." });
  const project = await Project.findById(task.project._id);
  if (!project.owner.equals(req.user._id) && !task.assignedUser._id.equals(req.user._id)) return res.status(403).json({ success: false, message: "You cannot view this task." });
  res.json({ success: true, task });
}

export async function updateTask(req, res) {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid task ID." });
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: "Task not found." });
  const project = await Project.findById(task.project);
  if (!project.owner.equals(req.user._id)) return res.status(403).json({ success: false, message: "You are not permitted to update this task." });
  const allowed = ["title", "description", "assignedUser", "priority", "status", "dueDate"];
  allowed.forEach(k => { if (req.body[k] !== undefined) task[k] = req.body[k]; });
  if (req.body.assignedUser && (!validId(req.body.assignedUser) || !(await User.exists({ _id: req.body.assignedUser })))) return res.status(400).json({ success: false, message: "Assigned user does not exist." });
  const due = new Date(task.dueDate);
  if (due < project.startDate || due > project.endDate) return res.status(400).json({ success: false, message: "Due date must be within the project date range." });
  await task.save();
  res.json({ success: true, task: await populateTask(Task.findById(task._id)) });
}
export async function updateTaskStatus(req, res) {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid task ID." });
  const { status } = req.body;
  if (!["To Do", "In Progress", "Completed", "Blocked"].includes(status)) return res.status(400).json({ success: false, message: "Invalid task status." });
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: "Task not found." });
  const project = await Project.findById(task.project);
  if (!project.owner.equals(req.user._id) && !task.assignedUser.equals(req.user._id)) return res.status(403).json({ success: false, message: "You are not permitted to update this task." });
  task.status = status;
  await task.save();
  res.json({ success: true, task: await populateTask(Task.findById(task._id)) });
}
export async function deleteTask(req, res) {
  if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid task ID." });
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: "Task not found." });
  const project = await Project.findById(task.project);
  if (!project.owner.equals(req.user._id)) return res.status(403).json({ success: false, message: "You are not permitted to delete this task." });
  await task.deleteOne();
  res.json({ success: true, message: "Task deleted." });
}
