// backend/controllers/RecommendationController.js

const { spawn } = require("child_process");

const getRecommendations = (req, res) => {
    const userType = req.body.role; // 'mentee' or 'mentor'
    const userId = req.body.user_id;

    // Construct the absolute path to the Python script on F drive
    const pythonScriptPath =
        "..\\services\\recommendation_model.py";

    // Spawn a new Python process to handle recommendations
    const pythonProcess = spawn("python", [pythonScriptPath, userType, userId]);

    pythonProcess.stdout.on("data", (data) => {
        try {
            const result = JSON.parse(data.toString());
            res.json(result);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            res.status(500).send("Error processing request");
        }
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send("Error processing request");
    });

    pythonProcess.on("close", (code) => {
        console.log(`Python process exited with code ${code}`);
    });
};

module.exports = {
    getRecommendations,
};