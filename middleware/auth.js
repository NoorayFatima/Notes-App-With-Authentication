const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protects a route: only lets the request through if it carries a valid
// JWT in the Authorization header, in the form "Bearer <token>".
// On success, req.user is set so downstream handlers know who's asking.
async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Look the user up fresh on every request (rather than trusting the
    // token's payload alone) so a deleted account is rejected immediately.
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user no longer exists",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token is invalid or expired",
    });
  }
}

module.exports = { protect };
