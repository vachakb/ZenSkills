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
  const { email, password, role } = req.body; // Get email, password, and role (Mentor/Mentee)
  console.log("Login request:", req.body);
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    if (user.role !== role) {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role }, // Payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );
    
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // Save token in a cookie
    return res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
  
};

// Register
exports.register = async (req, res) => {
  const { email, password, role, gender, name, phone_number, location } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email,
        password_hash: hashedPassword,
        role: role,
        name: "",
        is_deleted: false,
        status: "active", 
        created_date: new Date(),
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

    
    let user = await prisma.user.findUnique({
      where: { email },  
    });

    if (!user) {
      
      user = await prisma.user.create({
        data: {
          email,
          googleId, 
          role: "mentee", 
          status: "active", 
          is_deleted: false,
          gender: "prefer_not_to_say", 
          name: payload.name || "Unknown", 
          phone_number: "0000000000", 
          location: "Unknown", 
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