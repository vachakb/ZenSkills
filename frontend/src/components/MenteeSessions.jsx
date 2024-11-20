import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const MenteeSessions = () => {
  const sessions = [
    {
      id: 1,
      title: 'Product management Interview Prep',
      date: '10 Sep 2024',
      time: '3:45 PM',
      status: 'Session in 5 mins',
      joinable: true,
    },
    {
      id: 2,
      title: 'Mentorship Session',
      date: '13 Sep 2024',
      time: '5:30 PM',
      status: 'Session in 3 days',
      joinable: false,
    },
  ];

  const handleJoin = (sessionId) => {
    alert(`Joining session ID: ${sessionId}`);
  };

  return (
    <Container className="mt-4 px-3 py-3"  style={{ border: "1px solid lightgrey", // Adds a light grey border
        borderRadius: "10px", }}>
      <Row className="align-items-center">
        <Col>
          <h5>SESSIONS</h5>
        </Col>
       
      </Row>
      <hr />
      <h6 className='mt-1 mb-3 fs-6' style={{color:'grey'}}>Upcoming sessions</h6>
      {sessions.map((session) => (
        <Card key={session.id} className="mb-3 shadow-sm" style={{borderRadius:'10px'}}>
          <Card.Body>
            <Row>
              <Col md={8}>
                <h6 className="fw-bold">{session.title}</h6>
                <p className="text-muted mb-1">
                  {session.date} | {session.time}
                </p>
                
              </Col>
              <Col
                md={4}
                className="text-md-end d-flex flex-column align-items-md-end justify-content-between"
              >
                {session.joinable ? (
                    
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="px-4"
                    onClick={() => handleJoin(session.id)}
                  >
                    Join
                  </Button>
                ) : (
                  <span className="badge bg-light text-dark py-2 px-3">
                    {session.status}
                  </span>
                )}
                {session.status.includes('mins') && (
                  <div className="text-primary mt-2 d-flex align-items-center p-1 " style={{background:'lightyellow',borderRadius:'7px',fontSize:'0.9rem'}}>
                   
                    <small>{session.status}</small>
                  </div>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default MenteeSessions;
