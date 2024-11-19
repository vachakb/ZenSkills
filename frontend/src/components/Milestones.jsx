import React from "react";

function Milestones({ data }) {
  return (
    <div
      className="border p-4"
      style={{
        maxHeight: "400px", // Define the height of the container
        overflowY: "auto", // Add vertical scrolling if content overflows
        position: "relative", // Required for absolute positioning of the line
      }}
    >
      <ul
        className="position-relative p-0 m-0"
        style={{ listStyleType: "none", paddingLeft: "50px" }} // Adjust space for bullets
      >
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            left: "21px", // Align the line with the center of bullets
            top: "7px",
            bottom: "0",
            width: "2px",
            backgroundColor: "#ccc", // Light grey for the timeline line
          }}
        ></div>

        {data.map((element, index) => (
          <li key={index} className="d-flex mb-4 position-relative">
            {/* Custom bullet */}
            <span
              className="rounded-circle bg-primary"
              style={{
                width: "12px",
                height: "12px",
                position: "absolute",
                left: "16px", // Align bullet with the line
                top: "5px", // Adjust to vertically center with text
                zIndex: 1, // Ensure it stays above the line
              }}
            ></span>

            {/* Timeline content */}
            <div className="ms-5">
              {" "}
              {/* Increased margin to create space */}
              <h5 className="fw-bold mb-1">{element.title}</h5>
              <p className="text-muted small mb-1">{element.date}</p>
              <p className="mb-0">{element.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Milestones;
