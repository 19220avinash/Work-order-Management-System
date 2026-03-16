const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper: generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      name: user.name   // ✅ ADD THIS
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};


/* ===========================
   CUSTOMER REGISTER & LOGIN
=========================== */
exports.customerRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser)
      return res.status(400).json({ message: "Customer already exists" });

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: "CUSTOMER",
      isInternal: false
    });

    res.status(201).json({ message: "Customer Registered" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail, role: "CUSTOMER" });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   INTERNAL REGISTER & LOGIN
=========================== */
exports.internalRegister = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser)
      return res.status(400).json({ message: "Internal User already exists" });

    const user = await User.create({
      name,
      email: normalizedEmail,
      password, // hashed automatically by schema
      role,     // ADMIN, PLANNER, SUPERVISOR, OPERATOR
      isInternal: true
    });

    res.status(201).json({ message: "Internal User Registered" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.internalLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail, isInternal: true });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (role && user.role !== role) {
      return res.status(400).json({ message: "Invalid role for this user" });
    }

    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ===========================
   GET LOGGED-IN INTERNAL USER
=========================== */
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id; // set by auth middleware

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
