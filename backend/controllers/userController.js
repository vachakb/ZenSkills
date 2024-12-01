const prisma = require("../models/prismaClient");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { mentee: true, mentor: true },
      omit: {
        password: true,
        googleId: true,
        created_at: true,
        is_deleted: true,
        is_verified: true,
      },
    });
    res.json({ profile: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch user profile." });
  }
};
