const prisma = require("../models/prismaClient");

exports.getAllAvailableSessions = async (req, res) => {
  const { mentorId } = req.body;

  try {
    const sessions = await prisma.MentorSession.findMany({
      where: {
        mentor: {
          User: {
            id: mentorId,
          },
        },
        timeSlots: {
          some: {
            mentee: null,
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

exports.getSession = async (req, res) => {
  const session = await prisma.MentorSession.findUnique({
    include: {
      timeSlots: {
        where: {
          mentee: null,
        },
      },
      mentor: {
        include: {
          User: true,
        },
      },
    },
    where: {
      id: req.params.id,
    },
  });

  if (session) {
    const map = {};

    session.timeSlots.forEach((timeSlot) => {
      const prevArray = map[timeSlot.day] ?? [];
      prevArray.push(timeSlot);
      map[timeSlot.day] = prevArray;
    });

    session.timeSlots = map;
  }

  return res.json({ session });
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
        mentor_id: mentor.id,
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

exports.bookSession = async (req, res) => {
  const { timeSlotId } = req.params;

  await prisma.TimeSlot.update({
    where: { id: timeSlotId },
    data: {
      mentee: {
        connect: {
          user_id: req.user.id,
        },
      },
    },
  });

  res.sendStatus(200);
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
    const session = await prisma.MentorSession.findUnique({
      where: { id },
      include: { mentor: true },
    });

    if (
      !session ||
      session.mentor.length === 0 ||
      session.mentor.user_id !== req.user.id
    ) {
      return res.sendStatus(403);
    }

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
        mentor_id: mentor.id,
      },
    });

    res.json(updatedSession);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.deleteSession = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await prisma.MentorSession.findUnique({
      where: { id },
      include: { mentor: true },
    });

    if (!session || session.mentor.user_id !== req.user.id) {
      return res.sendStatus(403);
    }

    await prisma.timeSlot.deleteMany({
      where: {
        session_id: id, // Delete TimeSlots where session_id matches
      },
    });

    await prisma.MentorSession.delete({
      where: { id: id },
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};
