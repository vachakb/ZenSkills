const prisma = require("../models/prismaClient");

//controller to fetch total mentees mentored by mentor
const totalMenteeMentored = async (req, res) => {
    const userId = "e0124cb4-6a1e-41e4-a6dc-5d22adf1af21";
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
    const userId = "e0124cb4-6a1e-41e4-a6dc-5d22adf1af21";
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
  const userId = "e0124cb4-6a1e-41e4-a6dc-5d22adf1af21";
  try {
    const menteesMonthWise = await prisma.SessionBooking.groupBy({
      by: ["user_id", "date"],
      where: {
        session: {
          mentor:{
            user_id: userId,
          }
        },
      },
      _count: {
        user_id: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const formattedData = menteesMonthWise.reduce((acc, curr) => {
      const month = curr.date.toISOString().slice(0, 7); // Extract YYYY-MM
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += curr._count.user_id;
      return acc;
    }, {});

    res.json({ menteesMonthWise: formattedData });
  } catch (error) {
    console.error("Error fetching mentees mentored month-wise:", error);
    res.status(500).json({ error: "Error fetching mentees mentored month-wise" });
  }
};

//controller to fetch the mentor rating
const mentorRating = async(req,res) => {
    const userId = "e0124cb4-6a1e-41e4-a6dc-5d22adf1af21";
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
    const userId = "e0124cb4-6a1e-41e4-a6dc-5d22adf1af21";
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
        res.json({ completed, pending,rescheduled, rejected });
    } catch(error){
        console.error("Error fetching session distribution: ",error);
    }
}

// Controller to fetch new mentees mentored by the mentor per month
const newMenteesMentoredPerMonth = async (req, res) => {
    const userId = "e0124cb4-6a1e-41e4-a6dc-5d22adf1af21";
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

module.exports = {
  totalMenteeMentored,
  totalSessionsConducted,
  menteesMentoredMonthWise,
  mentorRating,
  sessionDistribution,
  newMenteesMentoredPerMonth,
};