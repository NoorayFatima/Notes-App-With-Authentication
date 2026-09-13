const jwt = require("jsonwebtoken");

// One place that knows how tokens are signed. Anything that needs to
// issue a token (register, login) calls this instead of repeating the
// jwt.sign() call and its options everywhere.
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

module.exports = generateToken;
