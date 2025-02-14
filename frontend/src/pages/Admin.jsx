import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Spinner } from 'react-bootstrap';
import { Users, Calendar, Book, UserCheck, Activity } from 'react-feather';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell
} from 'recharts';
import {
  getUserAnalytics,
  getSessionAnalytics,
  getWorkshopAnalytics,
  getMentorsToVerify,
  verifyMentor,
  deleteMentor
} from '../apis/admin';
import StatCard from '../components/StatCard';
import MentorDetailsCard from "../components/MentorDetailsCard";
import ReactPaginate from "react-paginate";

function Admin() {
  // Analytics states
  const [userAnalytics, setUserAnalytics] = useState({
    statistics: {
      totalUsers: 0,
      totalMentors: 0,
      activeUsers: 0
    },
    monthlyGrowth: []
  });

  const [sessionAnalytics, setSessionAnalytics] = useState({
    statistics: {
      totalSessions: 0,
      completedSessions: 0,
      pendingSessions: 0,
      cancelledSessions: 0
    },
    recentSessions: []
  });

  const [workshopAnalytics, setWorkshopAnalytics] = useState({
    statistics: {
      totalWorkshops: 0,
      activeWorkshops: 0
    },
    categoryDistribution: []
  });

  // Mentor verification states
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 3;

  // Data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (activeTab === 'dashboard') {
          const [userRes, sessionRes, workshopRes] = await Promise.all([
            getUserAnalytics(),
            getSessionAnalytics(),
            getWorkshopAnalytics()
          ]);

          console.log('User Analytics:', userRes.data);
          console.log('Session Analytics:', sessionRes.data);
          console.log('Workshop Analytics:', workshopRes.data);

          setUserAnalytics({
            statistics: userRes.data.statistics,
            monthlyGrowth: userRes.data.monthlyGrowth.map(item => ({
              month: new Date(item.created_at).toLocaleDateString('en-US', {
                month: 'short',
                year: '2-digit'
              }),
              users: item._count.id
            }))
          });

          setSessionAnalytics({
            statistics: sessionRes.data.statistics,
            recentSessions: sessionRes.data.recentSessions || []
          });

          setWorkshopAnalytics({
            statistics: workshopRes.data.statistics,
            categoryDistribution: workshopRes.data.categoryDistribution || []
          });
        } else if (activeTab === 'mentor-verify') {
          const res = await getMentorsToVerify();
          setMentors(res.data.mentors);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const currentMentors = mentors.slice(
    currentPage * limit,
    (currentPage + 1) * limit
  );

  if (isLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className='container-fluid' style={{ padding: 0 }}>
      <div className="row min-vh-100">
        {/* Sidebar */}
        <div className='col-12 col-md-3'>
          <div className="bg-dark text-white p-3" style={{ width: '250px', height: '100vh', position: 'fixed' }}>
            <h3 className="text-center mb-4">Admin Panel</h3>
            <Nav defaultActiveKey="dashboard" className="flex-column">
              <Nav.Item>
                <Nav.Link
                  onClick={() => setActiveTab('dashboard')}
                  className={`text-white ${activeTab === 'dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  onClick={() => setActiveTab('mentor-verify')}
                  className={`text-white ${activeTab === 'mentor-verify' ? 'active' : ''}`}
                >
                  Mentor Verification
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </div>

        {/* Main Content */}
        <div className='col-12 col-md-9 offset-md-3'>
          <div className="p-4">
            {activeTab === 'dashboard' && (
              <>
                <h2 className="mb-4">Analytics Dashboard</h2>

                {/* Stats Overview */}
                <Row className="mb-4 g-4">
                  <Col xs={12} md={6} lg={3}>
                    <StatCard
                      icon={Users}
                      title="Total Users"
                      value={userAnalytics.statistics.totalUsers}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <StatCard
                      icon={UserCheck}
                      title="Total Mentors"
                      value={userAnalytics.statistics.totalMentors}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <StatCard
                      icon={Calendar}
                      title="Total Sessions"
                      value={sessionAnalytics.statistics.totalSessions}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={3}>
                    <StatCard
                      icon={Book}
                      title="Total Workshops"
                      value={workshopAnalytics.statistics.totalWorkshops}
                    />
                  </Col>
                </Row>

                {/* Charts Row 1 */}
                <Row className="g-4 mb-4">
                  <Col xs={12} lg={6}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title as="h5" className="mb-4">User Growth</Card.Title>
                        <div className="chart-container" style={{ height: '300px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            {userAnalytics.monthlyGrowth.length > 0 ? (
                              <LineChart data={userAnalytics.monthlyGrowth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="users" stroke="#0d6efd" strokeWidth={2} />
                              </LineChart>
                            ) : (
                              <div className="text-center text-muted">No data available</div>
                            )}
                          </ResponsiveContainer>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col xs={12} lg={6}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title as="h5" className="mb-4">Session Distribution</Card.Title>
                        <div className="chart-container" style={{ height: '300px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Completed', value: sessionAnalytics.statistics.completedSessions, color: '#28a745' },
                                  { name: 'Pending', value: sessionAnalytics.statistics.pendingSessions, color: '#ffc107' },
                                  { name: 'Cancelled', value: sessionAnalytics.statistics.cancelledSessions, color: '#dc3545' }
                                ]}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {(entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                )}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                {/* Charts Row 2 */}
                <Row className="g-4">
                  <Col xs={12} lg={6}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title as="h5" className="mb-4">Workshop Categories</Card.Title>
                        <div className="chart-container" style={{ height: '300px' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workshopAnalytics.categoryDistribution}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="category" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="count" fill="#198754" name="Workshops" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col xs={12} lg={6}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title as="h5" className="mb-4">Recent Sessions</Card.Title>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                          {sessionAnalytics.recentSessions.map((session, index) => (
                            <div key={index} className="p-2 border-bottom">
                              <p className="mb-1">Session with {session.mentor?.name}</p>
                              <small className="text-muted">
                                {new Date(session.date).toLocaleDateString()}
                              </small>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}

            {/* Mentor Verification Tab */}
            {activeTab === 'mentor-verify' && (
              <div>
                <h2 className="mb-4">Mentor Verification</h2>
                <Row>
                  <Col md={6} className="border-end">
                    <div className="d-flex flex-column" style={{ maxHeight: "400px", overflowY: "auto" }}>
                      {currentMentors.map((mentor) => (
                        <div
                          key={mentor.id}
                          style={{
                            cursor: "pointer",
                            border: selectedMentor?.id === mentor.id ? "2px solid blue" : "1px solid #ddd",
                            borderRadius: "5px",
                            backgroundColor: selectedMentor?.id === mentor.id ? "#f0f8ff" : "#bdbfbe",
                          }}
                          onClick={() => setSelectedMentor(mentor)}
                          className="px-4 py-2 mb-2"
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

                  <Col md={6}>
                    {selectedMentor ? (
                      <MentorDetailsCard
                        mentor={selectedMentor}
                        onVerify={async (mentor) => {
                          try {
                            await verifyMentor(mentor.id);
                            setSelectedMentor(null);
                            const res = await getMentorsToVerify();
                            setMentors(res.data.mentors);
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        onDecline={async (mentor) => {
                          try {
                            await deleteMentor(mentor.id);
                            setSelectedMentor(null);
                            const res = await getMentorsToVerify();
                            setMentors(res.data.mentors);
                          } catch (err) {
                            console.error(err);
                          }
                        }}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;