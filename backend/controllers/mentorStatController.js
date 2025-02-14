const prisma = require("../models/prismaClient");

//controller to fetch total mentees mentored by mentor
const totalMenteeMentored = async (req, res) => {
    const userId = req.user.id;
    try {
      const totalMentees = await prisma.SessionBooking.findMany({
        where: {
          session: {
            mentor: {
              user_id: userId,
            },
          },
          status: "completed",
        },
        distinct: ["user_id"],
      });
  
      res.json({ totalMentees: totalMentees.length });
    } catch (error) {
      console.error("Error fetching total mentees mentored:", error);
      res.status(500).json({ error: "Error fetching total mentees mentored" });
    }
  };

  const totalSessionsConducted = async(req,res) => {
    const userId = req.user.id;
    try{
        const totalSessions = await prisma.SessionBooking.count({
            where: {
                session: {
                    mentor: {
                        user_id: userId,
                    }
                },
                status: "completed",
            }
        });
        res.json({ totalSessions });
    } catch(error){
        console.error("Error fetching total sessions conducted:", error);
        res.status(500).json({ error: "Error fetching total sessions conducted" });
    }
  }


//controller to fetch mentees mentored by mentor month-wise
const menteesMentoredMonthWise = async (req, res) => {
  const userId = req.user.id;
  try {
    // Fetch all completed sessions for the mentor
    const sessions = await prisma.SessionBooking.findMany({
      where: {
        session: {
          mentor: {
            user_id: userId,
          }
        },
        status: "completed",
      },
      select: {
        user_id: true,
        date: true,
      },
      orderBy: {
        date: "asc",
      },
      distinct: ["user_id"], // Add this to get unique mentees only
    });

    // Create monthly data with unique mentees
    const monthlyData = sessions.reduce((acc, session) => {
      const month = session.date.toISOString().slice(0, 7); // YYYY-MM format
      
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += 1; // Count each unique mentee once per month
      return acc;
    }, {});

    res.json({ menteesMonthWise: monthlyData });
  } catch (error) {
    console.error("Error fetching mentees mentored month-wise:", error);
    res.status(500).json({ error: "Error fetching mentees mentored month-wise" });
  }
};

//controller to fetch the mentor rating
const mentorRating = async(req,res) => {
    const userId = req.user.id;
    try{
        const rating = await prisma.mentor.findUnique({
            where: {
                user_id: userId,
            },
            select: {
                rating: true,
            }
        });
        res.json({ mentorRating: rating })
    } catch(error) {
        console.error("Error fetching mentor rating", error);
        res.status(500).json({ error: "Error fetching mentor rating" });
    }
}

//controller to fetch session distribution
const sessionDistribution = async(req,res) => {
    const userId = req.user.id;
    try{
        const completed = await prisma.SessionBooking.count({
            where: {
                session: {
                    mentor: {
                        user_id: userId,
                    },
                },
                status: "completed",
            },
        });
        const pending = await prisma.SessionBooking.count({
            where: {
                session: {
                    mentor: {
                        user_id: userId,
                    },
                },
                status: "pending",
            },
        });
        const rescheduled = await prisma.SessionBooking.count({
            where: {
                session: {
                    mentor: {
                        user_id: userId,
                    },
                },
                status: "rescheduled",
            },
        });
        const rejected = await prisma.SessionBooking.count({
            where: {
                session: {
                    mentor: {
                        user_id: userId,
                    },
                },
                status: "rejected",
            },
        });
        const cancelled = await prisma.SessionBooking.count({
          where: {
              session: {
                  mentor: {
                      user_id: userId,
                  },
              },
              status: "cancelled",
          },
      });
        res.json({ completed, pending, rescheduled, rejected, cancelled });
    } catch(error){
        console.error("Error fetching session distribution: ",error);
    }
}

// Controller to fetch new mentees mentored by the mentor per month
const newMenteesMentoredPerMonth = async (req, res) => {
    const userId = req.user.id;
    try {
      const mentees = await prisma.SessionBooking.findMany({
        where: {
          session: {
            mentor: {
              user_id: userId,
            },
          },
          status: "completed",
        },
        select: {
          user_id: true,
          date: true,
        },
        orderBy: {
          date: "asc",
        },
      });
  
      const firstMentoredDates = {};
      const newMenteesPerMonth = {};
  
      mentees.forEach((mentee) => {
        const month = mentee.date.toISOString().slice(0, 7); // Extract YYYY-MM
        if (!firstMentoredDates[mentee.user_id]) {
          firstMentoredDates[mentee.user_id] = month;
          if (!newMenteesPerMonth[month]) {
            newMenteesPerMonth[month] = 0;
          }
          newMenteesPerMonth[month] += 1;
        }
      });
  
      res.json({ newMenteesPerMonth });
    } catch (error) {
      console.error("Error fetching new mentees mentored per month:", error);
      res.status(500).json({ error: "Error fetching new mentees mentored per month" });
    }
  };

// Controller to calculate total revenue earned by the mentor
const totalRevenueEarned = async (req, res) => {
  const userId = req.user.id;
  try {
    const totalEarned = await prisma.Transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        user_id: userId,
        type: "EARN",
      },
    });

    const totalRefunded = await prisma.Transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        user_id: userId,
        type: "RETURN",
      },
    });

    const totalRevenue = (totalEarned._sum.amount || 0) - (totalRefunded._sum.amount || 0);

    res.json({ totalRevenue });
  } catch (error) {
    console.error("Error fetching total revenue earned:", error);
    res.status(500).json({ error: "Error fetching total revenue earned" });
  }
};

// Controller to calculate monthly revenue trend for the mentor
const monthlyRevenueTrend = async (req, res) => {
  const userId = req.user.id;
  try {
    const earnedTransactions = await prisma.Transaction.groupBy({
      by: ['created_at'],
      _sum: {
        amount: true,
      },
      where: {
        user_id: userId,
        type: "EARN",
      },
      orderBy: {
        _sum: {
          amount: 'asc',
        },
      },
    });

    const refundedTransactions = await prisma.Transaction.groupBy({
      by: ['created_at'],
      _sum: {
        amount: true,
      },
      where: {
        user_id: userId,
        type: "RETURN",
      },
      orderBy: {
        _sum: {
          amount: 'asc',
        },
      },
    });

    const monthlyRevenue = {};

    earnedTransactions.forEach((transaction) => {
      const month = transaction.created_at.toISOString().slice(0, 7); // YYYY-MM format
      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = 0;
      }
      monthlyRevenue[month] += transaction._sum.amount;
    });

    refundedTransactions.forEach((transaction) => {
      const month = transaction.created_at.toISOString().slice(0, 7); // YYYY-MM format
      if (!monthlyRevenue[month]) {
        monthlyRevenue[month] = 0;
      }
      monthlyRevenue[month] -= transaction._sum.amount;
    });

    res.json({ monthlyRevenue });
  } catch (error) {
    console.error("Error fetching monthly revenue trend:", error);
    res.status(500).json({ error: "Error fetching monthly revenue trend" });
  }
};

module.exports = {
  totalMenteeMentored,
  totalSessionsConducted,
  menteesMentoredMonthWise,
  mentorRating,
  sessionDistribution,
  newMenteesMentoredPerMonth,
  totalRevenueEarned,
  monthlyRevenueTrend,
};