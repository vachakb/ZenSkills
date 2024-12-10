import React, { useState, useEffect } from "react";
import { Container, Nav, Tab, Spinner, Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import SessionCard from "../components/SessionCard";
import { getAllUserSessions } from "../apis/session";
import { useNavigate } from "react-router-dom";
import useProfile from "../hooks/useProfile";

const Sessions = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [sessions, setSessions] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 3; // Number of items per page

  const { profile, isProfileLoading } = useProfile();

  const navigate = useNavigate();

  const onLoad = () => {
    getAllUserSessions()
      .then((res) => setSessions(res.data.bookings))
      .catch((err) => console.error(err));
  };

  // Fetch sessions when the active tab or page changes
  useEffect(() => {
    onLoad();
  }, [activeTab, currentPage]);

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
    <Container>
      {/* Static heading */}
        <div className="d-flex align-items-center gap-2">
          <h3 className="my-4">Sessions</h3>
          { profile.isMentor && <Button onClick={() => navigate("/createsession_1")}>Create session</Button> }
        </div>
      {/* <p className="text-muted">
        The Timings are based on your selected Time Zone Asia/Calcutta{" "}
        <a href="#">Update</a>
      </p> */}

      {/* Tabs */}
      <Tab.Container
        activeKey={activeTab}
        onSelect={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
      >
        {/* <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="Upcoming">Upcoming</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="History">History</Nav.Link>
          </Nav.Item>
        </Nav> */}
        <ul className="nav nav-tabs mb-4" id="workshopTabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "Upcoming" ? "active" : ""}`}
              onClick={() => setActiveTab("Upcoming")}
            >
              Upcoming
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "Completed" ? "active" : ""
              }`}
              onClick={() => setActiveTab("Completed")}
            >
              Completed
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <Tab.Content className="mt-4">
          {isLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              {sessions.map((session, index) => (
                <SessionCard session={session} key={session.id} />
              ))}
            </>
          )}
        </Tab.Content>
      </Tab.Container>

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
  );
};

export default Sessions;
