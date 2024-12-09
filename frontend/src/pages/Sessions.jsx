import React, { useState, useEffect } from "react";
import { Container, Nav, Tab, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import SessionCard from "../components/SessionCard";

// Example fetch function
const fetchSessions = async (tab, page) => {
  const pageSize = 3; // Number of items per page
  const allUpcoming = [
    {
      date: "Friday, September 13",
      time: "3:30PM",
      status: "Confirmed",
      name: "Vacha Buch",
      sessionTitle: "React Workshop",
    },
    {
      date: "Saturday, September 14",
      time: "11:00AM",
      status: "Pending",
      name: "Varad Chaudhari",
      sessionTitle: "JavaScript Basics",
    },
    {
      date: "Monday, September 16",
      time: "2:00PM",
      status: "Confirmed",
      name: "Ravi Patel",
      sessionTitle: "Node.js Deep Dive",
    },
    {
      date: "Wednesday, September 18",
      time: "4:00PM",
      status: "Confirmed",
      name: "Anjali Mehta",
      sessionTitle: "Bootstrap Fundamentals",
    },
    {
      date: "Thursday, September 19",
      time: "5:30PM",
      status: "Pending",
      name: "Priya Shah",
      sessionTitle: "CSS Animations",
    },
  ];

  const allHistory = [
    {
      date: "Friday, September 13",
      time: "3:30PM",
      status: "Completed",
      name: "Henil Patel",
      sessionTitle: "React Workshop",
    },
    {
      date: "Saturday, September 14",
      time: "11:00AM",
      status: "Cancelled",
      name: "Ayush Khubchandani",
      sessionTitle: "JavaScript Basics",
    },
    {
      date: "Monday, September 16",
      time: "2:00PM",
      status: "Completed",
      name: "Meera Shah",
      sessionTitle: "Node.js Deep Dive",
    },
    {
      date: "Wednesday, September 18",
      time: "4:00PM",
      status: "Completed",
      name: "Vishal Joshi",
      sessionTitle: "Bootstrap Fundamentals",
    },
    {
      date: "Thursday, September 19",
      time: "5:30PM",
      status: "Cancelled",
      name: "Karan Shah",
      sessionTitle: "CSS Animations",
    },
  ];

  const sessions = tab === "Upcoming" ? allUpcoming : allHistory;
  const offset = (page - 1) * pageSize;
  const paginatedSessions = sessions.slice(offset, offset + pageSize);

  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ sessions: paginatedSessions, total: sessions.length }),
      500
    ); // Simulate API delay
  });
};

const Sessions = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [sessions, setSessions] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 3; // Number of items per page

  // Fetch sessions when the active tab or page changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { sessions, total } = await fetchSessions(activeTab, currentPage);
      //   const responce = await axios.get("/api/sessions", {
      //     params: {
      //       currentPage,
      //       completionStatus: activeTab,
      //     },
      //   });
      //   setSessions(responce.sessions);
      //   setTotalSessions(responce.totalPages);
      setSessions(sessions);
      setTotalSessions(total);
      setIsLoading(false);
    };
    fetchData();
  }, [activeTab, currentPage]);

  // Handle pagination page change
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  return (
    <Container>
      {/* Static heading */}
      <h3 className="my-4">Sessions</h3>
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
              className={`nav-link ${activeTab === "Completed" ? "active" : ""
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
                <SessionCard key={index} {...session} />
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
