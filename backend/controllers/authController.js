const prisma = require("../models/prismaClient");
const nodemailer = require("nodemailer");
const LocalStrategy = require("passport-local");
const argon2 = require("argon2");
const { google } = require("googleapis");

const googleAuthClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CLIENT_REDIRECT_URI,
);

google.options({ auth: googleAuthClient });

const googlePeopleClient = google.people("v1");

const sendVerificationEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  const verificationUrl = `http://localhost:5173/verify/callback?token=${token}&role=${user.role}`;

  await transporter.sendMail({
    from: '"Mentoring Platform" <no-reply@example.com>',
    to: user.email,
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
    const { role } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { account_id: { email, role } },
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
    (await prisma.user.existsUnique({ account_id: { email, role } })) ||
    (await prisma.tempuser.existsUnique({ account_id: { email, role } }))
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
  return sendVerificationEmail(user, token);
};

exports.verifyEmail = async (user) => {
  const tempuser = await prisma.tempuser.findUnique({
    where: {
      account_id: {
        email: user.email,
        role: user.role,
      },
    },
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

  await prisma.tempuser.delete({ where: { id: tempuser.id } });

  return newUser;
};

async function getGoogleEmailAddress() {
  const response = await googlePeopleClient.people.get({
    resourceName: "people/me",
    personFields: "emailAddresses",
  });

  return response.data.emailAddresses[0].value;
}

exports.googleCallback = async (req, done) => {
  const { code, role } = req.body;

  try {
    const { tokens } = await googleAuthClient.getToken(code);
    googleAuthClient.setCredentials(tokens);

    const email = await getGoogleEmailAddress();

    const user = await prisma.user.upsert({
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
      update: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiryDate: new Date(tokens.expiry_date),
      },
      create: {
        email,
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiryDate: new Date(tokens.expiry_date),
        status: "active",
        is_deleted: false,
        password: "",
        role,
      },
    });

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
