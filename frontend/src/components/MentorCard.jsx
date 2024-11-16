import { FaBriefcase } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import demoMentorImage from "../assets/mentorImage.png";

// passed mentor object should be like this
// const mentor = {
//     name:"mentor",
//     rating: 4.5,
//     currentPost:"Test Architecture manager at Align",
//     noOfSessions: 19,
//     noOfReviews: 4,
//     Experience: 23,
//     creditScore: 95
// }

export default function mentorCard({ mentor }) {
  return (
    <div className="card col-12 col-sm-6 col-md-4 col-lg-3">
        <div className="card-body">
        <img
        src={demoMentorImage}
        alt="Mentor Image"
        style={{ width: "100%", borderRadius: "10px" }}
      />

      <div className="d-flex justify-content-between align-items-center">
        <div className="fs-4 fw-bold card-title">{mentor.name}</div>
        <div className="d-flex align-items-center" style={{ color: "yellow" }}>
          <FaStar size={15} color="yellow" />
          <span className="ms-2">{mentor.rating}</span>
        </div>
      </div>

      <div className="d-flex align-content-center">
        <FaBriefcase size={30} />
        <span className="ps-2">{mentor.currentPost}</span>
      </div>

      <div>
        <FaRegComment size={24} />
        <span className="ps-2">
          {mentor.noOfSessions} Sessions ({mentor.noOfReviews} Reviews)
        </span>
      </div>

      <hr />

      <div className="d-flex justify-content-around">
        <div className="flex-fill text-center flex-column">
          <div>Experience</div>
          <div>{mentor.Experience} Years</div>
        </div>
        <div className="flex-fill text-center flex-column">
          <div>Credit Score</div>
          <div>{mentor.creditScore}</div>
        </div>
      </div>

        </div>
          </div>
  );
}
