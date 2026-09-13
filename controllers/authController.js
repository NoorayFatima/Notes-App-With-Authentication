const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Never send the password hash back to the client, even by accident.
function publicUser(user) {
  return { id: user._id, username: user.username, email: user.email };
}

// POST /api/auth/register
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Hash the password before it ever touches the database. The salt
    // adds random data to the hash so two identical passwords never
    // produce the same stored hash.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // The schema marks password as select:false, so it has to be asked
    // for explicitly here.
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      "+password"
    );

    // Deliberately vague error for both "no such user" and "wrong password"
    // — telling an attacker which one is true is a minor information leak.
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to log in",
      error: error.message,
    });
  }
}

// GET /api/auth/me
// Protected route used by the frontend on page load to check "is my
// stored token still valid, and who am I?".
async function getMe(req, res) {
  res.status(200).json({
    success: true,
    user: publicUser(req.user),
  });
}

module.exports = { register, login, getMe };
