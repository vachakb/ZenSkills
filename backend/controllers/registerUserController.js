const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const registerUserProfile = async (req, res) => {
  const {
    email,
    name,
    location,
    gender,
    bio,
    language,
    interests,
    companyOrSchool,
    title,
  } = req.body;

  const genderOptions = ["Male", "Female", "Other"];

  if (!genderOptions.includes(gender)) {
    return res.status(400).json({ message: "Invalid gender value" });
  }

  // console.log("registerUserProfile -> req.body", req.body);
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("registerUserProfile -> user", user);
    if (!user || !user.is_verified) {
      return res
        .status(400)
        .json({ message: "User not verified or does not exist." });
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        location: location,
        gender: gender,
        language: language,
      },
    });

    if (user.role === "mentee") {
      const updatedMentee = await prisma.mentee.update({
        where: { uid: user.uid },
        data: { bio: bio, name: name },
      });
    } else if (user.role === "mentor") {
      const updatedMentor = await prisma.mentor.update({
        where: { uid: user.uid },
        data: {
          bio: bio,
          company: companyOrSchool,
          mentor_job_title: title,
          name: name,
        },
      });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile." });
  }
};

module.exports = { registerUserProfile };
