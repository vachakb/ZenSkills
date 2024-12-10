import React, { useMemo } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { DateTime } from "luxon";
import { updateBookingStatus } from "../apis/session";

const SessionCard = ({ session, profile }) => {
  const status = useMemo(() => {
    return session.status.charAt(0).toUpperCase() + session.status.slice(1);
  }, [session]);

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

  const updateSessionStatus = (status) => {
    updateBookingStatus(session.id, status);
  };

  const buttons = useMemo(() => {
    switch (status) {
      case "Accepted":
        return (
          <>
            <Button variant="success">Join</Button>
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
            With <b>{session.session.mentor.User.name}</b>
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
