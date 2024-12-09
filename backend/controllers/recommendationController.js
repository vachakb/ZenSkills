const { recommendMentors } = require("../services/recommendationService");

const getRecommendations = async (req, res) => {
  try {
    const { mode, mentee_id, interests, topN } = req.body;
    console.log(req.body);
    let recommendations;
    if (mode === "mentee_id") {
      if (!mentee_id) {
        return res.status(400).json({ error: "mentee_id is required" });
      }
      recommendations = await recommendMentors(mentee_id);
    } else if (mode === "interests") {
      if (!interests) {
        return res.status(400).json({ error: "interests are required" });
      }
      recommendations = await generateRecommendations(
        interests.split(", "),
        topN
      );
    } else {
      return res
        .status(400)
        .json({ error: "Invalid mode. Use 'mentee_id' or 'interests'." });
    }

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getRecommendations };
