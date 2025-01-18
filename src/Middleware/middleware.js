const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    res.status(403).json({ message: 'Invalid Token' });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!req.user || !req.user.UserInfo || !roles.includes(req.user.UserInfo.role)) {
    return res.status(403).json({ message: "Forbidden. You do not have the necessary permissions." });
  }
  next();
};

module.exports = { authenticate, authorize };
