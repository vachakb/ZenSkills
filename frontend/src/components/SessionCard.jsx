import React, { useMemo } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { DateTime } from "luxon";
import { setSessionRoomId, updateBookingStatus } from "../apis/session";
import { createRoom, getToken } from "../apis/meeting";
import { useNavigate } from "react-router-dom";

const SessionCard = ({ session, profile, onAction }) => {
  const status = useMemo(() => {
    return session.status.charAt(0).toUpperCase() + session.status.slice(1);
  }, [session]);

  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return <Badge bg="success">{status}</Badge>;
      case "Pending":
        return (
          <Badge bg="warning" text="dark">
            {status}
          </Badge>
        );
      case "Completed":
        return <Badge bg="primary">{status}</Badge>;
      case "Cancelled":
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };
  const joinSession = async () => {
    const tokenRes = await getToken();
    const token = tokenRes.data.token;

    let roomId = session.room_id;

    if (!roomId) {
      const roomRes = await createRoom(token);
      roomId = roomRes.data.roomId;
      await setSessionRoomId(session.id, roomId);
    }

    navigate(`/meeting/${roomId}`, {
      state: {
        token,
        roomId,
        sessionId: session.id,
        roomType: "one-on-one",
        isHost: session.session.mentor.User.id === profile.id,
      },
    });
  };


  const updateSessionStatus = (status) => {
    updateBookingStatus(session.id, status);
    onAction();
  };

  const buttons = useMemo(() => {
    switch (status) {
      case "Accepted":
        return (
          <>
            <Button variant="success" onClick={() => joinSession()}>Join</Button>
            <Button variant="danger" onClick={() => updateSessionStatus("cancelled")}>Cancel</Button>
          </>
        );
      case "Pending":
        if (profile.isMentor) {
          return (
            <>
              <Button variant="success" onClick={() => updateSessionStatus("accepted")}>Accept</Button>
              <Button variant="danger" onClick={() => updateSessionStatus("rejected")}>Decline</Button>
            </>
          );
        } else {
          return null;
        }
    }
  }, []);

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body className="d-flex align-items-center justify-content-between">
        {/* Session Info */}
        <div>
          <Card.Title className="mb-1">{session.session.name}</Card.Title>
          <Card.Text className="text-muted mb-2">
            {DateTime.fromISO(session.date).toLocaleString(DateTime.DATE_FULL)}{" "}
            at{" "}
            {DateTime.fromISO(session.start_time).toLocaleString(
              DateTime.TIME_SIMPLE,
            )}
          </Card.Text>
          <Card.Text className="mb-0">{session.session.description}</Card.Text>
          <Card.Text>
            With <b>{profile.isMentor ? session.user.name : session.session.mentor.User.name}</b>
          </Card.Text>
        </div>

        {/* Status and Actions */}
        <div className="text-end">
          {/* Status Badge */}
          {getStatusBadge(status)}

          {/* Action Buttons */}
          <div className="mt-3 d-flex gap-2">{buttons}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SessionCard;
