const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Compare password. Support legacy plaintext passwords by migrating them.
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcryptjs.compare(password, user.password);
    } catch (e) {
      isPasswordValid = false;
    }

    // If bcrypt compare failed and stored password doesn't look hashed, try plaintext compare and migrate
    if (!isPasswordValid) {
      const looksHashed =
        typeof user.password === "string" && user.password.startsWith("$2");
      if (!looksHashed && password === user.password) {
        // Migrate: hash the plaintext password and save
        const newHash = await bcryptjs.hash(password, 10);
        user.password = newHash;
        await user.save();
        isPasswordValid = true;
      }
    }

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const jwtSecret = process.env.JWT_SECRET || "dev_jwt_secret";

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
