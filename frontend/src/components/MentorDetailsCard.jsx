import React from "react";
import { Card, Button } from "react-bootstrap";
import { API_URL } from "../apis/commons";

const MentorDetailsCard = ({ mentor, onVerify, onDecline }) => {
  return (
    <Card className="shadow-sm">
      <Card.Body className="d-flex flex-column gap-2">
        <Card.Title className="fw-bold">{mentor.email}</Card.Title>
        <div>
          <strong>Government ID:</strong>{" "}
          <a

                href={`${API_URL}/api/auth/file/${mentor.MentorVerification.government_id.id}`}

            download>
            View Document
          </a>
        </div>
        <div>
          <strong>Work Email:</strong>{" "}
          <a href={`mailto:${mentor.MentorVerification.work_email}`} target="_blank" rel="noopener noreferrer">
            {mentor.MentorVerification.work_email}
          </a>
        </div>
        <div>
          <strong>LinkedIn:</strong>{" "}
          <a href={mentor.MentorVerification.linkedin_profile} target="_blank" rel="noopener noreferrer">
            Visit Profile
          </a>
        </div>
        <div>
          <strong>Degree Certificate:</strong>{" "}
          <a
                href={`${API_URL}/api/auth/file/${mentor.MentorVerification.degree_certificate.id}`}
download>
            View Certificate
          </a>
        </div>
        <div>
          <strong>Additional File:</strong>{" "}
          {mentor.MentorVerification.additional_file !== undefined ? (
            <div key={mentor.MentorVerification.additional_file.id}>
              <a
                href={`${API_URL}/api/auth/file/${mentor.MentorVerification.additional_file.id}`}
                download>
                View additional file
              </a>
            </div>
          ) : (
            "No Additional Files"
          )}
        </div>
        <div>
          <strong>Created At:</strong> {new Date(mentor.MentorVerification.created_at).toLocaleString()}
        </div>


        <div className="d-flex gap-2"><Button onClick={() => onVerify(mentor)}>Verify</Button>
<Button onClick={() => onDecline(mentor)}>Decline</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MentorDetailsCard;
