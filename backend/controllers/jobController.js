const prisma = require("../models/prismaClient");

const getJobDetails = async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        job_applications: true,
        mentor: true,
      },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const jobDetails = {
      id: job.id,
      title: job.title,
      job_types: job.job_type ? [job.job_type] : [],
      salary: job.salary || "",
      company: job.company_name || "",
      location: job.location || "",
      applicants: `${job.job_applications.length}+`,
      moreDetails: {
        jobDescription: {
          overview: job.description || "",
          responsibilities: job.responsibilities
            ? job.responsibilities.split(", ")
            : [],
        },
        qualifications: {
          required: {
            skills: job.qualifications ? job.qualifications.split(", ") : [],
            experience: job.required_experience || "",
            education: job.required_education || "",
          },
          preferred: {
            certifications: job.preferred_certifications
              ? job.preferred_certifications.split(", ")
              : [],
            softSkills: job.preferred_soft_skills
              ? job.preferred_soft_skills.split(", ")
              : [],
            experience: job.preferred_experience || "",
          },
        },
        perksAndBenefits: job.benefits ? job.benefits.split(", ") : [],
        applicationDetails: {
          process: job.app_details ? job.app_details.split(", ") : [],
          deadline: job.deadline
            ? job.deadline.toISOString().split("T")[0]
            : "",
        },
        companyOverview: {
          name: job.company_name || "",
          description: job.company_details || "",
          culture: job.company_culture || "",
        },
        faq: {
          remoteWorkPolicy: job.remote_work_policy || "",
          workHours: job.work_hours || "",
        },
      },
    };

    res.json(jobDetails);
  } catch (error) {
    console.error("Error fetching job details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getJobs = async (req, res) => {
  const { search, location, jobTypes, minSalary, maxSalary, page, limit } = req.query;

  const filters = {
    ...(search && { title: { contains: search, mode: "insensitive" } }),
    ...(location && { location: { contains: location, mode: "insensitive" } }),
    ...(jobTypes && { job_type: { in: Array.isArray(jobTypes) ? jobTypes : jobTypes.split(",") } }),
    ...(minSalary && { salary: { gte: minSalary } }),
    ...(maxSalary && { salary: { lte: maxSalary } }),
  };

  try {
    const jobs = await prisma.job.findMany({
      where: filters,
      include: {
        job_applications: true,
        mentor: true,
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
    });

    const totalJobs = await prisma.job.count({ where: filters });

    const jobList = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      jobTypes: job.job_type ? [job.job_type] : [],
      salary: job.salary || "",
      company: job.company_name || "",
      location: job.location || "",
      applicants: `${job.job_applications.length}+`,
    }));

    res.json({ jobs: jobList, totalJobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getJobDetails,
  getJobs,
};
