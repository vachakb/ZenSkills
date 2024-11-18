const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const main = async () => {
  try {
    
    const tags = ["Frontend", "Backend", "AI", "Marketing", "DevOps"];
    await Promise.all(
      tags.map((tagName) =>
        prisma.tags.upsert({
          where: { tag_name: tagName },
          update: {},
          create: { tag_name: tagName },
        })
      )
    );
    console.log("Tags upserted successfully!");

    
    const passwordHash = await bcrypt.hash("yourPasswordHere", 10); 

    const user = await prisma.user.create({
      data: {
        email: "mentor@example.com",
        name: "John Doe",
        password_hash: passwordHash, 
        role: "mentor",
        is_verified: true,
        created_date: new Date(),
        gender: "Male",
        location: "New Delhi",
        is_deleted: false,
      },
    });

    const mentor = await prisma.mentor.create({
      data: {
        uid: user.uid, 
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

    
    await Promise.all(
      tagRecords.map((tag) =>
        prisma.mentor_expertise.create({
          data: {
            mentor_id: mentor.mentor_id, 
            tag_id: tag.tag_id, 
          },
        })
      )
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
