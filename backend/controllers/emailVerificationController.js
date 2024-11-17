const jwt = require("jsonwebtoken");
const prisma = require("../models/prismaClient");

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    // Decode and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;
    // Retrieve the user from the tempUser table
    const tempUser = await prisma.tempuser.findUnique({ where: { email } });
    if (!tempUser) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Move user data to the User table
    await prisma.user.create({
      data: {
        email: tempUser.email,
        password_hash: tempUser.password_hash,
        role: tempUser.role,
        created_date: new Date(),
        name: "",
        is_deleted: false,
        status: "active",
      },
    });

    // Delete temporary user
    await prisma.tempuser.delete({ where: { email } });
    console.log("Email verification successfull for email:", email);
    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token." });
  }
};

module.exports = { verifyEmail };
