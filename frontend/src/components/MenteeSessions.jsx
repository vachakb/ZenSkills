import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import classNames from "classnames";
import { deleteSession } from '../apis/session';
import { useState } from 'react';
import { useEffect } from 'react';
import useProfile from '../hooks/useProfile';

const MenteeSessions = ({ sessions }) => {
  const profile = useProfile(); // Destructuring sessions here
  // To check if sessions are coming correctly

  const handleJoin = (sessionId) => {
    alert(`Joining session ID: ${sessionId}`);
  };
  const [isDeleted, setIsDeleted] = useState(false);

  const navigate = useNavigate();
  const handleDelete = async (sessionId) => {
    try {
      // Call the deleteSession API function
      await deleteSession(sessionId);

      // After successful deletion, update the UI by removing the deleted session from the list
      setIsDeleted(true);

      // Optionally, show a success message or alert

    } catch (error) {
      // If there's an error, show an error message
      console.error('Failed to delete the session:', error);
      alert('Failed to delete the session.');
    }
  };
  useEffect(() => {
    // If a session was deleted, refresh the page
    if (isDeleted) {
      window.location.reload();
      setIsDeleted(false);
    }
  }, [isDeleted]);
  console.log(profile);

  return (
    <Card style={{ borderRadius: "10px" }}>
      <Card.Body
        className={classNames({
          "d-flex flex-column": true,
          "gap-1": sessions.length > 0,
        })}
      >
        <Card.Title className='mb-0'>
          <div className='d-flex my-0' style={{ alignItems: "center" }}>
            <h5>Available sessions</h5>

            <Button
              variant='primary'
              size='4'
              className="ms-auto my-auto"
              style={{ borderRadius: "10px" }}
              onClick={() => navigate("/createsession_1")}
            >
              Create
            </Button>


          </div>



        </Card.Title>
        <hr />

        {sessions.length > 0 ? (
          sessions.map((session) => (
            <Card style={{ backgroundColor: "#F1F1F1", borderRadius: "10px", marginTop: "0" }} key={session.id}>
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
                  onClick={() => handleDelete(session.id)}
                >
                  Delete
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
};

export default MenteeSessions;
