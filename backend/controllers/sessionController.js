const prisma = require("../models/prismaClient");
const { google } = require("googleapis");
const { googleClient } = require("./authController");

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
    // availability,
  } = req.body;

  try {
    const mentor = await prisma.mentor.findUnique({
      where: {
        // user_id: "154fa164-043c-42b2-a0cf-3bbae453ba15"
        user_id: req.user.id,
      },
    });

    // const timeSlots = [];

    // for (const timeSlot of availability) {
    //   if (!timeSlot.enabled) {
    //     continue;
    //   }

    //   for (const slot of timeSlot.slots) {
    //     timeSlots.push({
    //       day: timeSlot.day,
    //       from: slot.start,
    //       to: slot.end,
    //     });
    //   }
    // }

    await prisma.MentorSession.create({
      data: {
        name: sessionName,
        description: eventDescription,
        durationMinutes: sessionDuration,
        topics: {
          connect: selectedTopics.map((topic) => ({ id: topic.id })),
        },
        // // TODO maybe try a different approach
        // timeSlots: {
        //   create: timeSlots,
        // },
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
  const { sessionId } = req.params;
  const { startTime, endTime, date } = req.body;
  const userId = req.user.id;

  try {
    // Check if the session exists
    const session = await prisma.MentorSession.findUnique({
      where: { id: sessionId },
      include: {
        mentor: {
          include: {
            User: true,
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Check if the user has already booked the session
    const existingBooking = await prisma.SessionBooking.findUnique({
      where: {
        session_id_user_id: {
          session_id: sessionId,
          user_id: userId,
        },
      },
    });

    if (existingBooking) {
      return res.status(400).json({ error: "User has already booked this session" });
    }

    // Fetch user details from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Convert start_time and end_time to DateTime objects
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);
    const bookingDate = new Date(date);

    // Create a new booking
    const newBooking = await prisma.SessionBooking.create({
      data: {
        session_id: sessionId,
        user_id: userId,
        status: "pending",
        start_time: startDateTime,
        end_time: endDateTime,
        date: bookingDate,
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error booking session:", error);
    res.status(500).json({ error: "Error booking session" });
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
    // availability,
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

    // const timeSlots = [];

    // for (const timeSlot of availability) {
    //   if (!timeSlot.enabled) {
    //     continue;
    //   }

    //   for (const slot of timeSlot.slots) {
    //     timeSlots.push({
    //       day: timeSlot.day,
    //       from: slot.start,
    //       to: slot.end,
    //     });
    //   }
    // }

    const updatedSession = await prisma.MentorSession.update({
      where: { id },
      data: {
        name: sessionName,
        description: eventDescription,
        durationMinutes: sessionDuration,
        topics: {
          set: selectedTopics.map((topic) => ({ id: topic.id })),
        },
        // timeSlots: {
        //   deleteMany: {},
        //   create: timeSlots,
        // },
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

    // await prisma.timeSlot.deleteMany({
    //   where: {
    //     session_id: id, // Delete TimeSlots where session_id matches
    //   },
    // });

    await prisma.MentorSession.delete({
      where: { id: id },
    });

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
};

exports.createTimeSlots = async (req, res) => {
  const { sessionId } = req.params;
  const { availability } = req.body;

  try {
    // Check if the session exists
    const session = await prisma.MentorSession.findUnique({
      where: { id: sessionId },
      include: {
        mentor: true,
      }
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

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
          mentor_id: session.mentor_id,
        });
      }
    }

    await prisma.TimeSlot.createMany({
      data: timeSlots,
    });

    res.status(201).json({ message: "Time slots created successfully" });
  } catch (error) {
    console.error("Error creating time slots:", error);
    res.status(500).json({ error: "Error creating time slots" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  try {
    // Check if the booking exists
    const booking = await prisma.SessionBooking.findUnique({
      where: { id: bookingId },
      include: {
        session: {
          include: {
            mentor: {
              include: {
                User: true,
              },
            },
          },
        },
        user: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    let updatedBooking;

    if (status === 'accepted') {
      // Convert start_time and end_time to DateTime objects
      const startTime = new Date(booking.start_time);
      const endTime = new Date(booking.end_time);
      const bookingDate = new Date(booking.date);

      // Ensure the event is added on the specified date
      startTime.setFullYear(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());
      endTime.setFullYear(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());

      // Add event to Google Calendar for both user and mentor
      const event = {
        summary: booking.session.name,
        description: booking.session.description,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: "Asia/Kolkata",
        },
        attendees: [
          { email: booking.session.mentor.User.email },
          { email: booking.user.email },
        ],
      };

      // Add event to mentor's Google Calendar
      googleClient.setCredentials({ refresh_token: booking.session.mentor.User.googleRefreshToken });
      const calendar = google.calendar({ version: 'v3', auth: googleClient });
      const mentorEvent = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      

      // Store event IDs for future reference
      updatedBooking = await prisma.SessionBooking.update({
        where: { id: bookingId },
        data: {
          status,
          event_id: mentorEvent.data.id,
        },
      });
    } else if (status === 'rejected') {
      updatedBooking = await prisma.SessionBooking.update({
        where: { id: bookingId },
        data: { status },
      })
    } else if(status === 'cancelled' && booking.status === 'accepted'){
      // Delete event from mentor's Google Calendar
      googleClient.setCredentials({ refresh_token: booking.session.mentor.User.googleRefreshToken });
      const calendar = google.calendar({ version: 'v3', auth: googleClient });
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: booking.event_id,
      });
      updatedBooking = await prisma.SessionBooking.update({
        where: { id: bookingId },
        data: { status },
      })
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Error updating booking status" });
  }
};

exports.getAvailableTimeSlots = async (req, res) => {
  const { sessionId } = req.params;
  const { date } = req.query;

  try {
    // Fetch the session details
    const session = await prisma.MentorSession.findUnique({
      where: { id: sessionId },
      include: {
        mentor: {
          include: {
            User: true,
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Fetch the mentor's time slots
    const dayOfWeek = new Date(date).toLocaleString('en-US', { weekday: 'long' }).toUpperCase();
    // const dayOfWeek = "MONDAY";
    console.log(`Fetching time slots for day: ${dayOfWeek}`);
    const timeSlots = await prisma.TimeSlot.findMany({
      where: { mentor_id: session.mentor_id, day: dayOfWeek },
    });
    console.log(`Time slots found: ${JSON.stringify(timeSlots)}`);


    const availableTimeSlots = [];

    for (const timeSlot of timeSlots) {
      const startTime = new Date(`${date}T${timeSlot.from}:00Z`);
      const endTime = new Date(`${date}T${timeSlot.to}:00Z`);
      const duration = session.durationMinutes * 60 * 1000; // Convert minutes to milliseconds

      let currentTime = startTime;

      while (currentTime.getTime() + duration <= endTime.getTime()) {
        const slotStart = new Date(currentTime);
        const slotEnd = new Date(currentTime.getTime() + duration);

        // Check for conflicts in the mentor's Google Calendar
        googleClient.setCredentials({ refresh_token: session.mentor.User.googleRefreshToken });
        const calendar = google.calendar({ version: 'v3', auth: googleClient });
        const events = await calendar.events.list({
          calendarId: 'primary',
          timeMin: slotStart.toISOString(),
          timeMax: slotEnd.toISOString(),
          singleEvents: true,
          orderBy: 'startTime',
          timeZone: 'Asia/Kolkata',
        });
        console.log(`Checking events from ${slotStart.toISOString()} to ${slotEnd.toISOString()}`);
        console.log(`Events found: ${JSON.stringify(events.data.items)}`);

        if (events.data.items.length === 0) {
          availableTimeSlots.push({
            day: timeSlot.day,
            date: date,
            from: slotStart.toISOString().split('T')[1].substring(0, 5),
            to: slotEnd.toISOString().split('T')[1].substring(0, 5),
          });
        }
        currentTime = new Date(currentTime.getTime() + duration);
      }
    }
    console.log(`Available time slots: ${JSON.stringify(availableTimeSlots)}`);
    res.status(200).json({ availableTimeSlots });
  } catch (error) {
    console.error("Error fetching available time slots:", error);
    res.status(500).json({ error: "Error fetching available time slots" });
  }
};

exports.updateTimeSlots = async (req, res) => {
  const { mentorId } = req.params;
  const { availability } = req.body;

  try {
    // Check if the mentor exists
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      include: {
        User: true,
      },
    });

    if (!mentor) {
      return res.status(404).json({ error: "Mentor not found" });
    }

    // Fetch existing time slots
    const existingTimeSlots = await prisma.TimeSlot.findMany({
      where: { mentor_id: mentorId },
    });

    const timeSlotsToCreate = [];
    const timeSlotsToDelete = [];

    // Create a set of existing time slots for easy lookup
    const existingTimeSlotsSet = new Set(
      existingTimeSlots.map((ts) => `${ts.day}-${ts.from}-${ts.to}`)
    );

    // Identify time slots to create and delete
    for (const timeSlot of availability) {
      for (const slot of timeSlot.slots) {
        const slotKey = `${timeSlot.day}-${slot.start}-${slot.end}`;
        if (!existingTimeSlotsSet.has(slotKey)) {
          // Create new time slot
          timeSlotsToCreate.push({
            day: timeSlot.day,
            from: slot.start,
            to: slot.end,
            mentor_id: mentorId,
          });
        }
      }
    }

    // Identify time slots to delete
    for (const existingSlot of existingTimeSlots) {
      const slotKey = `${existingSlot.day}-${existingSlot.from}-${existingSlot.to}`;
      const isSlotInAvailability = availability.some((timeSlot) =>
        timeSlot.slots.some(
          (slot) =>
            timeSlot.day === existingSlot.day &&
            slot.start === existingSlot.from &&
            slot.end === existingSlot.to
        )
      );
      if (!isSlotInAvailability) {
        timeSlotsToDelete.push(existingSlot.id);
      }
    }

    // Delete time slots
    if (timeSlotsToDelete.length > 0) {
      await prisma.TimeSlot.deleteMany({
        where: { id: { in: timeSlotsToDelete } },
      });
    }

    // Create new time slots
    if (timeSlotsToCreate.length > 0) {
      await prisma.TimeSlot.createMany({
        data: timeSlotsToCreate,
      });
    }

    res.status(200).json({ message: "Time slots updated successfully" });
  } catch (error) {
    console.error("Error updating time slots:", error);
    res.status(500).json({ error: "Error updating time slots" });
  }
};