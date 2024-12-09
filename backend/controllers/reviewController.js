const prisma = require("../models/prismaClient");

// Fetch reviews by mentor ID
const getReviewsByMentorId = async (req, res) => {
  const { mentorId } = req.params;
  try {
    const reviews = await prisma.Review.findMany({
      where: { mentor_id: mentorId },
      include: {
        mentee: {
          include: {
            User: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const formattedReviews = reviews.map((review) => ({
      username: review.mentee.User.name,
      date: review.created_at,
      rating: review.rating,
      reviewText: review.description,
    }));

    res.status(200).json({
      reviews: formattedReviews,
      hasReviewed: reviews.some(
        (review) => review.mentee.User.id === req.user.id,
      ),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

const addReview = async (req, res) => {
  const { mentorId } = req.params;
  const { rating, reviewText } = req.body;

  try {
    const newReview = await prisma.Review.create({
      include: {
        mentee: {
          include: {
            User: true,
          },
        },
      },
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

    const formattedReview = {
      username: newReview.mentee.User.name,
      date: newReview.created_at,
      rating: newReview.rating,
      reviewText: newReview.description,
    };

    console.log("Review added:", newReview);
    res.status(201).json({ review: formattedReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add review" });
  }
};

module.exports = {
  getReviewsByMentorId,
  addReview,
};
