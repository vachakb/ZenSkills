import React, { useState } from "react";
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
} from "react-bootstrap";

const ReferralRequests = () => {
    const [selectedMentee, setSelectedMentee] = useState(null);
    const [activeTab, setActiveTab] = useState("referralRequests");
    const [modalData, setModalData] = useState(null);
    const [referrals, setReferrals] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");  // Search query state

    const mentees = [
        { id: 1, name: "Henil Patel", profileIcon: "👤" },
        { id: 2, name: "Varad Chaudhari", profileIcon: "👤" },
        { id: 3, name: "Priya Sharma", profileIcon: "👩" },
        { id: 4, name: "Aman Mehta", profileIcon: "👤" },
        { id: 5, name: "Ravi Yadav", profileIcon: "👤" },
    ];

    const referralRequests = [
        {
            id: 1,
            name: "Henil Patel",
            jobUrl: "https://job.url/1",
            coverLetter:
                "Dear Hiring Manager,I am excited to apply for the Software Developer position at Tech Solutions Inc. With a Bachelor’s degree in Computer Science and three years of experience in full-stack development...",
            resume: "Henil_Resume.pdf",
            description: "I am passionate about this role.",
        },
        {
            id: 2,
            name: "Varad Chaudhari",
            jobUrl: "https://job.url/2",
            coverLetter:
                "Dear Hiring Manager,I am excited to apply for the Software Developer position at Tech Solutions Inc. With a Bachelor’s degree in Computer Science and three years of experience in full-stack development...",
            resume: "Varad_Resume.pdf",
            description: "This role aligns with my experience.",
        },
    ];

    const handleSelectMentee = (mentee) => {
        setSelectedMentee(mentee);
    };

    const handleOpenModal = (mentee) => {
        const existingReferral = referrals.find((ref) => ref.id === mentee.id);
        setModalData({
            ...mentee,
            rating: existingReferral?.rating || "",
            comment: existingReferral?.comment || "",
        });
    };

    const handleSaveReferral = () => {
        setReferrals((prev) => {
            const existingIndex = prev.findIndex((ref) => ref.id === modalData.id);
            if (existingIndex !== -1) {
                prev[existingIndex] = modalData; // Update existing referral
                return [...prev];
            }
            return [...prev, modalData]; // Add new referral
        });
        setModalData(null);
    };

    // Filter mentees based on the search query
    const filteredMentees = mentees.filter((mentee) =>
        mentee.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                </span>
            );
        }
        return stars;
    };

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
                                {referralRequests.map((mentee) => (
                                    <ListGroup.Item
                                        key={mentee.id}
                                        action
                                        onClick={() => handleSelectMentee(mentee)}
                                        className="mb-2 shadow-sm p-3 rounded-lg"
                                        style={{
                                            cursor: "pointer",
                                            backgroundColor: "#f8f9fa",
                                            borderRadius: "10px",
                                            transition: "all 0.3s ease",
                                        }}
                                    >
                                        {mentee.name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                        <Col md={9}>
                            {selectedMentee ? (
                                <Card className="shadow-lg rounded-lg mb-4" style={{ position: "relative" }}>
                                    <Card.Body className="d-flex">
                                        <div className="flex-grow-1">
                                            <Card.Title>
                                                Details for {selectedMentee.name}
                                            </Card.Title>
                                            <Card.Text>
                                                <strong>Job URL:</strong>{" "}
                                                <a
                                                    href={selectedMentee.jobUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary"
                                                >
                                                    {selectedMentee.jobUrl}
                                                </a>
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Cover Letter:</strong>{" "}
                                                {selectedMentee.coverLetter}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Resume:</strong>{" "}
                                                <a href="#" className="text-primary">
                                                    {selectedMentee.resume}
                                                </a>
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Description:</strong>{" "}
                                                {selectedMentee.description}
                                            </Card.Text>
                                        </div>
                                        {/* Rating on the side of the card */}
                                        <div className="d-flex flex-column align-items-center" style={{ marginLeft: "20px" }}>
                                            <div>{renderStars(referrals.find(ref => ref.id === selectedMentee.id)?.rating || 0)}</div>
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

                {/* Make a Referral Tab */}
                <Tab eventKey="makeReferral" title="Make a Referral">
                    <Row className="mt-4">
                        <Col>
                            <h5 className="text-center text-primary">Mentees List</h5>
                            {/* Search Bar */}
                            <Form.Control
                                type="text"
                                placeholder="Search Mentees"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="mb-3"
                            />
                            <ListGroup>
                                {filteredMentees.map((mentee) => {
                                    const referral = referrals.find(ref => ref.id === mentee.id);
                                    return (
                                        <ListGroup.Item
                                            key={mentee.id}
                                            action
                                            onClick={() => handleOpenModal(mentee)}
                                            className="mb-2 shadow-sm p-3 rounded-lg"
                                            style={{
                                                cursor: "pointer",
                                                backgroundColor: "#f8f9fa",
                                                borderRadius: "10px",
                                                transition: "all 0.3s ease",
                                            }}
                                        >
                                            {mentee.profileIcon} {mentee.name}
                                            <div className="mt-2">
                                                {renderStars(referral?.rating || 0)} {/* Show stars based on referral's rating */}
                                            </div>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
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
