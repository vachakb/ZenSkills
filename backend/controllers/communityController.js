const prisma = require('../models/prismaClient');

exports.postQuestion = async (req, res) => {
  const { question } = req.body;
//   const userId = req.user.id;
  const userId = "3bd27950-9f7d-4d89-8a93-52da18639e10";

  try {
    const newQuestion = await prisma.communityQuestion.create({
      data: {
        question,
        q_user_id: userId,
        answers: 0,
      },
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error posting question:", error);
    res.status(500).json({ error: "Error posting question" });
  }
};

exports.updateQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { question } = req.body;

  try {
    const updatedQuestion = await prisma.communityQuestion.update({
      where: { id: questionId },
      data: { question },
    });

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: "Error updating question" });
  }
};

exports.postAnswer = async (req, res) => {
    const { answer } = req.body;
    const { questionId} = req.params;
    // const userId = req.user.id;
    const userId = "154fa164-043c-42b2-a0cf-3bbae453ba15";
  
    try {
      const newAnswer = await prisma.communityAnswer.create({
        data: {
          answer,
          communityQuestion_id: questionId,
          a_user_id: userId,
        },
      });
  
      await prisma.communityQuestion.update({
        where: { id: questionId },
        data: {
          answers: {
            increment: 1,
          },
        },
      });
  
      res.status(201).json(newAnswer);
    } catch (error) {
      console.error("Error posting answer:", error);
      res.status(500).json({ error: "Error posting answer" });
    }
  };
  