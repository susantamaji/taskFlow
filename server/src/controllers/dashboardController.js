import Project from "../models/Project.js";
import Task from "../models/Task.js";

export async function dashboard(req, res) {
  const projects = await Project.find({ owner: req.user._id }).select("_id");
  const projectIds = projects.map(p => p._id);
  const [projectTasks, assignedTasks, recentTasks] = await Promise.all([
    Task.countDocuments({ project: { $in: projectIds } }),
    Task.find({ assignedUser: req.user._id }),
    Task.find({ $or: [{ project: { $in: projectIds } }, { assignedUser: req.user._id }] })
      .sort({ updatedAt: -1 }).limit(5)
      .populate("project", "name").populate("assignedUser", "firstName lastName")
  ]);
  const statusCounts = { "To Do": 0, "In Progress": 0, "Completed": 0, "Blocked": 0 };
  assignedTasks.forEach(t => { statusCounts[t.status] = (statusCounts[t.status] || 0) + 1; });
  res.json({ success: true, stats: {
    projects: projects.length, projectTasks, assignedTasks: assignedTasks.length, statusCounts
  }, recentTasks });
}
