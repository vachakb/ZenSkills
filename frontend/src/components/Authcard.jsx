import { Col, Row } from "react-bootstrap";
function Authcard(props) {
    return (
        <Col className="d-flex flex-column justify-content-center align-items-center text-center gap-2 " style={{ maxWidth: '28%', maxHeight: "100%", background: 'linear-gradient(180deg, #6328C3 0%, #9B8951 100%)', color: 'white', borderRadius: !props.side || props.side == 'left' ? '0 4rem 4rem 0' : '4rem 0 0 4rem', padding: '5rem' }}>
            <Row className="fs-6">
                <p>"With ZenSkills I can get mentored
                    by industry leaders who have
                    subject matter expertise and
                    work experience." </p>
            </Row>
            <Row>
                <img className="rounded-circle object-fit-cover" style={{ width: '125px', height: '100px' }} src="/authuser.jpg" />
            </Row>
            <Row className="mt-3" style={{ fontSize: '12px' }}>
                <p> Stavan Shah <br />
                    CSE Student <br />
                    Aspiring Data Scientist</p>
            </Row>

        </Col>
    );


}
export default Authcard;
