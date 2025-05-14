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
