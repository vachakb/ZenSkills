import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { FaThumbsUp, FaStar } from "react-icons/fa";
import demoMentorImage from "../assets/mentorImage.png";

const ReviewCard = ({ data }) => {
  const { username, date, rating, reviewText } = data;

  return (
    <Card className="my-3" style={{ marginLeft: "0px", width: "100%" }}>
      <Card.Body>
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-circle bg-light">
            <img
              className="rounded-circle"
              src={demoMentorImage}
              alt="Mentee Profile"
              style={{
                width: "32px",
                height: "32px",
              }}
            />
          </div>
          <div className="d-flex flex-column gap-2">
            <Card.Title className="m-0">{username}</Card.Title>
            <Card.Subtitle className="text-muted">
              {new Date(date).toLocaleDateString()}
            </Card.Subtitle>
          </div>
          <div className="d-flex align-items-center ms-auto">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                color={index < rating ? "#ffc107" : "#e4e5e9"}
                size={20}
              />
            ))}
          </div>
        </div>
        <Card.Text className="mt-3">{reviewText}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ReviewCard;
