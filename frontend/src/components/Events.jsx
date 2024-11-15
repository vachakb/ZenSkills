import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
const getRandomPastelColor = () => {
    const r = Math.floor((Math.random() * 127) + 128); 
    const g = Math.floor((Math.random() * 127) + 128);
    const b = Math.floor((Math.random() * 127) + 128);
    return `rgb(${r}, ${g}, ${b})`;
  };

function EventCard() {
    
    const pastelColor = getRandomPastelColor();
    
    return (
        
        <Container className="p-3 mx-0 px-0" style={{ width: '900px' }}>
            <Card className="shadow-sm" style={{ borderRadius: "15px" }}>
                <Row className="align-items-center p-3">
                    
                    <Col
                        xs={2}
                        className="text-center d-flex flex-column align-items-center justify-content-center"
                        style={{
                            backgroundColor: pastelColor,
                            borderRadius: "10px",
                            fontWeight: "bold",
                            
                        }}
                    >
                        <p className="mb-1" style={{ color: "#888888", fontSize: "14px" }}>
                            TODAY
                        </p>
                        <h3 style={{ margin: 0, fontSize: "24px" }}>17:00</h3>
                    </Col>

                   
                    <Col xs={7}>
                        <h5 className="fw-bold mb-1">Bergen International Film Festival</h5>
                        <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                            Films from all over the world gather all film enthusiasts for
                            unique moments at the Bergen International Film Festival.
                        </p>
                    </Col>

                   
                    <Col xs={3} className="text-end">
                        <Button


                            style={{
                                backgroundColor: "#28a745", 
                                color: "white", 
                                fontWeight: "bold",
                                borderRadius: "20px",
                                padding: "10px 20px",
                                border: "none",
                            }}
                        >
                            Register now
                        </Button>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default EventCard;
