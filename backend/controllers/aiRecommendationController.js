const { exec } = require("child_process");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");


const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });


async function fetchAllTags() {
  const tags = await prisma.tags.findMany({
    select: {
      tag_name: true,
    },
  });
  return tags.map((tag) => tag.tag_name).filter(Boolean);
}

const getAIRecommendations = async (req, res) => {
  const { query } = req.body;
  const message = query?.message;

  console.log("Request body:", req.body);
  console.log("Message:", message);

  if (!message) {
    console.error("No message provided in request body");
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    
    const prompt = `Analyze the following problem and identify relevant technical skills needed.
    Return ONLY skills from the following categories, as a comma-separated list:

    Frontend: HTML, CSS, JavaScript, React, Angular
    Backend: Node.js, Express, Python, Django
    Data Science: Python, R, SQL, TensorFlow, PyTorch
    Cloud: AWS, Azure, Google Cloud, Kubernetes
    DevOps: Docker, CI/CD, Jenkins, Ansible
    Mobile: Flutter, React Native, Swift, Kotlin, Dart
    Security: Penetration Testing, Cryptography, Firewalls
    Design: Figma, Adobe XD, Sketch, Wireframing
    Blockchain: Ethereum, Solidity, Hyperledger
    Networking: Cisco, Firewall, Wireshark
    Embedded: C, C++, Microcontrollers, RTOS
    Quantum: Qiskit, IBM Quantum
    Management: Agile, Scrum, JIRA

    Problem: ${message}

    Return only the exact skill names listed above, separated by commas.`;

    console.log("Prompt for Gemini API:", prompt);

    
    const result = await model.generateContent(prompt);
    const candidates = result?.response?.candidates;

    if (!candidates?.length) {
      return res
        .status(500)
        .json({ error: "No skills extracted from the message" });
    }

    const extractedText = candidates[0]?.content?.parts?.[0]?.text?.trim();
    if (!extractedText) {
      return res
        .status(500)
        .json({ error: "Failed to extract skills from the message" });
    }

    const extractedSkills = extractedText
      .split(",")
      .map((skill) => skill.trim());
    // const extractedSkills = ["Backend", "Node.js", "React"];
    console.log("Extracted Skills:", extractedSkills);

    
    const predefinedSkills = await fetchAllTags();
    const matchedSkills = extractedSkills.filter((skill) =>
      predefinedSkills.includes(skill)
    );

    if (matchedSkills.length === 0) {
      return res
        .status(404)
        .json({ error: "No matching skills found in predefined set." });
    }
    
    const mentors = await prisma.mentor.findMany({
      where: {
        AND: [
          {
            expertise: {
              some: {
                tag_name: {
                  in: matchedSkills,
                },
              },
            },
          },
          {
            credit_score: {
              gte: 60,
            },
          },
        ],
      },
      select: {
        id: true,
        experience_years: true,
        experience_months: true,
        credit_score: true,
        mentor_job_title: true,
        rating: true,
        company: true,
        User: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            Review: true,
            sessions: true, 
          },
        },
      },
      orderBy: {
        rating: "desc",
      },
      take: 5,
    });
    if (!mentors.length) {
      return res.status(404).json({
        error: "No mentors found with the matched skills.",
      });
    }
    console.log("Matched Mentors:", mentors);
    
    const formattedMentors = mentors.map((mentor) => ({
      experienceYears: mentor.experience_years,
      experienceMonths: mentor.experience_months,
      creditScore: mentor.credit_score,
      title: mentor.mentor_job_title,
      id: mentor.id,
      name: mentor.User.name, 
      noOfReviews: mentor._count.Review,
      noOfSessions: mentor._count.sessions, 
      rating: mentor.rating || 0,
      company: mentor.company,
    }));

    
    res.json({
      mentors: formattedMentors,
      totalMentorsCount: formattedMentors.length,
    });
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({
      error: "Failed to process the message with AI service",
    });
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  getAIRecommendations,
};
