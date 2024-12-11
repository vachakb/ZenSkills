const express = require("express");
const { getAllQuestions, postQuestion, updateQuestion, postAnswer, updateAnswer } = require("../controllers/communityController");

const router = express.Router();

router.get("/questions", getAllQuestions)
router.post("/questions", postQuestion);

router.put("/questions/:questionId", updateQuestion);

router.post("/question/:questionId/answer", postAnswer);


module.exports = router;