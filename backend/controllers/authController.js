const prisma = require("../models/prismaClient");
const nodemailer = require("nodemailer");
const LocalStrategy = require("passport-local");
const argon2 = require("argon2");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

exports.login = new LocalStrategy(
  { usernameField: "email", passReqToCallback: true },
  async (req, email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { account_id: { email, role: req.role } },
      });

      if (!user) {
        done(null, false);
        return;
      }

      if (await argon2.verify(user.password, password)) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err);
    }
  },
);

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

exports.googleCallback = async (req, done) => {
  const { token, role } = req.body;

  try {
    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId } = payload;

    let user = await prisma.user.findUnique({
      include: {
        mentee: role === "mentee",
        mentor: role === "mentor",
      },
      where: {
        account_id: {
          email,
          role,
        },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          googleId,
          status: "active",
          is_deleted: false,
          // phone_number: "0000000000",
          // location: "Unknown",
          password: "",
          role,
          // created_at: new Date(),
        },
      });
    }

    if (role === "mentor" && user.mentor) {
      req.isRegistered = true;
    } else if (role === "mentee" && user.mentee) {
      req.isRegistered = true;
    } else {
      req.isRegistered = false;
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
};

exports.logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
};
