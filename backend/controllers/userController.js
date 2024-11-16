const prisma = require("../models/prismaClient");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { uid: req.user.id },
      include: { mentee: true, mentor: true },  // Include related data
    });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch user profile." });
  }
};
