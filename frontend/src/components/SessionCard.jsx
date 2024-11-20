import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const SessionCard = ({ date, time, status, name, sessionTitle }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <Badge bg="success">{status}</Badge>;
      case 'Pending':
        return <Badge bg="warning" text="dark">{status}</Badge>;
      case 'Completed':
        return <Badge bg="primary">{status}</Badge>;
      case 'Cancelled':
        return <Badge bg="danger">{status}</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body className="d-flex align-items-center justify-content-between">
        {/* Session Info */}
        <div>
          <Card.Title className="mb-1">{sessionTitle}</Card.Title>
          <Card.Text className="text-muted mb-2">
            {date} at {time}
          </Card.Text>
          <Card.Text className="mb-0">
            <strong>{name}</strong>
          </Card.Text>
        </div>

        {/* Status and Actions */}
        <div className="text-end">
          {/* Status Badge */}
          {getStatusBadge(status)}

          {/* Action Buttons */}
          <div className="mt-3">
            {status === 'Confirmed' && (
              <>
                <Button variant="info" className="me-2">Join</Button>
                <Button variant="danger">Cancel</Button>
              </>
            )}
            {status === 'Pending' && (
              <Button variant="danger">Cancel</Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SessionCard;
