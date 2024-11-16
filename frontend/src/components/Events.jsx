import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
const getRandomPastelColor = () => {
    const r = Math.floor((Math.random() * 127) + 128); 
    const g = Math.floor((Math.random() * 127) + 128);
    const b = Math.floor((Math.random() * 127) + 128);
    return `rgb(${r}, ${g}, ${b})`;
  };

function EventCard() {
    const eventdetails={
        name:"Bergen International Film Festival",
        desc:" Films from all over the world gather all film enthusiasts for unique moments at the Bergen International Film Festival.",
        date: "28/11",
        time: "17:00"


    };
    
    const pastelColor = getRandomPastelColor();
    
    return (
        
        <Container className="p-3 mx-0 px-0" style={{ width: '1050px' }}>
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
                            {eventdetails.date}
                        </p>
                        <h3 style={{ margin: 0, fontSize: "24px",color: "#888888" }}>{eventdetails.time}</h3>
                    </Col>

                   
                    <Col xs={7}>
                        <h5 className="fw-bold mb-1">{eventdetails.name}</h5>
                        <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
                           {eventdetails.desc}
                        </p>
                    </Col>

                   
                    <Col xs={3} className="text-end">
                        <Button


                            style={{
                                backgroundColor:'white',
                                color:'#0E003F',
                                fontWeight: "bold",
                                borderRadius: "20px",
                                padding: "10px 20px",
                                border: "1px solid #0E003F",
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
