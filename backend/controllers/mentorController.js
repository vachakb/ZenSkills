const prisma = require("../models/prismaClient");

// Controller to fetch mentors
const getMentors = async (req, res) => {
  try {
    const {
      page = 0,
      limit = 10,
      search = "",
      selectedTags = "",
      noOfMenteesMentored = 0,
    } = req.query;

    // check selectedTags is array of strings
    const tagsArray = selectedTags.length === 0 ? [] : selectedTags.split(",");

    const offset = page * limit;

    const whereClause = {
      AND: [
        {
          OR: [
            { bio: { contains: search, mode: "insensitive" } },
            { mentor_job_title: { contains: search, mode: "insensitive" } },
            { User: { name: { contains: search, mode: "insensitive" } } },
          ],
        },
        { number_of_mentees_mentored: { gte: parseInt(noOfMenteesMentored) } },
        ...(tagsArray.length
          ? [
              {
                expertise: {
                  some: {
                    tag_name: { in: tagsArray },
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
        expertise: true,
      },
    });

    const formattedMentors = mentors.map((mentor) => ({
      experienceYears: mentor.experience_years,
      experienceMonths: mentor.experience_months,
      creditScore: mentor.credit_score,
      title: mentor.mentor_job_title,
      id: mentor.id,
      name: mentor.User.name,
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
    const tags = await prisma.tags.findMany();
    res.status(200).json({ tags });
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

    const mentor = await prisma.user.findFirst({
      include: { mentor: { include: { expertise: true } } },
      where: {
        mentor: {
          id: mentorId,
        },
      },
    });

    // If mentor not found
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    res.status(200).json({ profile: mentor });
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({ error: "Error fetching mentor profile" });
  }
};

const editProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    name,
    email,
    location,
    language,
    phone_number,
    bio,
    title,
    occupation,
    expertise,
  } = req.body;

  try {
    // Fetch the current mentor profile
    const currentMentor = await prisma.mentor.findUnique({
      where: { user_id: userId },
      include: { User: true },
    });

    if (!currentMentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Prepare the data for updating the mentor profile
    const mentorData = {
      bio: bio !== undefined ? bio : currentMentor.bio,
      mentor_job_title:
        title !== undefined ? title : currentMentor.mentor_job_title,
      company: occupation !== undefined ? occupation : currentMentor.company,
      expertise: expertise !== undefined ? { set: expertise } : undefined,
    };

    // Update the mentor profile
    const updatedMentor = await prisma.mentor.update({
      where: { user_id: userId },
      data: mentorData,
    });

    // Prepare the data for updating the user details
    const userData = {
      name: name !== undefined ? name : currentMentor.User.name,
      email: email !== undefined ? email : currentMentor.User.email,
      phone_number:
        phone_number !== undefined
          ? phone_number
          : currentMentor.User.phone_number,
      location: location !== undefined ? location : currentMentor.User.location,
      language: language !== undefined ? language : currentMentor.User.language,
    };

    // Update the user details
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    res.json({
      message: "Profile updated successfully",
      mentor: updatedMentor,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

const getMentorsList = async (req, res) => {
  try {
    const mentors = await prisma.mentor.findMany({
      include: {
        User: true,
      },
    });

    res.json({ mentors });
  } catch (error) {
    console.error("Error fetching all mentors:", error);
    res.sendStatus(500);
  }
};

const getAllReferrals = async (req, res) => {
  const { status } = req.query;

  const where = {
    mentor: {
      User: {
        id: req.user.id,
      },
    },
  };

  if (status) {
    where.status = status;
  }

  try {
    const referrals = await prisma.referral.findMany({
      include: {
        mentee: {
          include: {
            User: true,
          },
        },
        mentor: {
          include: {
            User: true,
          },
        },
        resume: true,
      },
      where,
    });

    res.json({ referrals });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const createReferral = async (req, res) => {
  const { mentor_id, job_url, description, reason } = req.body;
  const resume = req.files["resume"][0];

  try {
    await prisma.referral.create({
      data: {
        mentor: {
          connect: {
            id: mentor_id,
          },
        },
        job_url,
        description,
        reason,
        status: "PENDING",
        resume: {
          create: {
            filename: resume.originalname,
            path: resume.path,
            size: resume.size,
            mimeType: resume.mimetype,
          },
        },
        mentee: {
          connect: {
            user_id: req.user.id,
          },
        },
      },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const updateReferralStatus = async (req, res) => {
  const { referral_id, status } = req.body;

  try {
    if (status === "ACCEPTED") {
      await prisma.referral.update({
        where: {
          id: referral_id,
        },
        data: {
          status,
        },
      });
    } else if (status === "REJECTED") {
      await prisma.referral.delete({ where: { id: referral_id } });
    } else {
      return res.sendStatus(400);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// get all the mentees that have had at least one session with this mentor
const getAllMentees = async (req, res) => {
  try {
    const bookings = await prisma.SessionBooking.findMany({
      where: {
        session: {
          mentor: {
            user_id: req.user.id,
          },
        },
        status: "completed",
      },
    });

    const userIds = Array.from(
      new Set(bookings.map((booking) => booking.user_id)),
    );

    const mentees = await prisma.mentee.findMany({
      include: {
        User: true,
      },
      where: {
        user_id: {
          in: userIds,
        },
      },
    });

    res.json({ mentees });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const getAllMenteeRatings = async (req, res) => {
  const { menteeId } = req.params;

  try {
    const ratings = await prisma.menteeRating.findMany({
      include: {
        mentee: true,
        from: true,
      },
      where: {
        mentee_id: menteeId,
      },
    });

    res.json({ ratings });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const createRating = async (req, res) => {
  const { mentee_id, rating, comment } = req.body;

  try {
    await prisma.menteeRating.create({
      data: {
        rating,
        comment,
        from: {
          connect: {
            user_id: req.user.id,
          },
        },
        mentee: {
          connect: {
            id: mentee_id,
          },
        },
      },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const updateRating = async (req, res) => {
  const { mentee_id, rating, comment } = req.body;

  try {
    console.log(req.user.id);
    const mentor = await prisma.mentor.findUnique({
      where: {
        user_id: req.user.id,
      },
    });

    await prisma.menteeRating.upsert({
      where: {
        rating_id: {
          mentee_id,
          from_id: mentor.id,
        },
      },
      create: {
        rating: parseInt(rating),
        comment,
        mentee: {
          connect: {
            id: mentee_id,
          },
        },
        from: {
          connect: {
            id: mentor.id,
          },
        },
      },
      update: {
        rating: parseInt(rating),
        comment,
      },
    });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getMentors,
  getTags,
  getMentorProfile,
  editProfile,
  getMentorsList,
  getAllReferrals,
  createReferral,
  updateReferralStatus,
  getAllMentees,
  getAllMenteeRatings,
  createRating,
  updateRating,
};
