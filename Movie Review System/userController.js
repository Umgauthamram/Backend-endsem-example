const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userData = [];

const register = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) return res.status(400).json({ message: "All fields are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    userData.push({ id: Date.now(), userName, password: hashedPassword, reviews: [] });
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) return res.status(400).json({ message: "All fields are required" });

  const user = userData.find(u => u.userName === userName);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.status(200).json({ message: `Welcome ${userName}` });
};

const postReview = async (req, res) => {
  const { movieTitle, rating, reviewText } = req.body;
  if (!movieTitle || !rating || !reviewText) return res.status(400).json({ message: "All fields are required" });

  const user = userData.find(u => u.userName === req.user.userName);
  user.reviews.push({ movieTitle, rating, reviewText });

  res.status(200).json({ message: "Review added successfully" });
};

const getReviews = async (req, res) => {
  const user = userData.find(u => u.userName === req.user.userName);
  res.status(200).json({ reviews: user.reviews });
};

module.exports = { register, login, postReview, getReviews };
