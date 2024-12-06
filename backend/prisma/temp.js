const argon2 = require("argon2");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const main = async () => {
    try {
        const user = await prisma.user.upsert({
            where: { email: "mentor1@example.com" },
            update: {},
            create: {
              email: "mentor2@example.com",
              name: "John Doe 2",
              password: await argon2.hash("password"),
              role: "mentor",
              is_verified: true,
              gender: "Male",
              location: "New Delhi",
              is_deleted: false,
            },
          });
        
          const user1 = await prisma.user.upsert({
            where: { email: "mentee2@example.com" },
            update: {},
            create: {
              email: "mentee2@example.com",
              name: "Jane Doe 2",
              password: await argon2.hash("password"),
              role: "mentee",
              is_verified: true,
              gender: "Female",
              location: "New Delhi",
              is_deleted: false,
            },
          });

          const mentee = await prisma.mentee.upsert({
            where: { user_id: user1.id },
            update: {},
            create: {
              user_id: user1.id,
              bio: "Computer science student",
              company: "XYZ School",
              mentee_title: "Student",
            },
          });

          const mentor = await prisma.mentor.upsert({
            where: { user_id: user.id },
            update: {},
            create: {
              user_id: user.id,
              bio: "Experienced software engineer",
              experience_years: 5,
              rating: 4.8,
              number_of_mentees_mentored: 15,
              company: "Tech Corp",
              mentor_job_title: "Senior Engineer",
            },
          });
    } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
};


main()
  .then(() => console.log("Database seeded successfully!"))
  .catch((error) => console.error("Error seeding database:", error));