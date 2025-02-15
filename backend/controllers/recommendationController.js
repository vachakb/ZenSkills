const { spawn } = require("child_process");
const prisma = require("../models/prismaClient");
const path = require("path");

const getRecommendations = (req, res) => {
  const userType = req.user.role; // 'mentee' or 'mentor'
  const userId = req.user.id;

  const pythonScriptPath = path.join(
    ".",
    "services",
    "recommendation_model.py",
  );

  const pythonProcess = spawn("python", [pythonScriptPath, userType, userId]);

  pythonProcess.stdout.on("data", async (data) => {
    try {
      const result = JSON.parse(data.toString());

      if (result.recommendations && Array.isArray(result.recommendations)) {
        const mentorIds = result.recommendations.map((rec) => rec.mentor_id);
        const mentors = await prisma.mentor.findMany({
          where: {
            id: { in: mentorIds },
          },
          include: {
            User: true,
            expertise: true,
          },
        });

        const formattedRecommendations = mentors.map((mentor) => ({
          experienceYears: mentor.experience_years,
          experienceMonths: mentor.experience_months,
          creditScore: mentor.credit_score,
          title: mentor.mentor_job_title,
          id: mentor.id,
          name: mentor.User.name,
          noOfReviews: mentor.noOfReviews || 0, // TODO Add reviews logic
          noOfSessions: mentor.number_of_sessions,
          rating: mentor.rating,
          company: mentor.company,
        }));

        res.status(200).json({
          mentors: formattedRecommendations,
          totalMentorsCount: formattedRecommendations.length,
        });
        console.log("Recommendations sent for user", userId);
      } else {
        throw new TypeError("Result is not an array");
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.status(500).send("Error processing request");
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    // res.status(500).send("Error processing request");
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
  });
};

module.exports = {
  getRecommendations,
};
