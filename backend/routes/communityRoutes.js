const express = require("express");
const {
  getAllQuestions,
  postQuestion,
  updateQuestion,
  postAnswer,
  updateAnswer,
  getQuestionById,
  getAllAnswers,
} = require("../controllers/communityController");

const router = express.Router();

router.get("/questions", getAllQuestions);
router.post("/questions", postQuestion);

// router.get("/questions/:questionId", updateQuestion);

router.post("/questions/:questionId/answer", postAnswer);
router.get("/answers/:questionId", getAllAnswers);

router.get("/questions/:questionId", getQuestionById);

module.exports = router;
