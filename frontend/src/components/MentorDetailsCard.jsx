import React from "react";
import { Card, Button } from "react-bootstrap";

const MentorDetailsCard = ({ mentor, onVerify, onDecline }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title className="fw-bold">{mentor.name}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">{mentor.additional_info}</Card.Subtitle>

        <div className="mb-2">
          <strong>Gender:</strong> {mentor.gender}
        </div>
        <div className="mb-2">
          <strong>User ID:</strong> {mentor.user_id}
        </div>
        <div className="mb-2">
          <strong>Mentor ID:</strong> {mentor.mentor_id}
        </div>
        <div className="mb-2">
          <strong>Government ID:</strong>{" "}
          <a href={mentor.government_id} target="_blank" rel="noopener noreferrer">
            View Document
          </a>
        </div>
        <div className="mb-2">
          <strong>Work Email:</strong>{" "}
          <a href={`mailto:${mentor.work_email}`} target="_blank" rel="noopener noreferrer">
            {mentor.work_email}
          </a>
        </div>
        <div className="mb-2">
          <strong>LinkedIn:</strong>{" "}
          <a href={mentor.linkedin_profile} target="_blank" rel="noopener noreferrer">
            Visit Profile
          </a>
        </div>
        <div className="mb-2">
          <strong>Degree Certificate:</strong>{" "}
          <a href={mentor.degree_certificate} target="_blank" rel="noopener noreferrer">
            View Certificate
          </a>
        </div>
        <div className="mb-2">
          <strong>Additional Files:</strong>{" "}
          {mentor.additional_file.length > 0 ? (
            mentor.additional_file.map((file, index) => (
              <div key={index}>
                <a href={file} target="_blank" rel="noopener noreferrer">
                  File {index + 1}
                </a>
              </div>
            ))
          ) : (
            "No Additional Files"
          )}
        </div>
        <div className="mb-2">
          <strong>Created At:</strong> {new Date(mentor.created_at).toLocaleString()}
        </div>
        <div className="mb-2">
          <strong>Updated At:</strong> {new Date(mentor.updated_at).toLocaleString()}
        </div>

        
      </Card.Body>
    </Card>
  );
};

export default MentorDetailsCard;
