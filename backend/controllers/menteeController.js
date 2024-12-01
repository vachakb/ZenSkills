const prisma = require("../models/prismaClient");

// Fetch mentee profile details
async function getMenteeProfile(req, res) {
  const { menteeId } = req.params;

  try {
    const mentee = await prisma.mentee.findUnique({
      where: { id: menteeId },
      include: {
        User: true,
        interests: true,
      },
    });

    if (!mentee) return res.status(404).json({ error: "Mentee not found" });

    const response = {
      name: mentee.User.name,
      bio: mentee.bio,
      occupation: mentee.company,
      title: mentee.mentee_title,
      interests: mentee.interests,
      education: mentee.education,
      isMentor: false,
      
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch mentee profile" });
  }
}

module.exports = {
  getMenteeProfile,
};
