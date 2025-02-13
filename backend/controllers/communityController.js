const prisma = require("../models/prismaClient");

exports.getAllQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 10, tags, searchTerm } = req.query;
    const skip = (page - 1) * limit;

    const whereClause = {};
    if (tags) {
      whereClause.question_tag = {
        some: {
          tag_name: {
            in: Array.isArray(tags) ? tags : [tags],
          },
        },
      };
    }

    if (searchTerm) {
      whereClause.question = {
        contains: searchTerm,
        mode: "insensitive", 
      };
    }

    const totalQuestions = await prisma.CommunityQuestion.count({
      where: whereClause,
    });

    const questions = await prisma.CommunityQuestion.findMany({
      skip: parseInt(skip),
      take: parseInt(limit),
      where: whereClause,
      include: {
        question_tag: true,
        user: {
          select: {
            id: true,
            name: true,
            role: true,
            // image: true,
            mentor: {
              select: {
                mentor_job_title: true,
              },
            },
            mentee: {
              select: {
                mentee_title: true,
              },
            },
          },
        },
        CommunityAnswer: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.json({
      questions,
      pagination: {
        total: totalQuestions,
        page: parseInt(page),
        pages: Math.ceil(totalQuestions / limit),
      },
    });
  } catch (error) {
    console.error("Error getting questions:", error);
    res.status(500).json({ error: "Error fetching questions" });
  }
};

exports.postQuestion = async (req, res) => {
  console.log(req);
  const { inputQuestion, tag } = req.body;
  const userId = req.user.id;
  try {
    const newQuestion = await prisma.communityQuestion.create({
      data: {
        question: inputQuestion,
        q_user_id: userId,
        question_tag: {
          connectOrCreate: {
            where: {
              tag_name: tag,
            },
            create: {
              tag_name: tag,
            },
          },
        },
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
  const { question, tag } = req.body;

  try {
    const updatedQuestion = await prisma.communityQuestion.update({
      where: { id: questionId },
      data: {
        question,
        question_tag: tag,
      },
    });

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ error: "Error updating question" });
  }
};

exports.postAnswer = async (req, res) => {
  const { answer } = req.body;
  const { questionId } = req.params;
  const userId = req.user.id;

  // Check if answer is empty or contains only whitespace
  if (!answer || answer.trim().length === 0) {
    return res.status(400).json({ error: "Answer cannot be empty" });
  }

  try {
    const newAnswer = await prisma.communityAnswer.create({
      data: {
        answer: answer.trim(), // Remove leading/trailing whitespace
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

exports.getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    console.log(questionId);
    const question = await prisma.CommunityQuestion.findUnique({
      where: { id: questionId },
      include: {
        question_tag: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!question) {
      console.log("sending to ");
      return res.status(404).json({ error: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error getting question by ID:", error);
    res.status(500).json({ error: "Error getting question by ID" });
  }
};

exports.getAllAnswers = async (req, res) => {
  try {
    const { questionId } = req.params;

    const answers = await prisma.CommunityAnswer.findMany({
      where: { communityQuestion_id: questionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!answers.length) {
      return res
        .status(404)
        .json({ error: "No answers found for this question" });
    }

    res.status(200).json(answers);
  } catch (error) {
    console.error("Error getting answers:", error);
    res.status(500).json({ error: "Error getting answers" });
  }
};
