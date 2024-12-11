import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Container, Row, Col, Navbar, Nav, Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import MentorDetailsCard from "../components/MentorDetailsCard";
import axios from 'axios';
import { axiosInstance } from "../apis/commons";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminPage = () => {
  const [mentors, setMentors] = useState([])
  const [activeTab, setActiveTab] = useState("verifyMentors");
  const [selectedMentor, setSelectedMentor] = useState(null);
  // const verifiedMentorsId = []
  // Paginate data
  const mentorsVarifyData = [
    {
      name: "John Doe",
      gender: "Male",
      user_id: 101,
      mentor_id: 1001,
      government_id: "https://example.com/gov-id/john-doe",
      work_email: "john.doe@example.com",
      linkedin_profile: "https://linkedin.com/in/john-doe",
      additional_info: "Expert in AI and Machine Learning.",
      created_at: "2024-01-01T10:00:00Z",
      updated_at: "2024-12-01T15:00:00Z",
      degree_certificate: "https://example.com/certificates/john-doe-degree",
      additional_file: ["https://example.com/files/john-doe-report1"]
    },
    {
      name: "Jane Smith",
      gender: "Female",
      user_id: 102,
      mentor_id: 1002,
      government_id: "https://example.com/gov-id/jane-smith",
      work_email: "jane.smith@example.com",
      linkedin_profile: "https://linkedin.com/in/jane-smith",
      additional_info: "Specialist in Data Science.",
      created_at: "2024-02-15T12:30:00Z",
      updated_at: "2024-12-05T11:00:00Z",
      degree_certificate: "https://example.com/certificates/jane-smith-degree",
      additional_file: []
    },
    {
      name: "Alice Johnson",
      gender: "Female",
      user_id: 103,
      mentor_id: 1003,
      government_id: "https://example.com/gov-id/alice-johnson",
      work_email: "alice.johnson@example.com",
      linkedin_profile: "https://linkedin.com/in/alice-johnson",
      additional_info: "Focus on Blockchain technologies.",
      created_at: "2024-03-10T09:45:00Z",
      updated_at: "2024-12-10T14:15:00Z",
      degree_certificate: "https://example.com/certificates/alice-johnson-degree",
      additional_file: ["https://example.com/files/alice-johnson-project"]
    },
    {
      name: "Bob Williams",
      gender: "Male",
      user_id: 104,
      mentor_id: 1004,
      government_id: "https://example.com/gov-id/bob-williams",
      work_email: "bob.williams@example.com",
      linkedin_profile: "https://linkedin.com/in/bob-williams",
      additional_info: "Proficient in Software Architecture.",
      created_at: "2024-04-20T08:30:00Z",
      updated_at: "2024-12-15T16:00:00Z",
      degree_certificate: "https://example.com/certificates/bob-williams-degree",
      additional_file: []
    },
    {
      name: "Mary Brown",
      gender: "Female",
      user_id: 105,
      mentor_id: 1005,
      government_id: "https://example.com/gov-id/mary-brown",
      work_email: "mary.brown@example.com",
      linkedin_profile: "https://linkedin.com/in/mary-brown",
      additional_info: "Experienced in UX/UI Design.",
      created_at: "2024-05-25T13:20:00Z",
      updated_at: "2024-12-20T09:00:00Z",
      degree_certificate: "https://example.com/certificates/mary-brown-degree",
      additional_file: ["https://example.com/files/mary-brown-portfolio"]
    },
    {
      name: "Chris Green",
      gender: "Male",
      user_id: 106,
      mentor_id: 1006,
      government_id: "https://example.com/gov-id/chris-green",
      work_email: "chris.green@example.com",
      linkedin_profile: "https://linkedin.com/in/chris-green",
      additional_info: "Machine Learning Specialist.",
      created_at: "2024-06-15T14:10:00Z",
      updated_at: "2024-12-25T17:00:00Z",
      degree_certificate: "https://example.com/certificates/chris-green-degree",
      additional_file: []
    },
    {
      name: "Nina White",
      gender: "Female",
      user_id: 107,
      mentor_id: 1007,
      government_id: "https://example.com/gov-id/nina-white",
      work_email: "nina.white@example.com",
      linkedin_profile: "https://linkedin.com/in/nina-white",
      additional_info: "Cybersecurity expert.",
      created_at: "2024-07-10T11:25:00Z",
      updated_at: "2024-12-30T10:30:00Z",
      degree_certificate: "https://example.com/certificates/nina-white-degree",
      additional_file: ["https://example.com/files/nina-white-research"]
    },
    {
      name: "George Black",
      gender: "Male",
      user_id: 108,
      mentor_id: 1008,
      government_id: "https://example.com/gov-id/george-black",
      work_email: "george.black@example.com",
      linkedin_profile: "https://linkedin.com/in/george-black",
      additional_info: "Specialized in Cloud Computing.",
      created_at: "2024-08-05T10:50:00Z",
      updated_at: "2024-12-31T13:00:00Z",
      degree_certificate: "https://example.com/certificates/george-black-degree",
      additional_file: []
    }
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const mentorsPerPage = 3;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const currentMentors = mentorsVarifyData.slice(
    currentPage * mentorsPerPage,
    currentPage * mentorsPerPage + mentorsPerPage
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
        <Row>
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Total {title}</Card.Title>
                <Card.Text>{data.total}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Open {title}</Card.Title>
                <Card.Text>{data.open || data.active}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>Closed/Completed {title}</Card.Title>
                <Card.Text>{data.closed || data.inactive}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
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

  async function getMentors(){
    const responce = await axiosInstance.get("", {
      params:{
        currentPage,
        limit
    }})

    setMentors(responce.data.mentors);
  }

  useEffect(() => {
    // call api here
    // ...
    getMentors()

    setMentors(mentorsVarifyData.slice(currentPage * mentorsPerPage, (currentPage + 1) * mentorsPerPage));
  }, [currentPage])

  return (
    <Container>
      <h2 className="text-center m-3 fw-bold">Admin Dashboard</h2>
      <Navbar bg="light" expand="md">
        <Nav>
          <Nav.Link onClick={() => setActiveTab("mentors")} active={activeTab === "mentors"}>
            Mentors
          </Nav.Link>
          <Nav.Link onClick={() => setActiveTab("workshops")} active={activeTab === "workshops"}>
            Workshops
          </Nav.Link>
          <Nav.Link onClick={() => setActiveTab("applications")} active={activeTab === "applications"}>
            Job Applications
          </Nav.Link>
          <Nav.Link onClick={() => setActiveTab("verifyMentors")} active={activeTab === "verifyMentors"}>
            Verify Mentors
          </Nav.Link>
        </Nav>
      </Navbar>

      <Row>
        <Col>
          {activeTab === "mentors" && renderTabContent("mentors")}
          {activeTab === "workshops" && renderTabContent("workshops")}
          {activeTab === "applications" && renderTabContent("applications")}
          {activeTab === "verifyMentors" && (
            <div style={{ padding: "20px" }}>
              <h4>Verify Mentors</h4>
              <Row>
                {/* Left Section */}
                <Col md={6} className="border-end">
                  <div className="d-flex flex-column" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {mentorsVarifyData.map((mentor) => (
                      <div
                        className="d-flex justify-content-between align-items-center"
                        key={mentor.id}
                        style={{
                          cursor: "pointer",
                          marginBottom: "10px",
                          padding: "10px",
                          border: (selectedMentor!==null && selectedMentor.id === mentor.id) ? "2px solid blue" : "1px solid #ddd",
                          borderRadius: "5px",
                          backgroundColor: (selectedMentor!==null && selectedMentor.id === mentor.id) ? "#f0f8ff" : "grey",
                        }}
                        onClick={() => setSelectedMentor(mentor)}
                      >
                        <p className="fw-bold">{mentor.name}</p>
                        <p>{mentor.updated_at}</p>
                      </div>
                    ))}
                  </div>
                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(mentorsVarifyData.length / mentorsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center mt-3"}
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
                      onVerify={(mentor) => console.log("Verified:", mentor)}
                      onDecline={(mentor) => console.log("Declined:", mentor)}
                    />
                  ) : (
                    <div className="text-center text-muted" style={{ marginTop: "50px" }}>
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
