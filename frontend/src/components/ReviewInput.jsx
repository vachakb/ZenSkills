import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import demoMentorImage from "../assets/mentorImage.png";

const ReviewInput = ({ data, onSubmit }) => {
  const { username, date, rating, reviewText: initialReviewText } = data;

  const [selectedRating, setSelectedRating] = useState(rating); // Track selected rating
  const [reviewText, setReviewText] = useState(initialReviewText || ""); // Track review text

  // Handle rating selection
  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
  };

  // Handle review text input change
  const handleTextChange = (event) => {
    setReviewText(event.target.value);
  };

  // Check if the submit button should be disabled
  const isSubmitDisabled = reviewText.trim() === "" || selectedRating === 0;

  // Handle form submission
  const handleSubmit = () => {
    if (onSubmit) {
      const newReview = {
        username,
        date: date.toISODate(), // Format the date properly
        rating: selectedRating,
        reviewText,
      };
      onSubmit(newReview); // Pass the new review data to the parent
      setSelectedRating(0); // Reset rating
      setReviewText(""); // Clear the textarea
    }
  };

  return (
    <Card className="my-3" style={{ marginLeft: "0px", width: "100%" }}>
      <Card.Body>
        
        {/* Header with User Info and Rating */}
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
          {/* Star Rating Display */}
          <div className="d-flex align-items-center">
            {[...Array(5)].map((_, index) => {
              return (
                <FaStar
                  key={index}
                  color={index < selectedRating ? "#ffc107" : "#e4e5e9"} // Color logic for selected stars
                  size={20}
                  onClick={() => handleRatingClick(index + 1)} // Update rating on click
                  style={{ cursor: "pointer", marginRight: "5px" }}
                />
              );
            })}
          </div>
        </div>

        {/* Text Area for Review */}
        <Card.Text className="mt-3 flex-grow-1">
          <textarea
            name="reviewText"
            value={reviewText}
            onChange={handleTextChange}
            style={{
              width: "100%",
              height: "100px",
              padding: "10px",
              fontSize: "14px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              resize: "none",
            }}
            placeholder="Write your review..."
          />
        </Card.Text>

        {/* Footer with Submit Button */}
        <div className="d-flex justify-content-end mt-3">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            Submit
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReviewInput;
