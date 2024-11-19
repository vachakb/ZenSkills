const prisma = require("../models/prismaClient");

// Controller to fetch mentors
const getMentors = async (req, res) => {
  try {
    const {
      page = 1,
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


    const totalMentorsCount = await prisma.mentor.count({
      where: whereClause,
    });

 
    res.status(200).json({
      mentors,
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

module.exports = { getMentors, getTags };
