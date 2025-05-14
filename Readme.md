npm i express dotenv bcryptjs jsonwebtoken cookie-parser

SERVER.js

const express = require('express');
const cookieParser = require('cookie-parser');
const route = require('./route');
require('dotenv').config();

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cookieParser());
app.use('/api', route);

app.get('/', (req, res) => res.send('Server running...'));

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

MIDDLEWARE.JS

const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(403).json({ message: "Unauthorized: Invalid token" });
        }

        req.userName = decoded.userName; 
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized", error });
    }
};

module.exports = userAuth;


userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const userData = [];

const register = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = userData.find(user => user.userName === userName);
    if (existingUser) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    userData.push({ id: Date.now(), userName, password: hashedPassword, feedbacks: [] });

    res.cookie('cookie', userName, { maxAge: 60 * 60 * 1000 });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = userData.find(u => u.userName === userName);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ userName }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.status(200).json({ message: `Welcome ${userName}` });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

const feedBack = async (req, res) => {
  const { serviceName, feedBack } = req.body;

  if (!serviceName || !feedBack) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = userData.find(user => user.userName === req.userName);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.feedbacks.push({ serviceName, feedBack });

    res.status(200).json({ message: "Feedback submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

const getFeed = async (req, res) => {
  try {
    const user = userData.find(user => user.userName === req.userName);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ feedbacks: user.feedbacks });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

module.exports = { register, login, feedBack, getFeed };


routes.js

const express = require('express');
const router = express.Router();
const { register, login, feedBack, getFeed } = require('./userController');
const userAuth = require('./middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/feedBack', userAuth, feedBack);
router.get('/getFeed', userAuth, getFeed);

module.exports = router;
