import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import JobApplicationModal from "../components/JobApplicationModal";


const JobDetails = () => {
  // const jobDetails = {
  //   id: 1,
  //   title: "Cloud Engineer Intern",
  //   jobTypes: ["Internship", "Remote Full-Time"],
  //   salary: "10,000 INR - 15,000 INR",
  //   company: "AWS",
  //   location: "Bangalore, India",
  //   applicants: "40+",
  //   moreDetails: {
  //     jobDescription: {
  //       overview: "As a Cloud Engineer Intern at AWS, you will assist in deploying and managing cloud infrastructure, ensuring optimal performance and scalability for various services.",
  //       responsibilities: [
  //         "Assist in the deployment and management of cloud infrastructure.",
  //         "Collaborate with teams to ensure optimal cloud performance.",
  //         "Monitor and maintain cloud services for reliability and efficiency.",
  //         "Support development and testing environments."
  //       ]
  //     },
  //     qualifications: {
  //       required: {
  //         skills: ["AWS services", "Python", "Linux", "DevOps tools like Jenkins or Docker"],
  //         experience: "Basic knowledge of cloud technologies; projects or coursework in cloud computing is a plus.",
  //         education: "Pursuing a degree in Computer Science or related field."
  //       },
  //       preferred: {
  //         certifications: ["AWS Certified Solutions Architect (Associate)"],
  //         softSkills: ["Strong problem-solving skills", "Effective communication", "Team collaboration"],
  //         experience: "Previous internships or projects involving AWS or cloud platforms."
  //       }
  //     },
  //     perksAndBenefits: [
  //       "Stipend: 10,000 INR - 15,000 INR",
  //       "Learning opportunities and AWS certification support",
  //       "Mentorship from experienced AWS professionals",
  //       "Networking opportunities with industry experts"
  //     ],
  //     applicationDetails: {
  //       process: [
  //         "Submit your application through the AWS Careers portal.",
  //         "Screening and technical assessment.",
  //         "Virtual interview with the hiring team."
  //       ],
  //       deadline: "Apply by December 15, 2024"
  //     },
  //     companyOverview: {
  //       name: "AWS",
  //       description: "Amazon Web Services (AWS) is the world’s most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally.",
  //       culture: "Innovative and customer-focused, fostering growth and learning opportunities."
  //     },
  //     faq: {
  //       remoteWorkPolicy: "This is a remote full-time internship with flexibility to work from any location.",
  //       workHours: "Flexible work hours with a 40-hour weekly commitment."
  //     }
  //   }
  // };

  const { jobId } = useParams(); // Get job ID from URL
  const [job, setJob] = useState(null);

  useEffect(() => {
    // Fetch the job details by jobId
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          // TODO: Replace with API URL
          `http://localhost:5000/api/jobs/${jobId}`
        );
        setJob(response.data);
      } catch (error) {
        console.error("Error fetching job details", error);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (!job) {
    return <p>Loading job details...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="mb-4">{job.title}</h1>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#applyJobModal"
        >
          Apply Now
        </button>
      </div>
      <div className="mb-4">
        <p className="mb-1">
          <strong>Company:</strong> {job.company}
        </p>
        <p className="mb-1">
          <strong>Location:</strong> {job.location}
        </p>
        <p className="mb-1">
          <strong>Salary:</strong> {job.salary}
        </p>
      </div>

      <h3>Job Description</h3>
      <p>{job.moreDetails.jobDescription.overview}</p>
      <ul className="list-group mb-4">
        {job.moreDetails.jobDescription.responsibilities.map((item, index) => (
          <li className="list-group-item" key={index}>
            {item}
          </li>
        ))}
      </ul>

      <h3>Qualifications</h3>
      <div className="row">
        <div className="col-md-6">
          <h5>Required</h5>
          <ul className="list-group">
            <li className="list-group-item">
              <strong>Skills:</strong>{" "}
              {job.moreDetails.qualifications.required.skills.join(", ")}
            </li>
            <li className="list-group-item">
              <strong>Experience:</strong>{" "}
              {job.moreDetails.qualifications.required.experience}
            </li>
            <li className="list-group-item">
              <strong>Education:</strong>{" "}
              {job.moreDetails.qualifications.required.education}
            </li>
          </ul>
        </div>
        <div className="col-md-6">
          <h5>Preferred</h5>
          <ul className="list-group">
            <li className="list-group-item">
              <strong>Certifications:</strong>{" "}
              {job.moreDetails.qualifications.preferred.certifications.join(
                ", "
              )}
            </li>
            <li className="list-group-item">
              <strong>Soft Skills:</strong>{" "}
              {job.moreDetails.qualifications.preferred.softSkills.join(", ")}
            </li>
            <li className="list-group-item">
              <strong>Experience:</strong>{" "}
              {job.moreDetails.qualifications.preferred.experience}
            </li>
          </ul>
        </div>
      </div>

      <h3 className="mt-4">Perks and Benefits</h3>
      <ul className="list-group mb-4">
        {job.moreDetails.perksAndBenefits.map((perk, index) => (
          <li className="list-group-item" key={index}>
            {perk}
          </li>
        ))}
      </ul>

      <h3>Application Details</h3>
      <ul className="list-group mb-4">
        {job.moreDetails.applicationDetails.process.map((step, index) => (
          <li className="list-group-item" key={index}>
            {step}
          </li>
        ))}
      </ul>
      <p>
        <strong>Deadline:</strong> {job.moreDetails.applicationDetails.deadline}
      </p>

      <h3>Company Overview</h3>
      <p>
        <strong>{job.moreDetails.companyOverview.name}</strong>
      </p>
      <p>{job.moreDetails.companyOverview.description}</p>
      <p>{job.moreDetails.companyOverview.culture}</p>

      <h3>FAQ</h3>
      <p>
        <strong>Remote Work Policy:</strong>{" "}
        {job.moreDetails.faq.remoteWorkPolicy}
      </p>
      <p>
        <strong>Work Hours:</strong> {job.moreDetails.faq.workHours}
      </p>
    </div>
  );
};

export default JobDetails;
