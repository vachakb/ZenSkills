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

// User Analytics
exports.getUserAnalytics = async (req, res) => {
  try {
    const [totalMentors, totalMentees, pendingVerifications, userGrowth] =
      await Promise.all([
        prisma.user.count({
          where: { role: "mentor" },
        }),
        prisma.user.count({
          where: { role: "mentee" },
        }),
        prisma.user.count({
          where: {
            role: "mentor",
            credentialsVerified: false,
          },
        }),
        prisma.user.count({
          where: {
            created_at: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            },
          },
        }),
      ]);

    const monthlyGrowthData = await prisma.user.groupBy({
      by: ["created_at"],
      where: {
        created_at: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        },
      },
      _count: {
        id: true,
      },
    });

    res.json({
      totalMentors,
      totalMentees,
      pendingVerifications,
      monthlyGrowth: userGrowth,
      monthlyGrowthData: monthlyGrowthData,
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res.status(500).json({ error: "Error fetching user analytics" });
  }
};

// Session Analytics
exports.getSessionAnalytics = async (req, res) => {
  try {
    const [totalSessions, completedSessions, upcomingSessions] =
      await Promise.all([
        prisma.sessionBooking.count(),
        prisma.sessionBooking.count({
          where: { status: "completed" },     //TODO: Change status enum 
        }),
        prisma.sessionBooking.count({
          where: {
            date: {
              gte: new Date(),
            },
          },
        }),
      ]);

    const recentSessions = await prisma.sessionBooking.findMany({
      take: 5,
      orderBy: { date: "desc" },
      include: {
        session: {
          include: {
            mentor: {
              include: {
                User: true,
              },
            },
          },
        },
        user: true,
      },
    });

    res.json({
      totalSessions,
      completedSessions,
      upcomingSessions,
      recentSessions,
      completionRate: ((completedSessions / totalSessions) * 100).toFixed(2),
    });
  } catch (error) {
    console.error("Error fetching session analytics:", error);
    res.status(500).json({ error: "Error fetching session analytics" });
  }
};
