const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  const createdTags = [];
  for (let i = 0; i < 50; i++) {
    const tag = await prisma.tags.create({
      data: {
        tag_name: `${faker.word.adjective()}-${faker.word.noun()}`,
      },
    });
    createdTags.push(tag);
  }

  console.log(`Created ${createdTags.length} tags.`);

  for (let i = 0; i < 300; i++) {
    const role = i % 2 === 0 ? "mentor" : "mentee";

    const email = faker.internet.email().slice(0, 100);
    const location = faker.location.city().slice(0, 255);
    const phone_number = faker.phone.number("###-###-####").slice(0, 13);

    const user = await prisma.user.create({
      data: {
        email: email,
        created_date: faker.date.past(),
        password: faker.internet.password(),
        phone_number: phone_number,
        gender: faker.helpers.arrayElement([
          "Male",
          "Female",
          "Other",
          "Prefer_not_to_say",
        ]),
        is_deleted: false,
        location: location,
        status: "active",
        role: role,
        googleId: role === "mentor" ? faker.string.uuid() : null,
        is_verified: faker.datatype.boolean(),
      },
    });

    console.log(`Created user: ${user.email}`);

    if (role === "mentor") {
      const mentor = await prisma.mentor.create({
        data: {
          uid: user.uid,
          name: faker.person.fullName(),
          bio: faker.lorem.paragraph(),
          experience_years: faker.number.int({ min: 1, max: 30 }),
          mentor_job_title: faker.name.jobTitle(),
          company: faker.company.name(),
          rating: faker.number.float({ min: 1, max: 5 }),
        },
      });

      for (let tag of createdTags) {
        await prisma.mentor_expertise.create({
          data: {
            mentor_id: mentor.mentor_id,
            tag_id: tag.tag_id,
          },
        });
      }
    } else if (role === "mentee") {
      const mentee = await prisma.mentee.create({
        data: {
          uid: user.uid,
          name: faker.person.fullName(),
          bio: faker.lorem.paragraph(),
        },
      });

      for (let tag of createdTags) {
        await prisma.mentee_interests.create({
          data: {
            mentee_id: mentee.mentee_id,
            tag_id: tag.tag_id,
          },
        });
      }
    }
  }

  console.log("Dummy data generation completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
