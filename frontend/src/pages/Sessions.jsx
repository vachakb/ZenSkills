import React, { useState, useEffect } from "react";
import { Container, Nav, Tab, Spinner, Button, Modal, Badge, Card, Row, Col } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import SessionCard from "../components/SessionCard";
import { getAllUserSessions } from "../apis/session";
import { useNavigate } from "react-router-dom";
import useProfile from "../hooks/useProfile";
import { getAllRoomIds, getMeetingRecording, getToken } from "../apis/meeting";

const Sessions = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [sessions, setSessions] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const statuses = [
    "pending",
    "accepted",
    "rejected",
    "rescheduled",
    "cancelled",
    "completed",
  ];

  const [statusFilters, setStatusFilters] = useState(["pending", "accepted"]);
  const [showFilters, setShowFilters] = useState(true);
  const [showRecordingsModal, setShowRecordingsModal] = useState(false);
  const [recordingSessions, setRecordingSessions] = useState([])

  const pageSize = 3; // Number of items per page

  const { profile, isProfileLoading } = useProfile();

  const navigate = useNavigate();

  const onLoad = () => {
    setIsLoading(true);

    getAllUserSessions(statusFilters.join(","))
      .then((res) => {
        setSessions(res.data.bookings);
        console.log(res.data.bookings);
        setIsLoading(false);
      })
      .catch((err) => console.error(err));

    getAllRoomIds()
      .then((res) => {
        setRecordingSessions(res.data.sessions);
      })
      .catch(error => console.error(error))
  };

  // Fetch sessions when the active tab or page changes
  useEffect(() => {
    onLoad();
  }, [currentPage]);

  useEffect(() => {
    let timeoutId;

    if (!initialLoading) {
      timeoutId = setTimeout(() => {
        onLoad();
      }, 500)
    } else {
      setInitialLoading(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [statusFilters]);

  const downloadMeetingRecording = async (token, roomId) => {
    const meetingRecording = await getMeetingRecording(token, roomId);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = meetingRecording.data.fileUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Handle pagination page change
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "clock",
      accepted: "check-circle",
      rejected: "times-circle",
      rescheduled: "sync",
      cancelled: "ban",
      completed: "star"
    };
    return icons[status] || "circle";
  };

  if (isProfileLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  const statusColors = {
    pending: { bg: "#FFF3CD", text: "#856404", border: "#FFEEBA" },
    accepted: { bg: "#D4EDDA", text: "#155724", border: "#C3E6CB" },
    rejected: { bg: "#F8D7DA", text: "#721C24", border: "#F5C6CB" },
    rescheduled: { bg: "#E2E3E5", text: "#383D41", border: "#D6D8DB" },
    cancelled: { bg: "#F8D7DA", text: "#721C24", border: "#F5C6CB" },
    completed: { bg: "#CCE5FF", text: "#004085", border: "#B8DAFF" }
  };

  return (
    <>
      {/* Recordings Modal */}
      <Modal
        size="xl"
        show={showRecordingsModal}
        centered
        onHide={() => setShowRecordingsModal(false)}
      >
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <i className="fas fa-video me-2"></i>
            Session Recordings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-3 p-4">
          <h5 className="text-muted">Select a session to download its recording</h5>
          <div className="d-flex flex-wrap gap-3">
            {recordingSessions.map(value => (
              <Card
                key={value.room_id}
                className="recording-card hover-shadow"
                style={{ minWidth: '280px' }}
              >
                <Card.Body>
                  <h6>{value.session.name}</h6>
                  <small className="text-muted">Room ID: {value.room_id}</small>
                  <Button
                    variant="outline-primary"
                    className="w-100 mt-3"
                    onClick={async () => {
                      const tokenRes = await getToken();
                      downloadMeetingRecording(tokenRes.data.token, value.room_id);
                    }}
                  >
                    <i className="fas fa-download me-2"></i>
                    Download Recording
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      <Container fluid className="py-4 px-4">
        {/* Dashboard Stats */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Total Sessions</h6>
                    <h3 className="mb-0">{totalSessions}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <i className="fas fa-calendar-alt text-primary fa-2x"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Upcoming</h6>
                    <h3 className="mb-0">
                      {sessions.filter(s => s.status === "accepted").length}
                    </h3>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded">
                    <i className="fas fa-clock text-success fa-2x"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Completed</h6>
                    <h3 className="mb-0">
                      {sessions.filter(s => s.status === "completed").length}
                    </h3>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded">
                    <i className="fas fa-check-circle text-info fa-2x"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Cancelled</h6>
                    <h3 className="mb-0">
                      {sessions.filter(s => s.status === "cancelled").length}
                    </h3>
                  </div>
                  <div className="bg-danger bg-opacity-10 p-3 rounded">
                    <i className="fas fa-times-circle text-danger fa-2x"></i>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Header Section with improved styling */}
        <Card className="mb-4 shadow-sm border-0">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <h3 className="m-0">
                  <i className="fas fa-calendar-check text-primary me-2"></i>
                  My Sessions
                </h3>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                {profile.isMentor && (
                  <Button
                    variant="primary"
                    className="d-flex align-items-center gap-2"
                    onClick={() => navigate("/createsession_1")}
                  >
                    <i className="fas fa-plus"></i>
                    Create Session
                  </Button>
                )}
                <Button
                  variant={showFilters ? "secondary" : "outline-secondary"}
                  className="d-flex align-items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className="fas fa-filter"></i>
                  Filters
                  {statusFilters.length > 0 && (
                    <Badge bg="primary" pill>{statusFilters.length}</Badge>
                  )}
                </Button>
                {!profile.isMentor && (
                  <Button
                    variant="info"
                    className="d-flex align-items-center gap-2 text-white"
                    onClick={() => setShowRecordingsModal(true)}
                  >
                    <i className="fas fa-video"></i>
                    Recordings
                  </Button>
                )}
              </div>
            </div>

            {/* Enhanced Filters Section */}
            {showFilters && (
              <div className="mt-4 border-top pt-4">
                <small className="text-muted text-uppercase fw-bold">Filter by status</small>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {statuses.map(status => (
                    <Button
                      key={status}
                      variant={statusFilters.includes(status) ? "light" : "outline-light"}
                      className="d-flex align-items-center gap-2 text-capitalize"
                      style={{
                        backgroundColor: statusFilters.includes(status) ? statusColors[status].bg : 'transparent',
                        color: statusColors[status].text,
                        borderColor: statusColors[status].border,
                      }}
                      onClick={() => {
                        if (statusFilters.includes(status)) {
                          setStatusFilters(statusFilters.filter(value => value !== status));
                        } else {
                          setStatusFilters([...statusFilters, status])
                        }
                      }}
                    >
                      <i className={`fas fa-${getStatusIcon(status)}`}></i>
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Sessions List */}
        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {sessions.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-calendar-times fa-3x mb-3"></i>
                <h5>No sessions found</h5>
                <p>Try adjusting your filters or create a new session</p>
              </div>
            ) : (
              sessions.map((session) => (
                <SessionCard
                  session={session}
                  profile={profile}
                  onAction={onLoad}
                  key={session.id}
                />
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && sessions.length > 0 && (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={Math.ceil(totalSessions / pageSize)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName="pagination justify-content-center mt-4 gap-2"
            pageClassName="page-item rounded"
            pageLinkClassName="page-link rounded"
            previousClassName="page-item rounded"
            previousLinkClassName="page-link rounded"
            nextClassName="page-item rounded"
            nextLinkClassName="page-link rounded"
            breakClassName="page-item rounded"
            breakLinkClassName="page-link rounded"
            activeClassName="active"
          />
        )}
      </Container>
    </>
  );
};

export default Sessions;
