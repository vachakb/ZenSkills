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
      statistics: {
        totalUsers: totalMentors + totalMentees,
        totalMentors,
        activeUsers: totalMentors + totalMentees - pendingVerifications,
      },
      monthlyGrowth: monthlyGrowthData,
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
      statistics: {
        totalSessions,
        completedSessions,
        pendingSessions: totalSessions - completedSessions - upcomingSessions,
        cancelledSessions: 0, // Assuming no cancelled sessions for now
      },
      recentSessions: recentSessions.map((session) => ({
        date: session.date,
        mentor: {
          name: session.session.mentor.User.name,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching session analytics:", error);
    res.status(500).json({ error: "Error fetching session analytics" });
  }
};

// Workshop Analytics
exports.getWorkshopAnalytics = async (req, res) => {
  try {
    // Get workshop statistics
    const [totalWorkshops, activeWorkshops, participantCount] =
      await Promise.all([
        prisma.workshops.count(),
        prisma.workshops.count({
          where: {
            date: {
              gte: new Date(),
            },
            status: "upcoming",
          },
        }),
        prisma.WorkshopBooking.count(),
      ]);

    // Get popular workshops
    const popularWorkshops = await prisma.workshops.findMany({
      take: 5,
      include: {
        mentor: {
          include: {
            User: true,
          },
        },
        _count: {
          select: {
            WorkshopBooking: true, // Changed to match schema relation name
          },
        },
      },
      orderBy: {
        WorkshopBooking: {
          _count: "desc",
        },
      },
    });

    // Get status distribution
    const statusDistribution = await prisma.workshops.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Return workshop analytics
    res.json({
      statistics: {
        totalWorkshops,
        activeWorkshops,
      },
      statusDistribution: statusDistribution.map((status) => ({
        status: status.status,
        count: status._count.status,
      })),
      popularWorkshops: popularWorkshops.map((workshop) => ({
        id: workshop.id,
        title: workshop.title,
        date: workshop.date,
        participantCount: workshop._count.WorkshopBooking,
        mentor: workshop.mentor?.User?.name || "N/A",
        status: workshop.status,
      })),
    });
  } catch (error) {
    console.error("Error fetching workshop analytics:", error);
    res.status(500).json({
      error: "Error fetching workshop analytics",
      details: error.message,
    });
  }
};
