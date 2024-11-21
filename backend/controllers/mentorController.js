const prisma = require("../models/prismaClient");

// Controller to fetch mentors
const getMentors = async (req, res) => {
  try {
    const {
      page = 0,
      limit = 10,
      search = "",
      selectedTags = [],
      noOfMenteesMentored = 0,
    } = req.query;

    // check selectedTags is array of strings
    const tagsArray = Array.isArray(selectedTags)
      ? selectedTags
      : JSON.parse(selectedTags || "[]");

    const offset = page * limit;

    const whereClause = {
      AND: [
        {
          OR: [
            { bio: { contains: search, mode: "insensitive" } },
            { mentor_job_title: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ],
        },
        { number_of_mentees_mentored: { gte: parseInt(noOfMenteesMentored) } },
        ...(tagsArray.length
          ? [
              {
                mentor_expertise: {
                  some: {
                    tags: {
                      tag_name: { in: tagsArray },
                    },
                  },
                },
              },
            ]
          : []),
      ],
    };

    const mentors = await prisma.mentor.findMany({
      where: whereClause,
      skip: offset,
      take: parseInt(limit),
      include: {
        User: true,
        mentor_expertise: {
          include: {
            tags: true,
          },
        },
      },
    });

    const formattedMentors = mentors.map((mentor) => ({
      Experience: mentor.experience_years,
      creditScore: mentor.credit_score,
      currentPost: mentor.mentor_job_title,
      id: mentor.id,
      name: mentor.name,
      noOfReviews: mentor.noOfReviews || 0, // TODO Add reviews logic
      noOfSessions: mentor.number_of_sessions,
      rating: mentor.rating,
      company: mentor.company,
    }));

    const totalMentorsCount = await prisma.mentor.count({
      where: whereClause,
    });

    res.status(200).json({
      mentors: formattedMentors,
      totalMentorsCount,
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    res.status(500).json({ error: "Error fetching mentors" });
  }
};

// Controller to fetch tags
const getTags = async (req, res) => {
  try {
    console.log("Fetching tags");
    const tags = await prisma.tags.findMany({
      select: { tag_name: true },
    });
    res.status(200).json({ tags: tags.map((tag) => tag.tag_name) });
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Error fetching tags" });
  }
};

const getMentorProfile = async (req, res) => {
  try {
    const { mentorId } = req.params;
    // Validate mentorId
    if (!mentorId) {
      return res.status(400).json({ error: "Mentor ID is required" });
    }
    console.log("Mentor ID:", mentorId);

    // Fetch mentor profile
    const mentor = await prisma.mentor.findUnique({
      where: { mentor_id: mentorId },
      include: {
        mentor_expertise: {
          include: { tags: true }, // Include expertise tags
        },
        User: true,
      },
    });

    // If mentor not found
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const mentorProfile = {
      name: mentor.name,
      bio: mentor.bio,
      occupation: mentor.mentor_job_title,
      rating: mentor.rating,
      workExperiences: [], // Populate this with custom logic if needed
      expertise: mentor.mentor_expertise.map((i) => i.tags.tag_name),
      isMentor: true,
    };
    res.status(200).json(mentorProfile);
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({ error: "Error fetching mentor profile" });
  }
};

module.exports = { getMentors, getTags, getMentorProfile };
