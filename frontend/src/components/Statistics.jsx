import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { VscChecklist } from "react-icons/vsc";
import { FaCheckSquare, FaIdCardAlt } from "react-icons/fa";

const Statistics = () => {
  const [expanded, setExpanded] = useState(false);

  // Example details
  const goalDetails = ["Complete project", "Attend workshop", "Read 5 books"];
  const sessionDetails = ["Career Guidance", "Mock Interview", "Resume Review"];

  return (
    <div className="w-100">
      <Card
        className="p-1 shadow-sm"
        style={{
          marginTop: "13px",
          borderRadius: "10px",
          transition: "height 0.3s ease",
          overflow: "hidden",
          height: expanded ? "auto" : "260px", 
        }}
      >
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">STATISTICS</h5>
          <span
            className="px-2 py-1 text-center"
            style={{
              cursor: "pointer",
              color: "black",
              border: "1px solid grey",
              borderRadius: "20px",
              fontSize: "0.9rem",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "See less ▲" : "See more ▼"}
          </span>
        </Card.Header>
        <hr />
        <Card.Body>
          <Row className="gx-3 gy-4">
            {/* Sessions Completed */}
            <Col xs={12} md={6} className="d-flex align-items-center">
              <VscChecklist size={"3em"} className="me-3" />
              <div>
                <h6 className="mb-0">23</h6>
                <small>Sessions Completed</small>
                {expanded &&
                  sessionDetails.map((session, index) => (
                    <div
                      key={index}
                      className="mt-2 p-2"
                      style={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "10px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#555",
                          margin: 0,
                        }}
                      >
                        {session}
                      </p>
                    </div>
                  ))}
              </div>
            </Col>

            {/* Goals Achieved */}
            <Col xs={12} md={6} className="d-flex align-items-center">
              <FaCheckSquare size={"2.6em"} className="me-3" />
              <div>
                <h6 className="mb-0">5</h6>
                <small>Goals Achieved</small>
                {expanded &&
                  goalDetails.map((goal, index) => (
                    <div
                      key={index}
                      className="mt-2 p-2"
                      style={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "10px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#555",
                          margin: 0,
                        }}
                      >
                        {goal}
                      </p>
                    </div>
                  ))}
              </div>
            </Col>
          </Row>

          <hr />

          {/* Attendance */}
          <Row className="gy-3">
            <Col xs={12} className="d-flex align-items-center">
              <FaIdCardAlt size={"2.8em"} className="me-3" />
              <div>
                <h6 className="mb-0">97%</h6>
                <small>Average Attendance</small>
                {expanded && (
                  <div
                    className="mt-2 p-2"
                    style={{
                      backgroundColor: "#f9f9f9",
                      borderRadius: "10px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#555",
                        margin: 0,
                      }}
                    >
                      Excellent attendance rate across all sessions.
                    </p>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Statistics;
