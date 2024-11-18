import React, { useState } from "react";
import JobCard from "../components/JobCard";
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const JobList = () => {
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      jobType: "Full-Time",
      salary: "40,000 INR - 60,000 INR",
      company: "Flipkart",
      location: "Bangalore, India",
      applicants: "12+",
    },
    {
      id: 2,
      title: "Graphic Designer",
      jobType: "Part-Time",
      salary: "20,000 INR - 30,000 INR",
      company: "Zomato",
      location: "Mumbai, India",
      applicants: "8+",
    },
    {
      id: 3,
      title: "Data Scientist",
      jobType: "Full-Time",
      salary: "80,000 INR - 1,20,000 INR",
      company: "Google",
      location: "Hyderabad, India",
      applicants: "25+",
    },
    {
      id: 4,
      title: "Content Writer",
      jobType: "Freelance",
      salary: "15,000 INR - 25,000 INR",
      company: "Freelancer",
      location: "Remote",
      applicants: "50+",
    },
    {
      id: 5,
      title: "Blockchain Developer",
      jobType: "Full-Time",
      salary: "1,00,000 INR - 1,50,000 INR",
      company: "Polygon",
      location: "Pune, India",
      applicants: "10+",
    },
    {
      id: 6,
      title: "Mobile App Developer",
      jobType: "Full-Time",
      salary: "60,000 INR - 80,000 INR",
      company: "Paytm",
      location: "Noida, India",
      applicants: "15+",
    },
    {
      id: 7,
      title: "Digital Marketing Specialist",
      jobType: "Contract",
      salary: "30,000 INR - 50,000 INR",
      company: "Byju’s",
      location: "Delhi, India",
      applicants: "20+",
    },
    {
      id: 8,
      title: "Network Administrator",
      jobType: "Full-Time",
      salary: "50,000 INR - 70,000 INR",
      company: "Cisco",
      location: "Chennai, India",
      applicants: "18+",
    },
    {
      id: 9,
      title: "Machine Learning Engineer",
      jobType: "Full-Time",
      salary: "1,20,000 INR - 1,50,000 INR",
      company: "OpenAI",
      location: "Bangalore, India",
      applicants: "30+",
    },
    {
      id: 10,
      title: "System Analyst",
      jobType: "Part-Time",
      salary: "40,000 INR - 50,000 INR",
      company: "Accenture",
      location: "Pune, India",
      applicants: "5+",
    },
    {
      id: 11,
      title: "SEO Specialist",
      jobType: "Freelance",
      salary: "25,000 INR - 35,000 INR",
      company: "Fiverr",
      location: "Remote",
      applicants: "22+",
    },
    {
      id: 12,
      title: "Game Developer",
      jobType: "Full-Time",
      salary: "70,000 INR - 1,00,000 INR",
      company: "Ubisoft",
      location: "Mumbai, India",
      applicants: "12+",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const handleSearch = () => {
    const filtered = jobs.filter((job) => {
      const matchesTitle = job.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesLocation = locationInput
        ? job.location.toLowerCase().includes(locationInput.toLowerCase())
        : true;

      return matchesTitle && matchesLocation;
    });

    setFilteredJobs(filtered);
  };

  const handleCurrentLocation = () => {
    // This is a mock implementation. Replace it with actual location fetching logic.
    const currentLocation = "Bangalore, India"; // Example hardcoded location
    setLocationInput(currentLocation);
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Explore Jobs</h1>

      {/* Search and Filters */}
      <div className="mb-4">
        <div className="row g-3 align-items-center">
          {/* Search Bar */}
          <div className="col-md-5">
            <input
              type="text"
              className="form-control"
              placeholder="Search jobs by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Location Input */}
          <div className="col-md-5 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Enter location"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
            {/* Circular Icon */}
            <i
              className="fas fa-location-dot position-absolute"
              style={{
                top: "50%",
                right: "20px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: "#007bff",
              }}
              onClick={handleCurrentLocation}
              title="Use Current Location"
            ></i>
          </div>

          {/* Search Button */}
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="row">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="col-lg-4 col-md-6">
              <JobCard {...job} />
            </div>
          ))
        ) : (
          <p className="text-center">No jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default JobList;
