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
    console.log("Fetching tags");
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
    console.log("Mentor ID:", mentorId);

    // Fetch mentor profile
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      include: {
        expertise: true,
        User: true,
      },
    });

    // If mentor not found
    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    const mentorProfile = {
      name: mentor.User.name,
      bio: mentor.bio,
      occupation: mentor.mentor_job_title,
      rating: mentor.rating,
      workExperiences: [], // Populate this with custom logic if needed
      expertise: mentor.expertise,
    };

    res.status(200).json(mentorProfile);
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({ error: "Error fetching mentor profile" });
  }
};

const editProfile = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { name, email, location, language, phone_number, bio, title, occupation, expertise } = req.body;

    // Validate mentorId
    if (!mentorId) {
      return res.status(400).json({ error: "Mentor ID is required" });
    }

    // Fetch the current mentor profile
    const currentMentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      include: { User: true },
    });

    if (!currentMentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Prepare the data for updating the mentor profile
    const mentorData = {
      bio: bio !== undefined ? bio : currentMentor.bio,
      mentor_job_title: title !== undefined ? title : currentMentor.mentor_job_title,
      company: occupation !== undefined ? occupation : currentMentor.company,
      expertise: expertise !== undefined ? { set: expertise } : undefined,
    };

    // Update the mentor profile
    const updatedMentor = await prisma.mentor.update({
      where: { id: mentorId },
      data: mentorData,
    });

    // Prepare the data for updating the user details
    const userData = {
      name: name !== undefined ? name : currentMentor.User.name,
      email: email !== undefined ? email : currentMentor.User.email,
      phone_number: phone_number !== undefined ? phone_number : currentMentor.User.phone_number,
      location: location !== undefined ? location : currentMentor.User.location,
      language: language !== undefined ? language : currentMentor.User.language,
    };

    // Update the user details
    const updatedUser = await prisma.user.update({
      where: { id: currentMentor.user_id },
      data: userData,
    });

    res.json({ message: "Profile updated successfully", mentor: updatedMentor, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};


module.exports = { getMentors, getTags, getMentorProfile, editProfile };
