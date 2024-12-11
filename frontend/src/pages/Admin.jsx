import React, { useState } from "react";
import { Container, Row, Col, Navbar, Nav, Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("mentors");

  // Dummy Data for each tab
  const mentorsData = {
    total: 120,
    active: 90,
    inactive: 30,
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Active Mentors",
          data: [30, 40, 35, 50, 60, 70],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
        {
          label: "Inactive Mentors",
          data: [10, 20, 15, 25, 30, 20],
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
      ],
    },
  };

  const workshopsData = {
    total: 50,
    upcoming: 15,
    completed: 35,
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Upcoming Workshops",
          data: [5, 4, 8, 6, 7, 5],
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
        {
          label: "Completed Workshops",
          data: [3, 7, 5, 9, 6, 8],
          borderColor: "rgb(153, 102, 255)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          fill: true,
        },
      ],
    },
  };

  const jobApplicationsData = {
    total: 200,
    open: 50,
    closed: 150,
    chart: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Open Applications",
          data: [12, 15, 18, 20, 25, 30],
          borderColor: "rgb(255, 159, 64)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          fill: true,
        },
        {
          label: "Closed Applications",
          data: [10, 20, 15, 25, 30, 40],
          borderColor: "rgb(255, 205, 86)",
          backgroundColor: "rgba(255, 205, 86, 0.2)",
          fill: true,
        },
      ],
    },
  };

  // Function to render tab content
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
      <div className="">
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

  return (
    <Container>
      <h2 className="text-center m-3 fw-bold">Admin Dashboard</h2>
      <Navbar bg="light" expand="md">
        <Nav className="">
          <Nav.Link onClick={() => setActiveTab("mentors")} active={activeTab === "mentors"}>Mentors</Nav.Link>
          <Nav.Link onClick={() => setActiveTab("workshops")} active={activeTab === "workshops"}>Workshops</Nav.Link>
          <Nav.Link onClick={() => setActiveTab("applications")} active={activeTab === "applications"}>Job Applications</Nav.Link>
          <Nav.Link onClick={() => setActiveTab("verifyMentors")} active={activeTab === "verifyMentors"}>Verify Mentors</Nav.Link>
        </Nav>
      </Navbar>

      {/* Render content based on active tab */}
      <Row>
        <Col>
          {activeTab === "mentors" && renderTabContent("mentors")}
          {activeTab === "workshops" && renderTabContent("workshops")}
          {activeTab === "applications" && renderTabContent("applications")}
          {activeTab === "verifyMentors" && (
            <div style={{ padding: "20px" }}>
              <h4>Verify mentors</h4>
              
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
