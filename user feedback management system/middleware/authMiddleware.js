const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.username = decoded.username;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
};

module.exports = authenticate;
