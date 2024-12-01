const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const registerUserProfile = async (req, res) => {
  const {
    name,
    gender,
    language,
    location,
    company,
    title,
    years,
    months,
    companyOrSchool,
    expertise,
    interests,
    bio,
  } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, language, location, gender },
    });

    if (user.role === "mentee") {
      await prisma.mentee.create({
        data: {
          user_id: user.id,
          bio,
          company: companyOrSchool,
          mentee_title: title,
          interests: {
            connect: interests.map((tag) => ({
              tag_id: tag.tag_id,
            })),
          },
        },
      });
    } else if (user.role === "mentor") {
      await prisma.mentor.create({
        data: {
          user_id: user.id,
          bio,
          mentor_job_title: title,
          experience_years: years,
          experience_months: months,
          company,
          expertise: {
            connect: expertise.map((tag) => ({ tag_id: tag.tag_id })),
          },
        },
      });
    }

    res.status(200).json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile." });
  }
};

module.exports = { registerUserProfile };
