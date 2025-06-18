const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userinfo = require("../model/userinfo");
require("dotenv").config();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email })
      .populate("departmentId")
      .populate("role");

    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userInfo = await userinfo.findOne({ userId: user._id });

    const fullUser = {
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.departmentId?.name || null,
      departmentId: user.departmentId?._id || null,
      role: user.role?.name || null,
      roleId: user.role?._id || null,
      homePhone: userInfo?.homephone || "",
      address: userInfo?.address || "",
      state: userInfo?.state || "",
      zip: userInfo?.zip || "",
      profilePicture: userInfo?.profilePicture || "",
    };

    // Sign JWT
    const token = jwt.sign(fullUser, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: fullUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { login, authenticate };
