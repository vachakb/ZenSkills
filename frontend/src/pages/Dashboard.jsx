import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Dashboard = () => {
  return (
    <Container fluid className="p-4">
      <Row className="text-center mb-4">
        <Col>
          <h1>Welcome to Our Platform!</h1>
          <p>Explore our platform's features and get started on your journey.</p>
        </Col>
      </Row>

      {/* Mentors Section */}
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Find Mentors</Card.Title>
              <Card.Text>
                Our AI-powered system helps you find the most relevant mentors based on your needs. Whether you're looking for career guidance, technical advice, or personal growth, we've got you covered.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Jobs Section */}
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Find Jobs</Card.Title>
              <Card.Text>
                Browse available job listings that match your skills and career aspirations. You can explore jobs by location, industry, and type.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Workshops Section */}
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Workshops</Card.Title>
              <Card.Text>
                Join a wide range of workshops to enhance your skills in various fields. Whether you're looking to improve technical expertise or soft skills, we offer a variety of topics.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Session Booking Section */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Book a Session</Card.Title>
              <Card.Text>
                Schedule a session with a mentor to discuss your goals, seek advice, or gain insights on specific topics.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* 1-on-1 Video Call Session Section */}
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>1-on-1 Video Call</Card.Title>
              <Card.Text>
                Have a personal, face-to-face conversation with your mentor through seamless video calls. Perfect for in-depth discussions and learning.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Call to Action */}
      <Row className="text-center">
        <Col>
          <h3>Get Started Today</h3>
          <p>Sign up to start exploring these amazing features and connect with the right people.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
