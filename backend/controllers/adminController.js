const prisma = require("../models/prismaClient");

exports.getMentorsToVerify = async (req, res) => {
  try {
    const mentors = await prisma.User.findMany({
      include: {
        MentorVerification: {
          include: {
            government_id: true,
            degree_certificate: true,
            additional_file: true,
          },
        },
      },
      where: {
        credentialsVerified: false,
        MentorVerification: {
          isNot: null,
        },
      },
    });

    res.json({ mentors });
  } catch (error) {
    console.error("Error fetching all mentors:", error);
    res.status(500).json({ error: "Error fetching all mentors" });
  }
};

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

exports.deleteMentor = async (req, res) => {
  const { userId } = req.params;

  try {
    await prisma.User.delete({
      where: {
        id: userId,
      },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};
