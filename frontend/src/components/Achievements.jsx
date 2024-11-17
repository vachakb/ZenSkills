import React, { useState } from "react";
import { Card, Row, Col } from "react-bootstrap";

const Achievements = () => {
  const [expanded, setExpanded] = useState(false);

  // Example achievements
  const achievements = [
    "Completed React Course",
    "Attended 5 Workshops",
    "Read 10 Books",
    "Participated in Hackathon",
    "Received Certification",
    "Helped 3 Mentees",
    "Won Coding Challenge",
    "Completed 50 Sessions",
    "Published Blog Post",
    "Finished Project X",
  ];

  return (
    <div className="w-100">
      <Card
        className="p-1 shadow-sm"
        style={{
          borderRadius: "10px",
          transition: "height 0.3s ease",
          overflow: "hidden",
          height: expanded ? "auto" : "230px", 
        }}
      >
        <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 pt-3">ACHIEVEMENTS</h5>
          <span
            className="px-2 py-1 mt-3"
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
          <Row className="gx-2 gy-3 justify-content-around">
            
            {achievements.slice(0, expanded ? achievements.length : 5).map((achievement, index) => (
              <Col xs={4} sm={3} md={2} className="d-flex flex-column align-items-center" key={index}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#0E003F",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    fontSize: "1.5rem",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <span>🏆</span> 
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "0.6rem",
                    color: "#555",
                    marginTop: "5px",
                    wordWrap: "break-word",
                  }}
                >
                  {achievement}
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Achievements;
