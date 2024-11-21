const {
  PrismaClient,
  UserRole,
  UserStatus,
  gender_enum,
} = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Insert multiple tags
  const tags = await prisma.tags.createMany({
    data: [
      { tag_name: "Data Science" },
      { tag_name: "Software Engineering" },
      { tag_name: "Machine Learning" },
      { tag_name: "Web Development" },
      { tag_name: "Cloud Computing" },
    ],
  });

  // Fetch the tags by name for easier reference
  const allTags = await prisma.tags.findMany();

  const tagMap = allTags.reduce((map, tag) => {
    map[tag.tag_name] = tag.tag_id;
    return map;
  }, {});

  // Insert mentors
  const mentors = await prisma.user.createMany({
    data: [
      {
        email: "mentor1@example.com",
        created_date: new Date(),
        gender: gender_enum.Male,
        is_deleted: false,
        location: "New York",
        password: "hashedpassword1",
        phone_number: "1234567890",
        status: UserStatus.active,
        uid: "uid-mentor-1",
        role: UserRole.mentor,
        googleId: null,
        is_verified: true,
      },
      {
        email: "mentor2@example.com",
        created_date: new Date(),
        gender: gender_enum.Female,
        is_deleted: false,
        location: "San Francisco",
        password: "hashedpassword2",
        phone_number: "9876543210",
        status: UserStatus.active,
        uid: "uid-mentor-2",
        role: UserRole.mentor,
        googleId: null,
        is_verified: true,
      },
    ],
  });

  // Insert mentees
  const mentees = await prisma.user.createMany({
    data: [
      {
        email: "mentee1@example.com",
        created_date: new Date(),
        gender: gender_enum.Female,
        is_deleted: false,
        location: "Los Angeles",
        password: "hashedpassword3",
        phone_number: "1122334455",
        status: UserStatus.active,
        uid: "uid-mentee-1",
        role: UserRole.mentee,
        googleId: null,
        is_verified: true,
      },
      {
        email: "mentee2@example.com",
        created_date: new Date(),
        gender: gender_enum.Male,
        is_deleted: false,
        location: "Chicago",
        password: "hashedpassword4",
        phone_number: "9988776655",
        status: UserStatus.active,
        uid: "uid-mentee-2",
        role: UserRole.mentee,
        googleId: null,
        is_verified: true,
      },
    ],
  });

  // Insert mentors' profiles
  const mentorProfiles = await prisma.mentor.createMany({
    data: [
      {
        name: "John Doe",
        bio: "Expert in Data Science with 10+ years of experience.",
        experience_years: 10,
        mentor_id: "mentor-1-id",
        uid: "uid-mentor-1",
        rating: 4.5,
        number_of_mentees_mentored: 20,
        company: "Tech Solutions",
        mentor_job_title: "Senior Data Scientist",
        number_of_sessions: 50,
        credit_score: 90,
        number_of_reviews: 15,
      },
      {
        name: "Emily Clark",
        bio: "Passionate Software Engineer specializing in web development.",
        experience_years: 5,
        mentor_id: "mentor-2-id",
        uid: "uid-mentor-2",
        rating: 4.8,
        number_of_mentees_mentored: 15,
        company: "Innovate Corp",
        mentor_job_title: "Lead Software Engineer",
        number_of_sessions: 40,
        credit_score: 95,
        number_of_reviews: 20,
      },
    ],
  });

  // Insert mentees' profiles
  const menteeProfiles = await prisma.mentee.createMany({
    data: [
      {
        name: "Jane Smith",
        bio: "Aspiring Data Scientist eager to learn and grow.",
        mentee_id: "mentee-1-id",
        uid: "uid-mentee-1",
        mentee_title: "Junior Analyst",
        company: "DataCorp",
      },
      {
        name: "Michael Brown",
        bio: "Enthusiastic web developer aiming for full-stack mastery.",
        mentee_id: "mentee-2-id",
        uid: "uid-mentee-2",
        mentee_title: "Frontend Developer",
        company: "WebCo",
      },
    ],
  });

  // Insert mentor statistics
  const mentorStatistics = await prisma.statistics.createMany({
    data: [
      {
        uid: "uid-mentor-1", // Referencing mentee's UID
        sessionsBooked: 12,
        sessionsAttended: 10,
        sessionsCancelled: 2,
        workshopsAttended: 3,
        badgesReceived: 5,
        averageAttendance: 83.3, // This represents a percentage
      },
      {
        uid: "uid-mentor-2", // Referencing mentee's UID
        sessionsBooked: 8,
        sessionsAttended: 6,
        sessionsCancelled: 2,
        workshopsAttended: 1,
        badgesReceived: 2,
        averageAttendance: 75.0, // This represents a percentage
      },
    ],
  });

  // Insert mentee statistics
  const menteeStatistics = await prisma.statistics.createMany({
    data: [
      {
        uid: "uid-mentee-1", // Referencing mentee's UID
        sessionsBooked: 12,
        sessionsAttended: 10,
        sessionsCancelled: 2,
        workshopsAttended: 3,
        badgesReceived: 5,
        averageAttendance: 83.3, // This represents a percentage
      },
      {
        uid: "uid-mentee-2", // Referencing mentee's UID
        sessionsBooked: 8,
        sessionsAttended: 6,
        sessionsCancelled: 2,
        workshopsAttended: 1,
        badgesReceived: 2,
        averageAttendance: 75.0, // This represents a percentage
      },
    ],
  });

  // Associate mentees with interests
  const menteeInterests = await prisma.mentee_interests.createMany({
    data: [
      { mentee_id: "mentee-1-id", tag_id: tagMap["Data Science"] },
      { mentee_id: "mentee-1-id", tag_id: tagMap["Machine Learning"] },
      { mentee_id: "mentee-2-id", tag_id: tagMap["Web Development"] },
    ],
  });

  // Associate mentors with expertise
  const mentorExpertise = await prisma.mentor_expertise.createMany({
    data: [
      { mentor_id: "mentor-1-id", tag_id: tagMap["Data Science"] },
      { mentor_id: "mentor-1-id", tag_id: tagMap["Machine Learning"] },
      { mentor_id: "mentor-2-id", tag_id: tagMap["Web Development"] },
      { mentor_id: "mentor-2-id", tag_id: tagMap["Software Engineering"] },
    ],
  });

  console.log("Extended dummy data with statistics inserted successfully!");
}

// Run the script
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
