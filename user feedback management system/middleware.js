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
