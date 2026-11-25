import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { safeUser } from "../utils/safeUser.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const issueToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });

export async function register(req, res) {
  const { firstName, lastName, username, email, password, confirmPassword } = req.body;
  if (![firstName, lastName, username, email, password, confirmPassword].every(v => typeof v === "string" && v.trim())) {
    return res.status(400).json({ success: false, message: "All registration fields are required." });
  }
  if (!emailPattern.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address." });
  if (password.length < 8) return res.status(400).json({ success: false, message: "Password must contain at least 8 characters." });
  if (password !== confirmPassword) return res.status(400).json({ success: false, message: "Passwords do not match." });
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findOne({ $or: [{ username: normalizedUsername }, { email: normalizedEmail }] })) {
    return res.status(409).json({ success: false, message: "Username or email is already registered." });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ firstName: firstName.trim(), lastName: lastName.trim(), username: normalizedUsername, email: normalizedEmail, passwordHash });
  res.status(201).json({ success: true, message: "Registration successful. Please log in.", user: safeUser(user) });
}

export async function login(req, res) {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json({ success: false, message: "Username/email and password are required." });
  const key = identifier.trim().toLowerCase();
  const user = await User.findOne({ $or: [{ username: key }, { email: key }] }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ success: false, message: "Invalid username/email or password." });
  }
  res.json({ success: true, token: issueToken(user), user: safeUser(user) });
}

export async function me(req, res) {
  res.json({ success: true, user: safeUser(req.user) });
}
