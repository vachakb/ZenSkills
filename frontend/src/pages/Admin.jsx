import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import BarChartComponent from '../components/barchartComponent';
import MentorDetailsCard from "../components/MentorDetailsCard";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { axiosInstance } from "../apis/commons";
import { deleteMentor, getMentorsToVerify, verifyMentor } from "../apis/admin";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Data for the job applications chart (example data from Jan to Dec)
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Job Applications',
        data: [10, 20, 30, 25, 40, 50, 35, 45, 60, 70, 80, 90],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        fill: true,
      },
    ],
  };

  // Chart options to make it larger
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Job Applications per Month',
      },
    },
  };

  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 3;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const currentMentors = mentors.slice(
    currentPage * limit,
    currentPage * limit + limit,
  );

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
    <div className='container' style={{ paddingLeft: "0", paddingRight: "0" }}>
      <div className="row min-vh-100">
        {/* Left Sidebar (Navbar) */}
        <div className='col-12 col-md-3'>
          <div className="bg-dark text-white p-3" style={{ width: '250px', height: '100vh' }}>
            <h3 className="text-center">Stats</h3>
            <Nav defaultActiveKey="users" className="flex-column">
              <Nav.Item>
                <Nav.Link onClick={() => setActiveTab('users')} className="text-white">Users</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => setActiveTab('workshop')} className="text-white">Workshop</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => setActiveTab('job-application')} className="text-white">Job Application</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => setActiveTab('mentor-verify')} className="text-white">Mentor Verify</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </div>

        <div className='col-12 col-md-9'>
          {/* Main Content Area */}
          <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 80px)', height: '100%' }}>
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className="">Users Stats</h3>
                <div className='container g-3 text-center'>
                  <div className='row g-3 mb-3'>
                    <div className='col-12 col-md-4'></div>
                    <div className='col-12 col-md-4 fw-semibold fs-3'>Male</div>
                    <div className='col-12 col-md-4 fw-semibold fs-3'>Female</div>
                  </div>
                  <div className='row g-3 m-3'>
                    <div className='col-12 col-md-4 fw-semibold fs-3'>Mentee</div>
                    <div className='col-12 col-md-4 border rounded p-2'>100</div>
                    <div className='col-12 col-md-4 border rounded p-2'>40</div>
                  </div>
                  <div className='row g-3 m-3'>
                    <div className='col-12 col-md-4 fw-semibold fs-3'>Mentor</div>
                    <div className='col-12 col-md-4 border rounded p-2'>50</div>
                    <div className='col-12 col-md-4 border rounded p-2'>60</div>
                  </div>
                </div>
              </div>
            )}

            {/* Workshops Tab */}
            {activeTab === 'workshop' && (
              <div>
                <h3 className="mb-4">Workshop Stats</h3>
                <Row>
                  <Col md={6}>
                    <Card className="mb-4">
                      <Card.Body>
                        <h5 className="card-title">Completed</h5>
                        <p>10 Workshops</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="mb-4">
                      <Card.Body>
                        <h5 className="card-title">Upcoming</h5>
                        <p>5 Workshops</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <div>
                  <BarChartComponent />
                </div>
              </div>
            )}

            {/* Job Applications Tab */}
            {activeTab === 'job-application' && (
              <div>
                <h3 className="mb-3">Job Application Stats</h3>
                <Row>
                  <Col md={6}>
                    <Card className="mb-4">
                      <Card.Body>
                        <h5 className="card-title">Open</h5>
                        <p>15 Applications</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="mb-4">
                      <Card.Body>
                        <h5 className="card-title">Closed</h5>
                        <p>30 Applications</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Chart for Job Applications */}
                <h5 className="mb-2">Job Applications per Month</h5>
                <div style={{ position: 'relative', height: '400px' }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
            )}

            {/* Mentor Verify Tab (Blank) */}
            {activeTab === 'mentor-verify' && (
              <div>
                <h3 className="mb-4">Mentor Verification</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
