import { Button, Card } from "react-bootstrap";
import { GiTwoCoins } from "react-icons/gi";

const sessions = [
  {
    name: "Mentorship Session",
    duration: "30 minutes",
    cost: 0,
  },
  {
    name: "Product management Interview Prep",
    duration: "30 minutes",
    cost: 0,
  },
  {
    name: "Ace Your Job Interviews",
    duration: "2 hours",
    cost: 100,
  },
];

function AvailableSessions() {
  return (
    <Card style={{ borderRadius: "10px" }}>
      <Card.Body className="d-flex flex-column gap-4">
        <Card.Title>
          <h3 className="fw-bold">Available sessions</h3>
          <h5>Book 1:1 sessions from the options based on your needs</h5>
        </Card.Title>
        {sessions.map((session) => (
          <Card style={{ backgroundColor: "#F1F1F1", borderRadius: "10px" }}>
            <Card.Body className="d-flex">
              <div className="d-flex flex-column gap-2">
                {session.cost > 0 ? (
                  <div
                    className="d-flex gap-2 align-items-center py-2 px-3 rounded-pill me-auto"
                    style={{ backgroundColor: "#F4D35E" }}
                  >
                    <GiTwoCoins />
                    {session.cost}
                  </div>
                ) : null}
                <h4 className="m-0">{session.name}</h4>
                <h5 className="m-0">{session.duration}</h5>
              </div>
              <Button
                className="ms-auto my-auto"
                style={{
                  backgroundColor: "#037F7D",
                  borderRadius: "10px",
                }}
              >
                Book
              </Button>
            </Card.Body>
          </Card>
        ))}
      </Card.Body>
    </Card>
  );
}

export default AvailableSessions;
