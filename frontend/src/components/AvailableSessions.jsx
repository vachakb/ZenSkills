import { Button, Card } from "react-bootstrap";
import { GiTwoCoins } from "react-icons/gi";
import classNames from "classnames";
import { Duration } from "luxon";
import { useNavigate } from "react-router-dom";

function AvailableSessions({ sessions }) {
  const navigate = useNavigate();

  return (
    <Card style={{ borderRadius: "10px" }}>
      <Card.Body
        className={classNames({
          "d-flex flex-column": true,
          "gap-4": sessions.length > 0,
        })}
      >
        <Card.Title>
          <h5>Available sessions</h5>
          <h6>Book 1:1 sessions from the options based on your needs</h6>
        </Card.Title>
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <Card style={{ backgroundColor: "#F1F1F1", borderRadius: "10px" }}>
              <Card.Body className="d-flex">
                <div className="d-flex flex-column gap-2">
                  {session.cost > 0 ? (
                    <div
                      className="d-flex gap-2 align-items-center py-2 px-3 rounded-pill me-auto"
                      style={{
                        backgroundColor: "#F4D35E",
                        height: "10px",
                        width: "90px",
                      }}
                    >
                      <GiTwoCoins />
                      <span>{session.cost}</span>
                    </div>
                  ) : null}
                  <h5 className="m-0">{session.name}</h5>
                  <h6 className="m-0">
                    {session.durationMinutes < 60
                      ? `${session.durationMinutes} minutes`
                      : `${Duration.fromObject({ minutes: session.durationMinutes }).shiftTo("hours").toObject().hours} hours`}
                  </h6>
                </div>
                <Button
                  className="ms-auto my-auto"
                  style={{
                    backgroundColor: "#037F7D",
                    borderRadius: "10px",
                  }}
                  onClick={() => {
                    navigate(`/book_session/${session.id}`);
                  }}
                >
                  Book
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className="m-0">No available sessions.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default AvailableSessions;
