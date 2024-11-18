const jwt = require("jsonwebtoken");
const prisma = require("../models/prismaClient");

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, expiresAt } = decoded;
    const now = new Date();
    // Retrieve the user from the tempUser table
    const tempUser = await prisma.tempuser.findUnique({ where: { email } });
    if (!tempUser) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    if (now > new Date(expiresAt)) {
      return res
        .status(400)
        .json({ message: "Verification link has expired." });
    }

    // Move user data to the User table
    const user = await prisma.user.create({
      data: {
        email: tempUser.email,
        password_hash: tempUser.password_hash,
        role: tempUser.role,
        created_date: new Date(),
        is_deleted: false,
        status: "active",
        is_verified: true,
      },
    });
    console.log("User record created for email:", email);

    console.log("role:", tempUser.role);

    if (tempUser.role === "mentor") {
      await prisma.mentor.create({
        data: {
          uid: user.uid,
          bio: null,
          name: "",
          experience_years: 0, // Default value
          number_of_mentees_mentored: 0, // Default value
          mentor_job_title: "Unknown",
          company: "Unknown",
        },
      });
      console.log("Mentor record created for email:", email);
    }

    if (tempUser.role === "mentee") {
      await prisma.mentee.create({
        data: {
          name: "",
          uid: user.uid,
          bio: null,
        },
      });
      console.log("Mentee record created for email:", email);
    }

    // Delete temporary user
    await prisma.tempuser.delete({ where: { email } });
    console.log("Email verification successfull for email:", email);
    res.status(200).json({
      message: "Email verified successfully.",
      email: tempUser.email, // Include email and any other info you want to send to frontend
      status: "verified",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

module.exports = { verifyEmail };
