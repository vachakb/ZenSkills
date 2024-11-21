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

// Add a new review
// TODO Mentee id will be taken from cookies or session
const addReview = async (req, res) => {
  const { mentorId } = req.params;
  const { menteeId, rating, description } = req.body;
  try {
    // console.log("Review details:", { menteeId, rating, description });
    const newReview = await prisma.Review.create({
      data: {
        mentor_id: mentorId,
        mentee_id: menteeId,
        rating,
        description,
      },
    });
    console.log("Review added:", newReview);
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
};

module.exports = {
  getReviewsByMentorId,
  addReview,
};
