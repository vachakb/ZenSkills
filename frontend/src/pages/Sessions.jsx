import React, { useState, useEffect } from "react";
import { Container, Nav, Tab, Spinner, Button, Modal } from "react-bootstrap";
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

  const downloadMeetingRecording = async (token, roomId) =>  {
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

  if (isProfileLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Modal
        size="xl"
        show={showRecordingsModal}
        centered
        onHide={() => setShowRecordingsModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Recordings</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column gap-2">
          <h5>Select a meeting to download its recording</h5>
          <div className="d-flex gap-2">
            {recordingSessions.map(value => (
              <Button
                onClick={async () => {
                  const tokenRes = await getToken();
                  const token = tokenRes.data.token;
                  downloadMeetingRecording(token, value.room_id);
                }}
              >
                {value.session.name} - Room ID: {value.room_id}
              </Button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRecordingsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
      <Container className="d-flex flex-column gap-4">
        <div className="d-flex align-items-center gap-2">
          <h3 className="m-0">Sessions</h3>
          {profile.isMentor && <Button onClick={() => navigate("/createsession_1")}>Create session</Button>}
          <Button onClick={() => setShowFilters(!showFilters)}>Filters{statusFilters.length > 0 && ` ${statusFilters.length}`}</Button>
          {!profile.isMentor && <Button onClick={() => setShowRecordingsModal(true)}>Show recordings</Button>}
        </div>
        {showFilters &&
          <div className="d-flex gap-2">
            {statuses.map(status => (
              <Button style={{
                backgroundColor: statusFilters.includes(status)
                  ? "#07d100"
                  : "rgb(233, 236, 239)",
                borderColor: statusFilters.includes(status)
                  ? "#07d100"
                  : "rgb(233, 236, 239)"
              }} key={status} onClick={() => {
                if (statusFilters.includes(status)) {
                  setStatusFilters(statusFilters.filter(value => value !== status));
                } else {
                  setStatusFilters([...statusFilters, status])
                }
              }}>{status}</Button>
            ))}
          </div>
        }
        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="d-flex flex-column">
            {sessions.map((session) => (
              <SessionCard session={session} profile={profile} onAction={() => onLoad()} key={session.id} />
            ))}
          </div>
        )}

        {/* Shared Pagination */}
        {!isLoading && (
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={Math.ceil(totalSessions / pageSize)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageChange}
            containerClassName={"pagination justify-content-center mt-4"}
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
        )}
      </Container>
    </>
  );
};

export default Sessions;
