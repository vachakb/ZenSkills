const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prismaClient");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Utility: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.uid, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password_hash) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });
    res.json({ success: true, token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

// Register
exports.register = async (req, res) => {
  const { email, password, role, gender, name, phone_number, location } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        role,
        gender,
        name,
        phone_number,
        location,
        is_deleted: false,
        status: "active",  // Default status set to 'active'
      },
    });

    res.json({ success: true, user });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "Email already exists." });
    }
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};

// Google OAuth Callback
exports.googleCallback = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId } = payload;

    // Look for the user by email (use correct primary key)
    let user = await prisma.user.findUnique({
      where: { email },  // Ensure you're looking by the correct field
    });

    if (!user) {
      // If the user doesn't exist, create a new one
      user = await prisma.user.create({
        data: {
          email,
          googleId, // You might need to add googleId in your User model schema
          role: "mentee", // Default role
          status: "active", // Default status
          is_deleted: false,
          gender: "prefer_not_to_say", // Example default
          name: payload.name || "Unknown", // Default name
          phone_number: "0000000000", // Default phone number
          location: "Unknown", // Default location
          password_hash: "",
          created_date: new Date(),
        },
      });
    }

    // Generate JWT token for the authenticated user
    const jwtToken = generateToken(user);
    res.json({
      success: true,
      token: jwtToken,
      role: user.role,
      user,
    });
  } catch (err) {
    console.error("Error verifying Google token:", err);
    res.status(400).json({ error: "Invalid Google token." });
  }
};