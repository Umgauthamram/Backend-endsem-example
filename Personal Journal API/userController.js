const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
require('dotenv').config();

const users = [];
const journals = [];

const register = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) return res.status(400).json({ message: "All fields required" });

    const exists = users.find(u => u.userName === userName);
    if (exists) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ userName, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = users.find(u => u.userName === userName);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });

    res.status(200).json({ message: `Welcome ${userName}` });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const createJournal = (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "All fields required" });

    const newEntry = {
      id: uuid(),
      userName: req.userName,
      title,
      content
    };
    journals.push(newEntry);
    res.status(201).json({ message: "Journal entry created", entry: newEntry });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const getJournals = (req, res) => {
  try {
    const userEntries = journals.filter(j => j.userName === req.userName);
    res.status(200).json({ journals: userEntries });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

const updateJournal = (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const journal = journals.find(j => j.id === id && j.userName === req.userName);
    if (!journal) return res.status(404).json({ message: "Journal entry not found" });

    if (title) journal.title = title;
    if (content) journal.content = content;

    res.status(200).json({ message: "Journal updated", journal });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

module.exports = { register, login, createJournal, getJournals, updateJournal };
