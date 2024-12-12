import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  Card,
  Tabs,
  Tab,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import {
  getAllMentees,
  getAllReferrals,
  updateRating,
  updateReferralStatus,
} from "../apis/mentors";
import { API_URL } from "../apis/commons";

const ReferralRequests = () => {
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [activeTab, setActiveTab] = useState("referralRequests");
  const [modalData, setModalData] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const [mentees, setMentees] = useState([]);

  const handleSelectReferral = (referral) => {
    setSelectedReferral(referral);
  };

  const handleOpenModal = (mentee) => {
    const existingMentee = mentees.find((_mentee) => _mentee.id === mentee.id);
    setModalData({
      ...mentee,
      rating: existingMentee?.ratings[0]?.rating || "",
      comment: existingMentee?.ratings[0]?.comment || "",
    });
  };

  const handleSaveReferral = () => {
    updateRating({
      mentee_id: modalData.id,
      rating: modalData.rating,
      comment: modalData.comment,
    })
      .then(() => {
        setModalData(null);
        onLoad();
      })
      .catch((err) => console.error(err));
  };

  // Filter mentees based on the search query
  const filteredMentees = mentees.filter((mentee) =>
    mentee.User.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Helper function to render stars based on rating
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i < rating ? "gold" : "gray",
            fontSize: "2rem", // Increased size for better visibility
            marginRight: "5px", // Space between stars
          }}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  const [isLoading, setIsLoading] = useState(true);

  const onLoad = async () => {
    setIsLoading(true);
    const referralsRes = await getAllReferrals();
    setReferrals(referralsRes.data.referrals);
    setSelectedReferral(null);

    const menteesRes = await getAllMentees();
    setMentees(menteesRes.data.mentees);
    setIsLoading(false);
  };

  useEffect(() => {
    onLoad();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Container fluid>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mt-4"
      >
        {/* Referral Requests Tab */}
        <Tab eventKey="referralRequests" title="Referral Requests">
          <Row className="mt-4">
            <Col md={3} className="border-end p-3">
              <h5 className="text-center text-primary">Referral Requests</h5>
              <ListGroup>
                {referrals.map((referral) => (
                  <ListGroup.Item
                    key={referral.id}
                    action
                    onClick={() => handleSelectReferral(referral)}
                    className="mb-2 shadow-sm p-3 rounded-lg"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "10px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div>
                      <h5>{referral.mentee.User.name}</h5>
                      <h6 className="m-0">{referral.status}</h6>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={9}>
              {selectedReferral ? (
                <Card
                  className="shadow-lg rounded-lg mb-4"
                  style={{ position: "relative" }}
                >
                  <Card.Body className="d-flex">
                    <div className="flex-grow-1">
                      <Card.Title>
                        Details for {selectedReferral.mentee.User.name}
                      </Card.Title>
                      <Card.Text>
                        <strong>Job URL:</strong>{" "}
                        <a
                          href={selectedReferral.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary"
                        >
                          {selectedReferral.job_url}
                        </a>
                      </Card.Text>
                      <Card.Text>
                        <strong>Cover Letter:</strong> {selectedReferral.reason}
                      </Card.Text>
                      <Card.Text>
                        <strong>Resume:</strong>{" "}
                        <a
                          href={`${API_URL}/api/auth/file/${selectedReferral.resume_id}`}
                          className="text-primary"
                          download
                        >
                          {selectedReferral.resume.filename}
                        </a>
                      </Card.Text>
                      <Card.Text>
                        <strong>Description:</strong>{" "}
                        {selectedReferral.description}
                      </Card.Text>
                      <div className="d-flex gap-2">
                        {selectedReferral.status === "PENDING" && (
                          <>
                            <Button
                              onClick={() => {
                                updateReferralStatus({
                                  referral_id: selectedReferral.id,
                                  status: "ACCEPTED",
                                })
                                  .then((_) => onLoad())
                                  .catch((err) => console.error(err));
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() => {
                                updateReferralStatus({
                                  referral_id: selectedReferral.id,
                                  status: "REJECTED",
                                })
                                  .then((_) => onLoad())
                                  .catch((err) => console.error(err));
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <h5 className="text-center text-muted">
                  Select a mentee to view details
                </h5>
              )}
            </Col>
          </Row>
        </Tab>

      </Tabs>

      {/* Modal for Rating and Comment */}
      {modalData && (
        <Modal show onHide={() => setModalData(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Rate & Comment for {modalData.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Star Rating (1-5)</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="5"
                  value={modalData.rating}
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }))
                  }
                  className="form-control-lg"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={modalData.comment}
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  className="form-control-lg"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalData(null)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveReferral}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default ReferralRequests;
