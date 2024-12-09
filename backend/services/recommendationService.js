const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fetch all tags
const fetchAllTags = async () => {
  return await prisma.tags.findMany();
};

// Fetch all mentees
const fetchAllMentees = async () => {
  return await prisma.mentee.findMany({
    include: { interests: true }, // Fetch associated tags
  });
};

// Fetch all mentors
const fetchAllMentors = async () => {
  return await prisma.mentor.findMany({
    include: { expertise: true }, // Fetch associated tags
  });
};

// Calculate the cosine similarity between two tag vectors
const calculateCosineSimilarity = (vec1, vec2) => {
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val ** 2, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val ** 2, 0));
  return magnitude1 && magnitude2 ? dotProduct / (magnitude1 * magnitude2) : 0;
};

// Recommend mentors for a mentee
const recommendMentors = async (menteeId) => {
  const allTags = await fetchAllTags();
  const mentee = await prisma.mentee.findUnique({
    where: { id: menteeId },
    include: { interests: true },
  });

  if (!mentee) {
    throw new Error("Mentee not found");
  }

  const menteeTagVector = allTags.map((tag) =>
    mentee.interests.some((t) => t.id === tag.id) ? 1 : 0
  );

  const mentors = await fetchAllMentors();
  const recommendations = mentors.map((mentor) => {
    const mentorTagVector = allTags.map((tag) =>
      mentor.expertise.some((t) => t.id === tag.id) ? 1 : 0
    );
    const similarity = calculateCosineSimilarity(
      menteeTagVector,
      mentorTagVector
    );
    return { mentor, similarity };
  });

  // Sort by similarity in descending order
  recommendations.sort((a, b) => b.similarity - a.similarity);

  return recommendations;
};

// // Example usage
// (async () => {
//   try {
//     const recommendations = await recommendMentors(
//       "eae1556a-ec20-4223-98b9-62b6ddf84244"
//     ); // Replace with actual menteeId
//     console.log("Recommendations:", recommendations);
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// })();

const generateRecommendations = async (interests, topN) => {
  const allTags = await fetchAllTags();
  const interestTagVector = allTags.map((tag) =>
    interests.includes(tag.tag_name) ? 1 : 0
  );

  const mentors = await fetchAllMentors();
  const recommendations = mentors.map((mentor) => {
    const mentorTagVector = allTags.map((tag) =>
      mentor.expertise.some((t) => t.id === tag.id) ? 1 : 0
    );
    const similarity = calculateCosineSimilarity(
      interestTagVector,
      mentorTagVector
    );
    return { mentor, similarity };
  });

  // Sort by similarity in descending order and return top N
  recommendations.sort((a, b) => b.similarity - a.similarity);

  return recommendations.slice(0, topN);
};
module.exports = { recommendMentors , generateRecommendations};
