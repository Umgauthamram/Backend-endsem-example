const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = [];
const bugs = [];

const register = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) return res.status(400).json({ message: "All fields required" });

  const existingUser = users.find(u => u.userName === userName);
  if (existingUser) return res.status(409).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ userName, password: hashedPassword });

  res.status(201).json({ message: "Registered successfully" });
};

const login = async (req, res) => {
  const { userName, password } = req.body;

  const user = users.find(u => u.userName === userName);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });

  res.status(200).json({ message: `Welcome ${userName}` });
};

const postBug = (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) return res.status(400).json({ message: "All fields required" });

  const exists = bugs.find(bug => bug.userName === req.userName && bug.title === title);
  if (exists) return res.status(409).json({ message: "Bug title already submitted" });

  bugs.push({ userName: req.userName, title, description });
  res.status(201).json({ message: "Bug submitted successfully" });
};

const getBugs = (req, res) => {
  const myBugs = bugs.filter(bug => bug.userName === req.userName);
  res.status(200).json({ bugs: myBugs });
};

module.exports = { register, login, postBug, getBugs };
