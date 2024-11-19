import React, { useState } from "react";
import JobCard from "../components/JobCard";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
import getAddress from "./getCurrentLocation";
import axios from "axios";
import ReactPaginate from "react-paginate";

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

  const [filterDropdownVisibility, setFilterDropdownVisibility] =
    useState(false);
  const jobTypes = ["Full-Time", "Part-Time", "Contract", "Freelance"];
  let [selectedJobTypes, setSelectedJobTypes] = useState([]);

  const [currentPage, setCurrentpage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  const handleMinSalaryChange = (e) => setMinSalary(e.target.value);
  const handleMaxSalaryChange = (e) => setMaxSalary(e.target.value);

  const handleSearch = () => {
    try{
      const responce = axios.get("/api/jobs", {
        params:{
          search: searchTerm,
          location: locationInput,
          jobTypes: selectedJobTypes,
          salaryRange: `${minSalary}-${maxSalary}`,
          page: currentPage + 1,
          limit: itemsPerPage,
        }
      })
      setFilteredJobs(responce.data.jobs)
      setTotalPages(Math.ceil(responce.data.totalMentorsCount / itemsPerPage));

    }catch(error){
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
      setSelectedJobTypes(selectedJobTypes.filter((type) => type !== type_));
    } else {
      setSelectedJobTypes([...selectedJobTypes, type_]);
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
            {jobTypes.map((type) => {
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
              (minSalary!=="" && maxSalary!=="" && Number(minSalary) > Number(maxSalary))) && (
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
    </div>
  );
};

export default JobList;
