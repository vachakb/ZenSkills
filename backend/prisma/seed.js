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

    const user = await prisma.user.upsert({
      where: { account_id: { email: "mentor@example.com", role: "mentor" } },
      update: {},
      create: {
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

    const user1 = await prisma.user.upsert({
      where: { account_id: { email: "mentee@example.com", role: "mentee" } },
      update: {},
      create: {
        email: "mentee@example.com",
        name: "Jane Doe",
        password: await argon2.hash("password"),
        role: "mentee",
        is_verified: true,
        gender: "Female",
        location: "New Delhi",
        is_deleted: false,
      },
    });

    await prisma.user.upsert({
      where: { account_id: { email: "user2@example.com", role: "mentor" } },
      update: {},
      create: {
        email: "user2@example.com",
        name: "Dude",
        password: await argon2.hash("password"),
        role: "mentor",
        is_verified: true,
        gender: "Male",
        location: "New Delhi",
        is_deleted: false,
      },
    });

    await prisma.user.upsert({
      where: { account_id: { email: "user3@example.com", role: "mentee" } },
      update: {},
      create: {
        email: "user3@example.com",
        name: "dudette",
        password: await argon2.hash("password"),
        role: "mentee",
        is_verified: true,
        gender: "Female",
        location: "New Delhi",
        is_deleted: false,
      },
    });

    console.log("Users created successfully!");

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

    console.log("Mentor created successfully!");

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

    console.log("Mentee created successfully!");

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

    tagRecords.map(
      async (tag) =>
        await prisma.mentee.update({
          where: {
            id: mentee.id,
          },
          data: {
            interests: {
              connect: {
                tag_id: tag.tag_id,
              },
            },
          },
        }),
    );

    console.log("Mentee interests added successfully!");

    await prisma.MentorSession.create({
      data: {
        name: "Web Development with React",
        description: "Doing web development with React",
        durationMinutes: 120,
        mentor: {
          connect: {
            id: mentor.id,
          },
        },
      },
    });

    console.log("Available sessions added successfully!");

    const conversations = [
      {
        type: "PRIVATE",
        users: {
          connect: [{ id: user.id }, { id: user1.id }],
        },
      },
      {
        title: "Nice little group chat",
        type: "GROUP",
        users: {
          connect: [{ id: user.id }, { id: user1.id }],
        },
      },
    ];

    conversations.forEach(
      async (conversation) =>
        await prisma.conversation.create({
          data: conversation,
        }),
    );

    console.log("Conversations created successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main()
  .then(() => console.log("Database seeded successfully!"))
  .catch((error) => console.error("Error seeding database:", error));
