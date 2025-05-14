npm install express cookie-parser bcrypt jsonwebtoken dotenv


SERVER.js
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api", feedbackRoutes);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



models/User.js

class User {
    constructor({ username, hashedPassword }) {
        this.username = username;
        this.hashedPassword = hashedPassword;
        this.feedbacks = [];
    }
}

const users = [];

module.exports = { User, users };



middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Missing token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.username = decoded.username;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

module.exports = authenticateToken;


controllers/authController.js


const { User, users } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const existing = users.find(u => u.username === username);

        if (existing) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, hashedPassword });
        users.push(newUser);

        res.cookie("username", username, { httpOnly: true });
        return res.status(200).json({ message: "User registered successfully." });
    } catch (err) {
        console.error("Register Error:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.cookie("token", token, { httpOnly: true });
        return res.status(200).json({ message: "User logged in." });
    } catch (err) {
        console.error("Login Error:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
};



controllers/feedbackController.js

const { users } = require("../models/User");

exports.postFeedback = (req, res) => {
    const { service_name, feedback_text } = req.body;
    const user = users.find(u => u.username === req.username);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.feedbacks.push({ service_name, feedback_text });
    res.status(200).json({ message: "Feedback submitted" });
};

exports.getFeedback = (req, res) => {
    const user = users.find(u => u.username === req.username);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ feedbacks: user.feedbacks });
};


routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

module.exports = router;


routes/feedbackRoutes.js

const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { postFeedback, getFeedback } = require("../controllers/feedbackController");

router.post("/feedback", authenticateToken, postFeedback);
router.get("/feedback", authenticateToken, getFeedback);

module.exports = router;
