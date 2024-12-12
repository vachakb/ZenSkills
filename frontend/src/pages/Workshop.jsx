import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAllWorkshops, bookWorkshop, getUserRegisteredWorkshops } from "../apis/workshops";
import { formatDateTime } from "../misc/formatDateTime";
import { format } from "date-fns";
import { FiPlusCircle } from "react-icons/fi";
import { Button, Modal } from "react-bootstrap";
import useProfile from "../hooks/useProfile";
import { API_URL } from "../apis/commons";
// TODO Make calls using axios

const WorkshopsPage = ({ demoTags }) => {
  // const workshops_ = [
  //   {
  //     id: 1,
  //     image: "https://via.placeholder.com/300x150",
  //     title: "Introduction to Web Development",
  //     date: "December 5, 2024",
  //     time: "10:00 AM - 12:00 PM",
  //     status: "upcoming",
  //     organizer: {
  //       name: "Alice Walker",
  //       position: "Full-Stack Developer",
  //       profilePic: "https://via.placeholder.com/50",
  //     },
  //   },
  //   {
  //     id: 2,
  //     image: "https://via.placeholder.com/300x150",
  //     title: "JavaScript: From Zero to Hero",
  //     date: "December 10, 2024",
  //     time: "2:00 PM - 5:00 PM",
  //     status: "upcoming",
  //     organizer: {
  //       name: "John Smith",
  //       position: "JavaScript Specialist",
  //       profilePic: "https://via.placeholder.com/50",
  //     },
  //   },
  //   {
  //     id: 3,
  //     image: "https://via.placeholder.com/300x150",
  //     title: "Advanced Python Programming",
  //     date: "November 28, 2024",
  //     time: "1:00 PM - 4:00 PM",
  //     status: "completed",
  //     organizer: {
  //       name: "Emily Johnson",
  //       position: "Senior Python Developer",
  //       profilePic: "https://via.placeholder.com/50",
  //     },
  //   },
  //   {
  //     id: 4,
  //     image: "https://via.placeholder.com/300x150",
  //     title: "Mastering Data Science with Python",
  //     date: "December 15, 2024",
  //     time: "11:00 AM - 3:00 PM",
  //     status: "upcoming",
  //     organizer: {
  //       name: "David Brown",
  //       position: "Data Scientist",
  //       profilePic: "https://via.placeholder.com/50",
  //     },
  //   },
  //   {
  //     id: 5,
  //     image: "https://via.placeholder.com/300x150",
  //     title: "UI/UX Design Basics",
  //     date: "November 20, 2024",
  //     time: "9:00 AM - 12:00 PM",
  //     status: "completed",
  //     organizer: {
  //       name: "Sophia Davis",
  //       position: "UI/UX Designer",
  //       profilePic: "https://via.placeholder.com/50",
  //     },
  //   },
  //   {
  //     id: 6,
  //     image: "https://via.placeholder.com/300x150",
  //     title: "React and Redux Workshop",
  //     date: "December 20, 2024",
  //     time: "10:00 AM - 2:00 PM",
  //     status: "upcoming",
  //     organizer: {
  //       name: "Michael Wilson",
  //       position: "React Developer",
  //       profilePic: "https://via.placeholder.com/50",
  //     },
  //   },
  //   {
  //     id: 7,
  //     image: "https://via.placeholder.com/300x150",
  //     title: "Machine Learning Bootcamp",
  //     date: "January 5, 2025",
  //     time: "9:00 AM - 6:00 PM",
  //     status: "upcoming",
  //     organizer: {
  //       name: "Sarah Lee",
  //       position: "ML Engineer",
  //       profilePic: "https://via.placeholder.com/50",
  //     },
  //   },
  //   {
  //     id: 8,
  //     image: "https://via.placeholder.com/300x150",
  //     title: "Cybersecurity Essentials",
  //     date: "December 18, 2024",
  //     time: "3:00 PM - 6:00 PM",
  //     status: "upcoming",
  //     organizer: {
  //       name: "Robert Taylor",
  //       position: "Security Analyst",
  //       profilePic: "https://via.placeholder.com/50",
  //     },
  //   },
  // ];

  const [workshops, setWorkshops] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;
  const [registeredWorkshops, setRegisteredWorkshops] = useState([]);

  const [allTags, setAllTags] = useState(demoTags);
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterDropdownVisibility, setFilterDropdownVisibility] =
    useState(false);

  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const { profile } = useProfile();

  const [selectedWorkshop, setSelectedWorkshop] = useState();
  const [showWorkshopDetails, setShowWorkshopDetails] = useState(false);

  // Fetch workshops from the server
  const fetchWorkshops = async (page, query, status) => {
    try {
      const response = await getAllWorkshops();
      console.log("API Response:", response.data);
      const filteredWorkshops = response.data.workshops.filter(
        (workshop) =>
          workshop.title.toLowerCase().includes(query.toLowerCase()) &&
          (status === "" || (status === "myworkshops" && workshop.mentor.User.id === profile.id) || workshop.status === status)
      );
      setWorkshops(filteredWorkshops);
      setTotalPages(Math.ceil(filteredWorkshops.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching workshops:", error);
    }
  };

  // Fetch registered workshops from the server
  const fetchRegisteredWorkshops = async () => {
    try {
      const response = await getUserRegisteredWorkshops(profile.id);
      setRegisteredWorkshops(response.data.registeredWorkshops);
    } catch (error) {
      console.error("Error fetching registered workshops:", error);
    }
  };

  useEffect(() => {
    setSearch("");
    setCurrentPage(0);
  }, [activeTab]);

  useEffect(() => {
    fetchWorkshops(currentPage, search, activeTab === "all" ? "" : activeTab);
    fetchRegisteredWorkshops();
  }, [currentPage, search, activeTab]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0); // Reset to the first page on search
  };

  const handleRegister = async (workshopId) => {
    try {
      const response = await bookWorkshop(workshopId, profile.id);
      if (response.status === 200 || response.status === 201) {
        alert("Successfully registered for the workshop!");
        setRegisteredWorkshops([...registeredWorkshops, workshopId]);
      } else {
        alert("Failed to register for the workshop. Please try again.");
      }
    } catch (error) {
      console.error("Error registering for the workshop:", error);
      alert("Failed to register for the workshop. Please try again.");
    }
  };

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
  };

  function toggleFilterDropdownVisibility() {
    if (filterDropdownVisibility) setFilterDropdownVisibility(false);
    else setFilterDropdownVisibility(true);
  }

  function handleTagClick(tag) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((Tag) => Tag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    console.log(selectedTags);
  }

  function handleWorkshopClick(index) {
    setSelectedWorkshop(index);
    setShowWorkshopDetails(true);
  }

  function handleCloseDetails() {
    setShowWorkshopDetails(false);
    setSelectedWorkshop(undefined);
  }

  return (
    <>
      {selectedWorkshop !== undefined &&
        <Modal show={showWorkshopDetails} onHide={handleCloseDetails} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Workshop Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Title: {workshops[selectedWorkshop].title}</h5>
            <h6>About: {workshops[selectedWorkshop].description}</h6>
            <h6>Seats available: {workshops[selectedWorkshop].max_participants}</h6>
            <h6>Date: {format(new Date(workshops[selectedWorkshop].date), "MMMM dd, yyyy")}</h6>
            <h6>Time: {format(new Date(workshops[selectedWorkshop].date), "hh:mm a")}</h6>
            <h6>Deadline: {format(new Date(workshops[selectedWorkshop].date), "MMMM dd, yyyy")}</h6>
            <h6>Created by: {workshops[selectedWorkshop].mentor.User.name}</h6>
          </Modal.Body>
        </Modal>
      }
      <div className="container my-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <h1 className="fw-bold col-12 col-md-auto mb-3 mb-md-0">Workshops</h1>
            {profile.isMentor && <Button style={{ position: "absolute", right: "40px", bottom: "40px", fontSize: "2rem", borderRadius: "40px", height: "50px", paddingTop: "0px" }} onClick={() => navigate("/create_workshop")}>+</Button>}
          </div>
          <div className="row g-2 align-items-center">
            {/* Search Input */}
            <div className="col-12 col-md">
              <input
                type="text"
                className="form-control"
                placeholder="Search workshops..."
                value={search}
                onChange={handleSearch}
              />
            </div>

            {/* Filter Button */}
            <div className="col-12 col-md-auto">
              <button
                className="btn btn-primary w-100"
                onClick={toggleFilterDropdownVisibility}
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        {filterDropdownVisibility && (
          <div className="mb-4 border p-2">
            <div className="d-flex justify-content-between">
              <div>Select Tags</div>
              <button
                className="btn-close"
                aria-label="Close"
                onClick={toggleFilterDropdownVisibility}
              ></button>
            </div>
            {allTags.map((tag) => {
              return (
                <button
                  className={btn btn-sm rounded-pill m-1}
                  style = {{
              backgroundColor: selectedTags.includes(tag)
                ? "#07d100"
                : "rgb(233, 236, 239)",
            }}
            onClick={() => handleTagClick(tag)}
                >
            {tag}
          </button>
        );
            })}
      </div>
        )}

      {selectedTags?.length !== 0 && (
        <div className="">
          Filters applied:
          {selectedTags.map((tag) => {
            return (
              <div
                className="rounded-pill ps-2 m-1 d-inline-block"
                style={{ backgroundColor: "rgb(233, 236, 239)" }}
              >
                <span>{tag}</span>
                <button
                  type="button"
                  className="btn"
                  style={{
                    background: "",
                    border: "none",
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    borderRadius: "50%",
                  }}
                  onClick={() => handleTagClick(tag)}
                >
                  &times;
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs for Filter */}
      <ul className="nav nav-tabs mb-4" id="workshopTabs">
        <li className="nav-item">
          <button
            className={nav - link ${activeTab === "upcoming" ? "active" : ""}}
          onClick={() => setActiveTab("upcoming")}
            >
          Upcoming
        </button>
      </li>
      <li className="nav-item">
        <button
          className={nav - link ${activeTab === "completed" ? "active" : ""}}
        onClick={() => setActiveTab("completed")}
            >
        Completed
      </button>
    </li >
      <li className="nav-item">
        <button
          className={nav - link ${activeTab === "myworkshops" ? "active" : ""}}
        onClick={() => setActiveTab("myworkshops")}
            >
        My workshops
      </button>
          </li >
{/* <li className="nav-item">
          <button
            className={nav-link ${activeTab === "all" ? "active" : ""}}
            onClick={() => setActiveTab("all")}
          >
            All Workshops
          </button>
        </li> */}
        </ul >

  {/* Workshop Cards */ }
  < div className = "row" >
  {
    workshops.map((workshop, index) => (
      <div
        style={{ cursor: "pointer" }}
        className="col-md-4 mb-4"
        key={workshop.id}
      >
        <div className="card shadow-sm">
          <img
            src={${API_URL} /api/images/${workshop.workshop_image_id}}
          className="card-img-top"
          alt={workshop.title}
                />
          <div className="card-body d-flex flex-column gap-2">
            <h5 className="card-title m-0">{workshop.title}</h5>
            <p className="card-text m-0">
              <strong>Date:</strong> {format(new Date(workshop.date), "MMMM dd, yyyy")} <br />
              <strong>Time:</strong> {format(new Date(workshop.date), "hh:mm a")}
            </p>
            <div className="d-flex align-items-center">
              <img
                src={workshop.organizer_profile_pic}
                alt={workshop.organizer_name}
                className="rounded-circle me-2"
                style={{ width: "50px", height: "50px" }}
              />

              <div>
                <p className="m-0 fw-bold">{workshop.mentor.User.name}</p>
                <small className="text-muted">
                  {workshop?.organizer_position}
                </small>
              </div>
            </div>
            <div className="ms-auto d-flex gap-2"><Button onClick={

              () => handleWorkshopClick(index)

            }>Details</Button>
              {!profile.isMentor && (
                console.log(workshop),
                registeredWorkshops.includes(workshop.id) ? (
                  <Button onClick={() => navigate(/workshops/${ workshop.id })}>Join</Button>
                ) : (
                  <Button onClick={() => handleRegister(workshop.id)}>Register</Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    ))
  }
        </div >

  {/* Pagination */ }
  < ReactPaginate
previousLabel = { "Previous"}
nextLabel = { "Next"}
breakLabel = { "..."}
pageCount = { totalPages }
marginPagesDisplayed = { 2}
pageRangeDisplayed = { 3}
onPageChange = { handlePageClick }
containerClassName = { "pagination justify-content-center"}
pageClassName = { "page-item"}
pageLinkClassName = { "page-link"}
previousClassName = { "page-item"}
previousLinkClassName = { "page-link"}
nextClassName = { "page-item"}
nextLinkClassName = { "page-link"}
breakClassName = { "page-item"}
breakLinkClassName = { "page-link"}
activeClassName = { "active"}
  />
      </div >
    </>
  );
};

export default WorkshopsPage;