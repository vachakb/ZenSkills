const prisma = require("../models/prismaClient");

// Controller to fetch all events
const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.Events.findMany({
      include: {
        mentor: {
          include: {
            User: true,
          },
        },
        event_image: true,
      },
    });

    res.status(200).json({ event });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Error fetching events" });
  }
};

// Controller to fetch event details by ID
const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await prisma.Event.findUnique({
      where: { id: id },
      include: {
        mentor: {
          select: {
            User: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedEvent = {
      ...event,
      organizer_name: event.mentor.name,
    };

    if (!workshop) {
      return res.status(404).json({ error: "event not found" });
    }
    res.status(200).json(formattedEvent);
  } catch (error) {
    console.error("Error fetching event details:", error);
    res.status(500).json({ error: "Error fetching event details" });
  }
};

const createEvent = async (req, res) => {
    const userId = req.user.id;
    try {
      const {
        title,
        description,
        date,
        no_of_days,
        location,
        event_image,
      } = req.body;
      const user = await prisma.User.findUnique({
        include: { mentor: true },
        where: { id: userId },
      });
  
      const newEvent = await prisma.Event.create({
        data: {
          title,
          description,
          date: new Date(date),
          no_of_days,
          event_image: {
            connect: {
              id: event_image,
            },
          },
          mentor: { connect: { id: user.mentor.id } },
        },
      });
  
      res.status(201).json(newEvent);
    } catch (error) {
      console.error("Error creating workshop:", error);
      res.status(500).json({ error: "Error creating workshop" });
    }
  };

  const updateEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
  
      const event = await prisma.Event.findUnique({
        where: { id },
      });
  
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const user = await prisma.User.findUnique({
        include: { mentor: true },
        where: { id: userId },
      });
  
      if (event.created_by !== user.mentor.id) {
        return res.status(403).json({ error: "You are not authorized to update this event" });
      }
  
    const {
        title,
        description,
        date,
        no_of_days,
        location,
        event_image,
    } = req.body;
  
      const updatedEvent = await prisma.Event.update({
        where: { id },
        data: {
          title,
          description,
          date: new Date(date),
          no_of_days,
          location,
          event_image,
        },
      });
  
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Error updating event" });
    }
  };

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user.id; 

    const event = await prisma.Event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const user = await prisma.User.findUnique({
        include: { mentor: true },
        where: { id: userId },
      });

    if (event.created_by !== user.mentor.id) {
      return res.status(403).json({ error: "You are not authorized to delete this event" });
    }

    await prisma.workshops.delete({
      where: { id },
    });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting Event:", error);
    res.status(500).json({ error: "Error deleting event" });
  }
};

// Controller to mark attendance for a event
const markAttendance = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  console.log(req.params);
  console.log(userId);

  //const userId = req.user.id;

  try {
    // Check if the booking exists
    const booking = await prisma.EventBooking.findUnique({
      where: {
        event_id_user_id: {
          event_id: id,
          user_id: userId,
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Mark attendance
    const updatedBooking = await prisma.EventBooking.update({
      where: {
        event_id_user_id: {
          event_id: id,
          user_id: userId,
        },
      },
      data: {
        attended: true,
      },
    });

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Error marking attendance" });
  }
};

// Controller to fetch the number of users who attended a event
const getEventAttendance = async (req, res) => {
  const { eventId } = req.params;

  try {
    const attendanceCount = await prisma.EventBooking.count({
      where: {
        event_id: eventId,
        attended: true,
      },
    });

    res.status(200).json({ attendanceCount });
  } catch (error) {
    console.error("Error fetching event attendance:", error);
    res.status(500).json({ error: "Error fetching event attendance" });
  }
};

// Controller to book a event
const bookEvent = async (req, res) => {
  const { id: eventId } = req.params;
  const { userId } = req.body;
  console.log(req.body);

  try {
    // Check if the event exists
    const event = await prisma.Event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if the user has already booked the event
    const existingBooking = await prisma.EventBooking.findUnique({
      where: {
        event_id_user_id: {
          event_id: eventId,
          user_id: userId,
        },
      },
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ error: "User has already booked this event" });
    }

    // Create a new booking
    const newBooking = await prisma.EventBooking.create({
      data: {
        event_id: eventId,
        user_id: userId,
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error booking event:", error);
    res.status(500).json({ error: "Error booking event" });
  }
};

// Controller to fetch all event booked by a user
const getUserRegisteredEvents = async (req, res) => {
  const { userId } = req.params;

  try {
    const events = await prisma.EventBooking.findMany({
      where: {
        user_id: userId,
      },
    });
    console.log(events);

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching user registered events:", error);
    res.status(500).json({ error: "Error fetching user registered events" });
  }
};

module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    markAttendance,
    getEventAttendance,
    bookEvent,
    getUserRegisteredEvents
}
