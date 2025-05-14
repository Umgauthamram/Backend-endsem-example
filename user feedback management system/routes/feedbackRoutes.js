const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { postFeedback, getFeedback } = require("../controllers/feedbackController");

router.post("/feedback", authenticateToken, postFeedback);
router.get("/feedback", authenticateToken, getFeedback);

module.exports = router;
