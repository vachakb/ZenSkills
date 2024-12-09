const prisma = require("../models/prismaClient");

// Fetch reviews by mentor ID
const getReviewsByMentorId = async (req, res) => {
  const { mentorId } = req.params;
  try {
    const reviews = await prisma.Review.findMany({
      where: { mentor_id: mentorId },
      include: {
        mentee: true,
      },
    });
    const formattedReviews = reviews.map((review) => ({
      username: review.mentee.name,
      date: review.created_at,
      rating: review.rating,
      reviewText: review.description,
    }));
    res.status(200).json(formattedReviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

const addReview = async (req, res) => {
  const { mentorId } = req.params;
  const { rating, reviewText } = req.body;

  try {
    const newReview = await prisma.Review.create({
      data: {
        mentor: {
          connect: {
            id: mentorId,
          },
        },
        mentee: {
          connect: {
            user_id: req.user.id,
          },
        },
        rating,
        description: reviewText,
      },
    });
    console.log("Review added:", newReview);
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add review" });
  }
};

module.exports = {
  getReviewsByMentorId,
  addReview,
};
