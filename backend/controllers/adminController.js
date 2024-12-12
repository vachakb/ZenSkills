const prisma = require("../models/prismaClient");

exports.getMentors = async (req, res) => {
  
}

exports.getMentorDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const mentorVerification = await prisma.MentorVerification.findUnique({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!mentorVerification) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.json(mentorVerification);
  } catch (error) {
    console.error("Error fetching mentor details:", error);
    res.status(500).json({ error: "Error fetching mentor details" });
  }
};

exports.verifyMentor = async (req, res) => {
  const { userId } = req.params;

  try {
    const mentorVerification = await prisma.MentorVerification.findUnique({
      where: { user_id: userId },
    });

    if (!mentorVerification) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { credentialsVerified: true },
    });

    res.json({ message: "Mentor verified successfully" });
  } catch (error) {
    console.error("Error verifying mentor:", error);
    res.status(500).json({ error: "Error verifying mentor" });
  }
};
