import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
import getAddress from "./getCurrentLocation";
import axios from "axios";
import ReactPaginate from "react-paginate";
import JobApplicationModal from "../components/JobApplicationModal";
import { fetchJobs } from "../apis/explore";

const JobList = () => {
  const jobs = [
    {
      id: 1,
      title: "Cloud Engineer Intern",
      jobTypes: ["Internship", "Remote Full-Time"],
      salary: "10,000 INR - 15,000 INR",
      company: "AWS",
      location: "Bangalore, India",
      applicants: "40+",
    },
    {
      id: 2,
      title: "Temporary Technical Support",
      jobTypes: ["Temporary", "Contract"],
      salary: "20,000 INR - 30,000 INR",
      company: "Microsoft",
      location: "Mumbai, India",
      applicants: "5+",
    },
    {
      id: 3,
      title: "Backend Developer",
      jobTypes: ["Remote Full-Time", "Contract-to-Hire"],
      salary: "50,000 INR - 70,000 INR",
      company: "Netflix",
      location: "Remote",
      applicants: "20+",
    },
    {
      id: 4,
      title: "Contract-to-Hire Project Manager",
      jobTypes: ["Contract-to-Hire", "Hybrid"],
      salary: "60,000 INR - 80,000 INR",
      company: "TCS",
      location: "Delhi, India",
      applicants: "10+",
    },
    {
      id: 5,
      title: "Volunteer Web Developer",
      jobTypes: ["Volunteer", "Freelance"],
      salary: "Unpaid",
      company: "NGO TechHelp",
      location: "Remote",
      applicants: "25+",
    },
    {
      id: 6,
      title: "Hybrid Software Tester",
      jobTypes: ["Hybrid", "Part-Time"],
      salary: "30,000 INR - 40,000 INR",
      company: "HCL",
      location: "Pune, India",
      applicants: "8+",
    },
    {
      id: 7,
      title: "DevOps Engineer",
      jobTypes: ["Full-Time", "Remote Full-Time"],
      salary: "70,000 INR - 90,000 INR",
      company: "DigitalOcean",
      location: "Chennai, India",
      applicants: "12+",
    },
    {
      id: 8,
      title: "Content Strategist",
      jobTypes: ["Freelance", "Part-Time"],
      salary: "20,000 INR - 30,000 INR",
      company: "Medium",
      location: "Remote",
      applicants: "18+",
    },
    {
      id: 9,
      title: "Game Developer",
      jobTypes: ["Full-Time", "Contract"],
      salary: "70,000 INR - 1,00,000 INR",
      company: "Ubisoft",
      location: "Mumbai, India",
      applicants: "12+",
    },
    {
      id: 10,
      title: "Data Scientist",
      jobTypes: ["Full-Time", "Hybrid"],
      salary: "80,000 INR - 1,20,000 INR",
      company: "Google",
      location: "Hyderabad, India",
      applicants: "25+",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const [filterDropdownVisibility, setFilterDropdownVisibility] =
    useState(false);
  const jobTypess = ["Full-Time", "Part-Time", "Contract", "Freelance", "Internships", "On-site", "Remote", "Government"];
  let [selectedJobTypes, setSelectedJobTypess] = useState([]);

  const [currentPage, setCurrentpage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  const handleMinSalaryChange = (e) => setMinSalary(e.target.value);
  const handleMaxSalaryChange = (e) => setMaxSalary(e.target.value);

  useEffect(() => {
    function fetchAllJobs() {
      try {
        const responce = fetchJobs(searchTerm, locationInput, selectedJobTypes, minSalary, maxSalary, currentPage, itemsPerPage)
        setFilteredJobs(responce?.data?.jobs)
        setTotalPages(Math.ceil((responce?.data?.totalMentorsCount || 0) / itemsPerPage));

      } catch (error) {
        console.error(error)
      }
    }
    fetchAllJobs();
  }, [])

  const handleSearch = () => {
    try {
      const responce = fetchJobs(searchTerm, locationInput, selectedJobTypes, minSalary, maxSalary, currentPage, itemsPerPage)
      setFilteredJobs(responce?.data?.jobs)
      setTotalPages(Math.ceil((responce?.data?.totalMentorsCount || 0) / itemsPerPage));

    } catch (error) {
      console.error(error)
    }
  };

  function handlePageChange(selectedItem) {
    setCurrentpage(selectedItem.selected);
  }

  const handleCurrentLocation = async () => {
    setLocationInput(await getAddress());
  };

  function toggleFilterDropdownVisibility() {
    if (filterDropdownVisibility) setFilterDropdownVisibility(false);
    else setFilterDropdownVisibility(true);
  }

  function handleTypeClick(type_) {
    if (selectedJobTypes.includes(type_)) {
      setSelectedJobTypess(selectedJobTypes.filter((type) => type !== type_));
    } else {
      setSelectedJobTypess([...selectedJobTypes, type_]);
    }
    console.log(selectedJobTypes);
  }




  return (
    <div className="container my-3">
      <h1 className="text-center mb-4">Explore Jobs</h1>

      {/* Search and Filters */}
      <div className="mb-4">
        <div className="row g-3 align-items-center">
          {/* Search Bar */}
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by: job title, position, organization ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Location Input */}
          <div className="col-md-4 position-relative">
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

          {/* filter button */}
          <div className="col-12 col-md-2">
            <button
              className="btn btn-primary w-100"
              onClick={toggleFilterDropdownVisibility}
            >
              Filter
              {selectedJobTypes.length +
                (minSalary !== "" || maxSalary !== "") !== 0
                && (
                  <span>
                    (
                    {selectedJobTypes.length +
                      (minSalary !== "" || maxSalary !== "")}
                    )
                  </span>
                )}
            </button>
          </div>
        </div>
      </div>

      {/* filter dropdown */}
      {filterDropdownVisibility && (
        <div className="mb-4 border p-2">
          {/* dropdown heading and close btn */}
          <div className="d-flex justify-content-between mb-2">
            <div>Select Filters</div>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={toggleFilterDropdownVisibility}
            ></button>
          </div>
          {/* all types */}
          <div className="mb-2">
            Job Type:
            {jobTypess.map((type) => {
              return (
                <button
                  className={`btn btn-sm rounded-pill m-1`}
                  style={{
                    backgroundColor: selectedJobTypes.includes(type)
                      ? "#07d100"
                      : "rgb(233, 236, 239)",
                  }}
                  onClick={() => handleTypeClick(type)}
                >
                  {type}
                </button>
              );
            })}
          </div>

          {/* salary */}
          <div className="row g-2 align-items-center">
            {/* Salary Range Label */}
            <div className="col-auto">
              <label htmlFor="minSalary" className="form-label mb-0">
                Salary Range:
              </label>
            </div>

            {/* Minimum Salary Input */}
            <div className="col-auto">
              <input
                type="text"
                id="minSalary"
                className="form-control"
                placeholder="Min"
                value={minSalary}
                onChange={handleMinSalaryChange}
              />
            </div>

            {/* Dash Between Inputs */}
            <div className="col-auto">
              <span className="mx-2">-</span>
            </div>

            {/* Maximum Salary Input */}
            <div className="col-auto">
              <input
                type="text"
                id="maxSalary"
                className="form-control"
                placeholder="Max"
                value={maxSalary}
                onChange={handleMaxSalaryChange}
              />
            </div>

            {/* wrong salary input */}
            {(isNaN(Number(minSalary)) ||
              isNaN(Number(maxSalary)) ||
              (minSalary !== "" && maxSalary !== "" && Number(minSalary) > Number(maxSalary))) && (
                <div className="col-auto text-danger">
                  <span>Wrong Salary input</span>
                </div>
              )}
          </div>

          {/* {allTags.map((tag) => {
            return (
              <button
                className={`btn btn-sm rounded-pill m-1`}
                style={{
                  backgroundColor: selectedTags.includes(tag)
                    ? "#07d100"
                    : "rgb(233, 236, 239)",
                }}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            );
          })} */}
        </div>
      )}

      {/* Job Cards */}
      <div className="row">
        {filteredJobs != null ? (
          filteredJobs.map((job) => (
            <div key={job.id} className="col-lg-4 col-md-6">
              <JobCard {...job} key={job.id} />
            </div>
          ))
        ) : (
          <p className="text-center">No jobs found.</p>
        )}
      </div>
      {/* pagination */}
      <div className="mt-4 d-flex justify-content-center">
        {/* TODO use bootstrap pagination component */}
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={totalPages}
          forcePage={currentPage}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>

      {/* Modal Component */}
      <JobApplicationModal />
    </div>
  );
};

export default JobList;

