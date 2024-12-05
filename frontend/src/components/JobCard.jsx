import React from "react";
import { useNavigate } from "react-router-dom";

const JobCard = ({
  id,
  title,
  jobTypes,
  salary,
  company,
  location,
  applicants,
  logo,
}) => {
  const navigate = useNavigate();

  function handleJobDeailsClick(id) {
    console.log("navigationg to details of job with id: ", id);
    navigate(`/jobs/${id}`);
  }

  // Generate initials from the company name for the placeholder
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // If logo URL is not provided, generate a placeholder with initials
  const logoUrl = logo
    ? logo
    : `https://via.placeholder.com/40?text=${getInitials(company)}`;

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        {/* Job Title */}
        <h5 className="card-title">{title}</h5>

        {/* Job Type and Salary */}
        <div className="mb-3">
          {jobTypes.map((jobType) => {
            return <span className="badge bg-success mx-1">{jobType}</span>;
          })}
        </div>

        <div className="d-flex justify-content-between mb-3">
          <span className="text-muted">Salary: {salary}</span>
        </div>

        {/* Company Logo, Name, and Location */}
        <div className="d-flex align-items-center mb-3">
          <img
            src={logoUrl}
            alt={`${company} logo`}
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
            className="rounded-circle me-3"
          />
          <div>
            <strong>{company}</strong>
            <p className="mb-0 text-muted">
              <i className="bi bi-geo-alt-fill"></i> {location}
            </p>
          </div>
        </div>

        {/* Number of Applicants */}
        <p className="text-muted mb-3">{applicants} applicants</p>

        {/* Action Buttons */}
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-outline-primary"
            onClick={() => handleJobDeailsClick(id)}
          >
            View Details
          </button>
          <button
            className="btn btn-primary"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#applyJobModal"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
