const prisma = require("../models/prismaClient");

// Controller to fetch all workshops
const getAllWorkshops = async (req, res) => {
  try {
    const workshops = await prisma.workshops.findMany();
    res.status(200).json(workshops);
  } catch (error) {
    console.error("Error fetching workshops:", error);
    res.status(500).json({ error: "Error fetching workshops" });
  }
};

// Controller to fetch workshop details by ID
const getWorkshopById = async (req, res) => {
  const { id } = req.params;
  try {
    const workshop = await prisma.workshops.findUnique({
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

    const formattedWorkshop = {
      ...workshop,
      organizer_name: workshop.mentor.name,
    };

    if (!workshop) {
      return res.status(404).json({ error: "Workshop not found" });
    }
    res.status(200).json(formattedWorkshop);
  } catch (error) {
    console.error("Error fetching workshop details:", error);
    res.status(500).json({ error: "Error fetching workshop details" });
  }
};

const createWorkshop = async (req, res) => {
  const userId = req.user.id;
  try {
    const {
      title,
      description,
      date,
      duration,
      workshop_image,
      max_participants,
      deadline,
      visibility,
    } = req.body;

    const newWorkshop = await prisma.workshops.create({
      data: {
        title,
        description,
        date: new Date(date),
        duration,
        workshop_image,
        created_by: userId,
        max_participants,
        deadline: new Date(deadline),
        visibility,
      },
    });

    res.status(201).json(newWorkshop);
  } catch (error) {
    console.error("Error creating workshop:", error);
    res.status(500).json({ error: "Error creating workshop" });
  }
};

const updateWorkshop = async (req, res) => {
  try {
    const { id } = req.params;

    // TODO - Uncomment for authentication check
    // const userId = req.user.id;

    // const workshop = await prisma.workshops.findUnique({
    //   where: { id },
    // });

    // if (!workshop) {
    //   return res.status(404).json({ error: "Workshop not found" });
    // }

    // if (workshop.created_by !== userId) {
    //   return res.status(403).json({ error: "You are not authorized to update this workshop" });
    // }

    const { title, description, date, duration, workshop_image, max_participants, deadline, visibility } = req.body;
    
    const updatedWorkshop = await prisma.workshops.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        duration,
        workshop_image,
        max_participants,
        deadline: new Date(deadline),
        visibility,
      },
    });

    res.status(200).json(updatedWorkshop);
  } catch (error) {
    console.error("Error updating workshop:", error);
    res.status(500).json({ error: "Error updating workshop" });
  }
};

const deleteWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO - Uncomment for authentication check
    // const userId = req.user.id; // Assuming user ID is available in req.user.id

    // const workshop = await prisma.workshops.findUnique({
    //   where: { id },
    // });

    // if (!workshop) {
    //   return res.status(404).json({ error: "Workshop not found" });
    // }

    // if (workshop.created_by !== userId) {
    //   return res.status(403).json({ error: "You are not authorized to delete this workshop" });
    // }

    await prisma.workshops.delete({
      where: { id },
    });

    res.status(200).json({ message: "Workshop deleted successfully" });
  } catch (error) {
    console.error("Error deleting workshop:", error);
    res.status(500).json({ error: "Error deleting workshop" });
  }
};


// Controller to mark attendance for a workshop
const markAttendance = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  console.log(req.params)
  console.log(userId)

  //const userId = req.user.id;

  try {
    // Check if the booking exists
    const booking = await prisma.WorkshopBooking.findUnique({
      where: {
        workshop_id_user_id: {
          workshop_id: id,
          user_id: userId,
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Mark attendance
    const updatedBooking = await prisma.WorkshopBooking.update({
      where: {
        workshop_id_user_id: {
          workshop_id: id,
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

// Controller to fetch the number of users who attended a workshop
const getWorkshopAttendance = async (req, res) => {
  const { workshopId } = req.params;

  try {
    const attendanceCount = await prisma.WorkshopBooking.count({
      where: {
        workshop_id: workshopId,
        attended: true,
      },
    });

    res.status(200).json({ attendanceCount });
  } catch (error) {
    console.error("Error fetching workshop attendance:", error);
    res.status(500).json({ error: "Error fetching workshop attendance" });
  }
};


// Controller to book a workshop
const bookWorkshop = async (req, res) => {
  const { id: workshopId } = req.params;
  const { userId } = req.body;

  try {
    // Check if the workshop exists
    const workshop = await prisma.workshops.findUnique({
      where: { id: workshopId },
    });

    if (!workshop) {
      return res.status(404).json({ error: "Workshop not found" });
    }

    // Check if the user has already booked the workshop
    const existingBooking = await prisma.WorkshopBooking.findUnique({
      where: {
        workshop_id_user_id: {
          workshop_id: workshopId,
          user_id: userId,
        },
      },
    });

    if (existingBooking) {
      return res.status(400).json({ error: "User has already booked this workshop" });
    }

    // Create a new booking
    const newBooking = await prisma.WorkshopBooking.create({
      data: {
        workshop_id: workshopId,
        user_id: userId,
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error booking workshop:", error);
    res.status(500).json({ error: "Error booking workshop" });
  }
};


module.exports = {
  getAllWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  getWorkshopAttendance,
  markAttendance,
  bookWorkshop,
};
