const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prismaClient");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const nodemailer = require("nodemailer");
const validator = require("validator");
const LocalStrategy = require("passport-local");
const argon2 = require("argon2");

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  const verificationUrl = `http://localhost:5173/verify/callback?token=${token}`;

  await transporter.sendMail({
    from: '"Mentoring Platform" <no-reply@example.com>',
    to: email,
    subject: "Email Verification",
    html: `
      <h2>Verify Your Email</h2>
      <p>Please click the link below to verify your email:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `,
  });
};

// Utility: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.uid, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};

exports.login = new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: email },
    });

    if (await argon2.verify(user.password, password)) {
      done(null, user);
    } else {
      throw Error("Unauthorized");
    }
  },
);

// TODO validation, error handling
exports.register = async (req, res) => {
  const { email, password, phoneNum, role } = req.body;

  if (
    (await prisma.user.exists({ email: email })) ||
    (await prisma.tempuser.exists({ email: email }))
  ) {
    return res.sendStatus(409);
  }

  const hashedPassword = await argon2.hash(password);

  try {
    await prisma.tempuser.create({
      data: {
        email: email,
        password: hashedPassword,
        phone_number: phoneNum,
        role: role,
      },
    });

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

exports.sendEmail = (user, token) => {
  return sendVerificationEmail(user.email, token);
};

exports.verifyEmail = async (user) => {
  const tempuser = await prisma.tempuser.findUnique({
    where: { email: user.email },
  });

  const newUser = await prisma.user.create({
    data: {
      email: tempuser.email,
      password: tempuser.password,
      phone_number: tempuser.phone_number,
      role: tempuser.role,
      is_deleted: false,
      status: "active",
      is_verified: true,
    },
  });

  await prisma.tempuser.delete({ where: { email: tempuser.email } });

  return newUser;
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
