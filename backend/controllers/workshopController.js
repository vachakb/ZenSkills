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

module.exports = { getAllWorkshops, getWorkshopById };
