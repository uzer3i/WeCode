const User = require("../models/user.model");
const generateToken = require("../utils/token.util");

/**
 * - Register user controller
 * - POST - /api/auth/register
 */
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isExists = await User.findOne({ email });

    if (isExists) {
      return res.status(400).json({ message: "User already Exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: token
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(401).json({ message: "User not registered" });

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: token
    });
  } catch (e) {
    res.status(500).json({
      message: "Server Error",
      error: e.message,
    });
  }
}

// ✅ LOGOUT
const logoutUser = async (req, res) => {
  try {
    // JWT is stateless → server kuch delete nahi karta

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
