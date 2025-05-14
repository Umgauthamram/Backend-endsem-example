const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized: No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userName = decoded.userName;
    next();
  } catch (err) {
    res.status(403).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = userAuth;
