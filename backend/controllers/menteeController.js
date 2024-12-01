const prisma = require("../models/prismaClient");

// Fetch mentee profile details
async function getMenteeProfile(req, res) {
  const { menteeId } = req.params;

  try {
    const mentee = await prisma.mentee.findUnique({
      where: { id: menteeId },
      include: {
        User: true,
        interests: true,
      },
    });

    if (!mentee) return res.status(404).json({ error: "Mentee not found" });

    const response = {
      name: mentee.User.name,
      bio: mentee.bio,
      occupation: mentee.company,
      title: mentee.mentee_title,
      interests: mentee.interests,
      education: mentee.education,
      isMentor: false,
      
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch mentee profile" });
  }
}

async function editProfile(req, res) {
  const userId = req.user.id;
  const { name, email, location, language, phone_number, bio, title, occupation, interests } = req.body;

  try {
    // Fetch the current mentee profile
    const currentMentee = await prisma.mentee.findUnique({
      where: { user_id: userId },
      include: { User: true },
    });

    if (!currentMentee) {
      return res.status(404).json({ error: "Mentee not found" });
    }

    // Prepare the data for updating the mentee profile
    const menteeData = {
      bio: bio !== undefined ? bio : currentMentee.bio,
      mentee_title: title !== undefined ? title : currentMentee.mentee_title,
      company: occupation !== undefined ? occupation : currentMentee.company,
      interests: interests !== undefined ? { set: interests } : undefined,
    };

    // Update the mentee profile
    const updatedMentee = await prisma.mentee.update({
      where: { user_id: userId },
      data: menteeData,
    });

    // Prepare the data for updating the user details
    const userData = {
      name: name !== undefined ? name : currentMentee.User.name,
      email: email !== undefined ? email : currentMentee.User.email,
      phone_number: phone_number !== undefined ? phone_number : currentMentee.User.phone_number,
      location: location !== undefined ? location : currentMentee.User.location,
      language: language !== undefined ? language : currentMentee.User.language,
    };

    // Update the user details
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    res.json({ message: "Profile updated successfully", mentee: updatedMentee, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

module.exports = {
  getMenteeProfile,
  editProfile,
};