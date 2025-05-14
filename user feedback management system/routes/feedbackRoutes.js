const express = require("express");
const router = express.Router();
const { postFeedback, getFeedback } = require("../controllers/feedbackController");
const authenticate = require("../middleware/authMiddleware"); 

router.post("/feedback", authenticate, postFeedback);
router.get("/feedback", authenticate, getFeedback);

module.exports = router;
