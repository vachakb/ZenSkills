import React from 'react';

const JobCard = ({ title, jobType, salary, company, location, applicants, logo }) => {
  // Generate initials from the company name for the placeholder
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
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
        <div className="d-flex justify-content-between mb-3">
          <span className="badge bg-success">{jobType}</span>
          <span className="text-muted">Salary: {salary}</span>
        </div>

        {/* Company Logo, Name, and Location */}
        <div className="d-flex align-items-center mb-3">
          <img
            src={logoUrl}
            alt={`${company} logo`}
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
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
          <button className="btn btn-outline-primary">View Details</button>
          <button className="btn btn-primary">Apply Now</button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
