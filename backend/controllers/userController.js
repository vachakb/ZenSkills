const prisma = require("../models/prismaClient");
const path = require("path");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        mentee: {
          include: {
            interests: true,
          },
        },
        mentor: {
          include: {
            expertise: true,
          },
        },
      },
      omit: {
        password: true,
        created_at: true,
        is_deleted: true,
        is_verified: true,
      },
    });
    res.json({ profile: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to fetch user profile." });
  }
};

exports.deleteProfile = async (req, res) => {
  // TODO need to check middleware to store the user data
  const userId = req.user.id;
  const role = req.user.role;
  try {
    if (role === "mentee") {
      // Delete related mentee records
      await prisma.mentee.deleteMany({
        where: { user_id: userId },
      });
    } else {
      // Delete related mentor records
      await prisma.mentor.deleteMany({
        where: { user_id: userId },
      });
    }
    // Delete the user profile
    const user = await prisma.user.delete({
      where: { id: userId },
    });

    res.json({ message: "Profile deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to delete profile." });
  }
};

exports.uploadImage = async (req, res) => {
  const image = await prisma.image.create({
    omit: {
      path: true,
    },
    data: {
      filename: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
    },
  });

  res.json({ image });
};

exports.getImage = async (req, res) => {
  const { id } = req.params;

  const image = await prisma.image.findUnique({
    where: {
      id,
    },
  });

  if (!image) {
    return res.sendStatus(404);
  }

  const startPath = path.join(__dirname, "..");
  const fullPath = path.join(startPath, image.path);

  res.sendFile(fullPath, {
    headers: {
      "Content-Disposition": "inline",
      "Content-Type": image.mimeType,
    },
  });
};
