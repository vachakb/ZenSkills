import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { FaThumbsUp, FaStar } from "react-icons/fa";
import demoMentorImage from "../assets/mentorImage.png";


const ReviewCard = ({ data}) =>{
  const { username, date, rating, reviewText } = data;

  return (
    <Card className="my-3" style={{  marginLeft:'0px', width:'100%' }}>
      <Card.Body>
      
        <div className="d-flex  align-items-center">
        <div
              className="rounded-circle bg-light d-flex justify-content-center align-items-center mb-3 mb-md-0"
              style={{
                width: "40px",
                height: "40px",
                overflow: "hidden",
                marginRight: "10px",
              }}
            >
              <img
                src={demoMentorImage}
                alt="Mentee Profile"
                className="rounded-circle"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: "50%",
                }}
              />
            </div>
          <div style={{marginRight:'650px'}}>
            <Card.Title className="mb-0">{username}</Card.Title>
            <Card.Subtitle className="text-muted">
              {new Date(date).toLocaleDateString()}
            </Card.Subtitle>
          </div>
          <div className="d-flex align-items-center">
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
