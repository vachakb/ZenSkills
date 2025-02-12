import { useNavigate } from "react-router-dom";
import demoMentorImage from "../assets/mentorImage.png";
import { FaStar, FaBriefcase, FaRegComment } from "react-icons/fa";
import "../styles/style.css";

// passed mentor object should be like this
// const mentor = {
//   name: "mentor",
//   rating: 4.5,
//   currentPost: "Test Architecture manager at Align",
//   noOfSessions: 19,
//   noOfReviews: 4,
//   Experience: 23,
//   creditScore: 95,
// };

export default function MentorCard({ mentor, width_ }) {
  const navigate = useNavigate();

  return (
    <div
      style={{ cursor: "pointer", width: width_ !== null ? width_ : null }}
      className="card h-100 shadow-sm p-3 d-flex flex-column "
      onClick={() => {
        navigate("/mentee_exploring/" + mentor.id);
      }}
    >
      {/* Mentor Image */}
      <img
        src={demoMentorImage}
        alt="Mentor"
        className="img-fluid rounded mb-3"
        style={{ maxHeight: "200px", objectFit: "cover" }}
      />

      {/* Card Body */}
      <div className="card-body flex-grow-1 d-flex flex-column justify-content-between">
        {/* Top Section */}
        <div>
          {/* Name and Rating */}
          <div className="d-flex justify-content-between align-items-center mb-3 name-rating-wrapper">
            <h5
              className="card-title fw-bold text-truncate"
              title={mentor.name}
            >
              {mentor.name}
            </h5>
            <div className="d-flex align-items-center text-warning rating-wrapper">
              <FaStar size={20} style={{ fontSize: "20px" }} />
              <span className="ms-2">{mentor.rating}</span>
            </div>
          </div>

          {/* Current Post */}
          <div className="d-flex mb-3 align-items-start">
            <FaBriefcase
              size={20}
              style={{ fontSize: "20px" }}
              className="me-2"
            />
            <div className="text-truncate-2" title={mentor.currentPost}>
              {mentor.title} at {mentor.company}
            </div>
          </div>

          {/* Sessions and Reviews */}
          <div className="d-flex align-items-center mb-3">
            <FaRegComment size={20} style={{ fontSize: "20px" }} />
            <span className="ms-2">
              {mentor.noOfSessions} Sessions ({mentor.noOfReviews} Reviews)
            </span>
          </div>
        </div>

        {/* Divider */}
        <hr className="mt-auto" />

        {/* Bottom Section */}
        <div className="row text-center">
          <div className="col-6">
            <div className="fw-bold text-truncate">Experience</div>
            <div>
              {mentor.experienceYears} Years, {mentor.experienceMonths} Months
            </div>
          </div>
          <div className="col-6">
            <div className="fw-bold text-truncate">Credit Score</div>
            <div>{mentor.creditScore}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
