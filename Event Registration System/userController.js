const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userData = [];      // Stores { id, userName, password }
const eventData = [];     // Stores { userName, eventName }

const register = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const existingUser = userData.find(user => user.userName === userName);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  userData.push({ id: Date.now(), userName, password: hashedPassword });

  res.cookie('user', userName, { maxAge: 60 * 60 * 1000 });
  res.status(201).json({ message: "Registered successfully" });
};

const login = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = userData.find(u => u.userName === userName);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });

  res.status(200).json({ message: `Welcome ${userName}` });
};

const registerEvent = (req, res) => {
  const { eventName } = req.body;
  if (!eventName) {
    return res.status(400).json({ message: "Event name required" });
  }

  eventData.push({ userName: req.userName, eventName });
  res.status(200).json({ message: `Registered for event: ${eventName}` });
};

const getMyEvents = (req, res) => {
  const myEvents = eventData.filter(event => event.userName === req.userName);
  res.status(200).json({ events: myEvents });
};

module.exports = { register, login, registerEvent, getMyEvents };
