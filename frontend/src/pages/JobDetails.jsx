// pages/JobDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JobApplicationModal from "../components/JobApplicationModal";
import { fetchJobDetails } from "../apis/explore";
import { Spinner } from "react-bootstrap";

const JobDetails = () => {
  const { jobId } = useParams(); // Get job ID from URL
  const [job, setJob] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const onLoad = async () => {
    setIsLoading(true);
    try {
      const response = await fetchJobDetails(jobId);
      console.log(response.data)
      setJob(response.data);
    } catch (error) {
      console.error("Error fetching job details", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    onLoad();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
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
        {job.moreDetails.jobDescription.responsibilities.map(
          (item, index) =>{ 
            return <li className="list-group-item" key={index}>
              {item}
            </li>}
          
        )}
      </ul>

      {/* <h3>Qualifications</h3> */}
      {/* <ul className="list-group mb-4">
        <li className="list-group-item">
          {job.moreDetails.qualifications}
        </li>
      </ul> */}

      {/* <div className="row">
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
              {job.moreDetails.qualifications.preferred.softSkills.join(
                ", "
              )}
            </li>
            <li className="list-group-item">
              <strong>Experience:</strong>{" "}
              {job.moreDetails.qualifications.preferred.experience}
            </li>
          </ul>
        </div>
      </div> */}

      <h3 className="mt-4">Perks and Benefits</h3>
      <ul className="list-group mb-4">
        {job.moreDetails.perksAndBenefits.map((perk, index) => {
          return <li className="list-group-item" key={index}>
          {perk}
        </li>
        })}
      </ul>

      <h3>Application Details</h3>
      <ul className="list-group mb-4">
        {job.moreDetails.applicationDetails.process.map(
          (step, index) => 
            {return <li className="list-group-item" key={index}>
              {step}
            </li>}
          
        )}
      </ul>
      <p>
        <strong>Deadline:</strong>{" "}
        {job.moreDetails.applicationDetails.deadline}
      </p>

      <h3>Company Overview</h3>
      <p>
        <strong>{job.moreDetails.companyOverview.name}</strong>
      </p>
      <p>{job.moreDetails.companyOverview.description}</p>
      <p>{job.moreDetails.companyOverview.culture}</p>

      {/* Modal Component */}
      <JobApplicationModal />
    </div>
  );
};

export default JobDetails;
