const prisma = require("../models/prismaClient");

exports.getAllAvailableSessions = async (req, res) => {
  try {
    const sessions = await prisma.MentorSession.findMany({
      include: {
        mentor: true,
      },
      where: {
        mentor: {
          some: {
            User: {
              id: req.user.id,
            },
          },
        },
      },
    });

    return res.json({ sessions });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

exports.createSession = async (req, res) => {
  const {
    sessionName,
    eventDescription,
    sessionDuration,
    selectedTopics,
    availability,
  } = req.body;

  try {
    const mentor = await prisma.mentor.findUnique({
      where: {
        user_id: req.user.id,
      },
    });

    const timeSlots = [];

    for (const timeSlot of availability) {
      if (!timeSlot.enabled) {
        continue;
      }

      for (const slot of timeSlot.slots) {
        timeSlots.push({
          day: timeSlot.day,
          from: slot.start,
          to: slot.end,
        });
      }
    }

    await prisma.MentorSession.create({
      data: {
        name: sessionName,
        description: eventDescription,
        durationMinutes: sessionDuration,
        topics: {
          connect: selectedTopics.map((topic) => ({ id: topic.id })),
        },
        // TODO maybe try a different approach
        timeSlots: {
          create: timeSlots,
        },
        mentor: {
          connect: {
            id: mentor.id,
          },
        },
      },
    });

    await prisma.mentor.update({
      where: {
        id: mentor.id,
      },
      data: {
        created_first_session: true,
      },
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.getAllTopics = async (req, res) => {
  res.json({ topics: await prisma.MentorSessionTopic.findMany() });
};

exports.updateSession = async (req, res) => {
  const { id } = req.params;
  const {
    sessionName,
    eventDescription,
    sessionDuration,
    selectedTopics,
    availability,
  } = req.body;

  try {
    const mentor = await prisma.mentor.findUnique({
      where: {
        user_id: req.user.id,
      },
    });

    const timeSlots = [];

    for (const timeSlot of availability) {
      if (!timeSlot.enabled) {
        continue;
      }

      for (const slot of timeSlot.slots) {
        timeSlots.push({
          day: timeSlot.day,
          from: slot.start,
          to: slot.end,
        });
      }
    }

    const updatedSession = await prisma.MentorSession.update({
      where: { id },
      data: {
        name: sessionName,
        description: eventDescription,
        durationMinutes: sessionDuration,
        topics: {
          set: selectedTopics.map((topic) => ({ id: topic.id })),
        },
        timeSlots: {
          deleteMany: {},
          create: timeSlots,
        },
        mentor: {
          connect: {
            id: mentor.id,
          },
        },
      },
    });

    res.json(updatedSession);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
