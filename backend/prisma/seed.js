const argon2 = require("argon2");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const main = async () => {
  try {
    const topics = [
      "Design Thinking",
      "Web Development",
      "Data Science",
      "Leadership",
    ];

    topics.map(async (topic) => {
      await prisma.MentorSessionTopic.upsert({
        where: { name: topic },
        update: {},
        create: { name: topic },
      });
    });

    const tags = ["Frontend", "Backend", "AI", "Marketing", "DevOps"];

    tags.map(
      async (tagName) =>
        await prisma.tags.upsert({
          where: { tag_name: tagName },
          update: {},
          create: { tag_name: tagName },
        }),
    );

    console.log("Tags upserted successfully!");

    const user = await prisma.user.create({
      data: {
        email: "mentor@example.com",
        name: "John Doe",
        password: await argon2.hash("password"),
        role: "mentor",
        is_verified: true,
        gender: "Male",
        location: "New Delhi",
        is_deleted: false,
      },
    });

    console.log("User created successfully!");

    const mentor = await prisma.mentor.create({
      data: {
        user_id: user.id,
        bio: "Experienced software engineer",
        experience_years: 5,
        rating: 4.8,
        number_of_mentees_mentored: 15,
        company: "Tech Corp",
        mentor_job_title: "Senior Engineer",
      },
    });

    console.log("Mentor created successfully!");

    const expertiseTags = ["Frontend", "Backend"];
    const tagRecords = await prisma.tags.findMany({
      where: {
        tag_name: { in: expertiseTags },
      },
    });

    tagRecords.map(
      async (tag) =>
        await prisma.mentor.update({
          where: {
            id: mentor.id,
          },
          data: {
            expertise: {
              connect: {
                tag_id: tag.tag_id,
              },
            },
          },
        }),
    );

    console.log("Mentor expertise added successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main()
  .then(() => console.log("Database seeded successfully!"))
  .catch((error) => console.error("Error seeding database:", error));
