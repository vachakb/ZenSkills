const { spawn } = require("child_process");
const prisma = require("../models/prismaClient");

const getRecommendations = (req, res) => {
    const userType = req.body.role; // 'mentee' or 'mentor'
    const userId = req.body.user_id;

    // Construct the absolute path to the Python script on F drive
    const pythonScriptPath = ".\\services\\recommendation_model.py";

    // Spawn a new Python process to handle recommendations
    const pythonProcess = spawn("python", [pythonScriptPath, userType, userId]);

    pythonProcess.stdout.on("data", async (data) => {
        try {
            const result = JSON.parse(data.toString());

            if (result.recommendations && Array.isArray(result.recommendations)) {
                // Fetch mentor details from the database
                const mentorIds = result.recommendations.map(rec => rec.mentor_id);
                const mentors = await prisma.mentor.findMany({
                    where: {
                        id: { in: mentorIds }
                    },
                    include: {
                        User: true,
                        expertise: true,
                    },
                });

                // Format the recommendations data
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