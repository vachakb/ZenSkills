import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Card,
  Spinner,
  Modal,
} from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MentorDetailsCard from "../components/MentorDetailsCard";
import axios from "axios";
import { axiosInstance } from "../apis/commons";
import { deleteMentor, getMentorsToVerify, verifyMentor } from "../apis/admin";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const AdminPage = () => {
  const [mentors, setMentors] = useState([]);
  const [activeTab, setActiveTab] = useState("verifyMentors");
  const [selectedMentor, setSelectedMentor] = useState(null);
  // const verifiedMentorsId = []
  // Paginate data

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Dataset 1",
        data: [30, 50, 40, 60, 70, 80],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Dataset 2",
        data: [50, 40, 60, 30, 90, 70],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const mentorsData = {
    total: 120,
    active: 90,
    inactive: 30,
    titel1: "Total Mentors",
    titel2: "Active Mentors",
    titel3: "Inactive Mentors",
    chart: {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Active Mentors",
          data: [50, 60, 55, 70, 80, 90],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Inactive Mentors",
          data: [20, 15, 25, 10, 5, 10],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
  };

  const workshopsData = {
    total: 50,
    active: 20,
    inactive: 30,
    titel1: "",
    titel2: "",
    titel3: "",
    chart: {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Workshops Conducted",
          data: [10, 15, 20, 25, 30, 35],
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Upcoming Workshops",
          data: [5, 10, 8, 15, 20, 25],
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    },
  };

  const jobApplicationsData = {
    total: 200,
    open: 50,
    closed: 150,
    titel1: "",
    titel2: "",
    titel3: "",
    chart: {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Open Applications",
          data: [20, 25, 30, 35, 40, 50],
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          borderColor: "rgba(255, 206, 86, 1)",
          borderWidth: 1,
        },
        {
          label: "Closed Applications",
          data: [80, 90, 100, 110, 120, 150],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    },
  };

  const [currentPage, setCurrentPage] = useState(0);
  const limit = 3;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const currentMentors = mentors.slice(
    currentPage * limit,
    currentPage * limit + limit,
  );

  const renderTabContent = (tab) => {
    let data = {};
    let title = "";

    if (tab === "mentors") {
      data = mentorsData;
      title = "Mentors Stats";
    } else if (tab === "workshops") {
      data = workshopsData;
      title = "Workshops Stats";
    } else if (tab === "applications") {
      data = jobApplicationsData;
      title = "Job Applications Stats";
    }

    return (
      <div>
        <h4>{title}</h4>
        {/* <Row>
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{data.title1}</Card.Title>
                <Card.Text>{data.total}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{data.title2}</Card.Title>
                <Card.Text>{data.open || data.active}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{data.title3}</Card.Title>
                <Card.Text>{data.closed || data.inactive}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row> */}
        <Row>
          <Col>
            <div style={{ height: "400px" }}>
              <Line data={data.chart} />
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const [isLoading, setIsLoading] = useState(true);

  const onLoad = async () => {
    setIsLoading(true);
    const res = await getMentorsToVerify();
    console.log(res.data);
    setMentors(res.data.mentors);
    setIsLoading(false);
  };

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
    <Container>
      <h2 className="text-center m-3 fw-bold">Admin Dashboard</h2>
      <Navbar bg="light" expand="md">
        <Nav>
          {/* <Nav.Link onClick={() => setActiveTab("mentors")} active={activeTab === "mentors"}>
            Mentors
          </Nav.Link>
          <Nav.Link onClick={() => setActiveTab("workshops")} active={activeTab === "workshops"}>
            Workshops
          </Nav.Link>
          <Nav.Link onClick={() => setActiveTab("applications")} active={activeTab === "applications"}>
            Job Applications */}
          {/* </Nav.Link> */}
          <Nav.Link
            onClick={() => setActiveTab("verifyMentors")}
            active={activeTab === "verifyMentors"}
          >
            Verify Mentors
          </Nav.Link>
        </Nav>
      </Navbar>

      <Row>
        <Col>
          {/* {activeTab === "mentors" && renderTabContent("mentors")}
          {activeTab === "workshops" && renderTabContent("workshops")}
          {activeTab === "applications" && renderTabContent("applications")} */}
          {activeTab === "verifyMentors" && (
            <div style={{ padding: "20px" }}>
              <h4>Verify Mentors</h4>
              <Row>
                {/* Left Section */}
                <Col md={6} className="border-end">
                  <div
                    className="d-flex flex-column"
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  >
                    {mentors.map((mentor) => (
                      <div
                        style={{
                          cursor: "pointer",
                          border:
                            selectedMentor !== null &&
                            selectedMentor.user_id ===
                              mentor.MentorVerification.user_id
                              ? "2px solid blue"
                              : "1px solid #ddd",
                          borderRadius: "5px",
                          backgroundColor:
                            selectedMentor !== null &&
                            selectedMentor.user_id ===
                              mentor.MentorVerification.user_id
                              ? "#f0f8ff"
                              : "#bdbfbe",
                        }}
                        onClick={() => setSelectedMentor(mentor)}
                        className="px-4 py-2 bg-silent"
                      >
                        {mentor.email}
                      </div>
                    ))}
                  </div>
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(mentors.length / limit)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={
                      "pagination justify-content-center mt-3"
                    }
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </Col>

                {/* Right Section */}
                <Col md={6}>
                  {selectedMentor ? (
                    <MentorDetailsCard
                      mentor={selectedMentor}
                      onVerify={(mentor) => {
                        verifyMentor(mentor.id)
                          .then(() => {
                            setSelectedMentor(null);
                            onLoad();
                          })
                          .catch((err) => console.error(err));
                      }}
                      onDecline={(mentor) => {
                        deleteMentor(mentor.id)
                          .then(() => {
                            setSelectedMentor(null);
                            onLoad();
                          })
                          .catch((err) => console.error(err));

                      }}
                    />
                  ) : (
                    <div
                      className="text-center text-muted"
                      style={{ marginTop: "50px" }}
                    >
                      <p>Select a mentor to view their details.</p>
                    </div>
                  )}
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
