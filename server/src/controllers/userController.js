import User from "../models/User.js";
export async function listUsers(req, res) {
  const users = await User.find({ _id: { $ne: req.user._id } })
    .select("firstName lastName username email")
    .sort({ firstName: 1 });
  res.json({
    success: true,
    users: users.map((u) => ({
      id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      username: u.username,
      email: u.email,
    })),
  });
}
