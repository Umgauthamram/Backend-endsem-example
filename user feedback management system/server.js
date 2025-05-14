const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", feedbackRoutes);

app.get("/", (req, res) => {
    res.send("Event Registration & Feedback System API is running...");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running  http://localhost:${PORT}`);
});
