const prisma = require("../models/prismaClient");

// Fetch mentee profile details
async function getMenteeProfile(req, res) {
  const { menteeId } = req.params;

  try {
    const mentee = await prisma.mentee.findUnique({
      where: { mentee_id: menteeId },
      include: {
        User: true,
        mentee_interests: { include: { tags: true } },
      },
    });

    if (!mentee) return res.status(404).json({ error: "Mentee not found" });

    const response = {
      name: mentee.name,
      bio: mentee.bio,
      occupation: mentee.company,
      title: mentee.mentee_title,
      interests: mentee.mentee_interests.map((i) => i.tags.tag_name),
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
