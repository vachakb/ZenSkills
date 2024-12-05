import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/landing-page.css";

function App() {
  // Sample data with more mentors to demonstrate scrolling
  const mentors = [
    {
      name: "Mentor 1",
      role: "Product Designer",
      skill: "Product Strategy",
      lang: "JAVA",
      rating: 4.8,
    },
    {
      name: "Mentor 2",
      role: "UX Designer",
      skill: "User Research",
      lang: "Python",
      rating: 4.7,
    },
    {
      name: "Mentor 3",
      role: "UI Designer",
      skill: "Visual Design",
      lang: "JavaScript",
      rating: 4.9,
    },
    {
      name: "Mentor 4",
      role: "Graphic Designer",
      skill: "Branding",
      lang: "C#",
      rating: 4.6,
    },
    {
      name: "Mentor 5",
      role: "Interaction Designer",
      skill: "Prototyping",
      lang: "Ruby",
      rating: 4.5,
    },
    {
      name: "Mentor 6",
      role: "Industrial Designer",
      skill: "3D Modeling",
      lang: "C++",
      rating: 4.7,
    },
    {
      name: "Mentor 7",
      role: "Service Designer",
      skill: "Service Blueprinting",
      lang: "Go",
      rating: 4.8,
    },
    {
      name: "Mentor 8",
      role: "Motion Designer",
      skill: "Animation",
      lang: "Swift",
      rating: 4.6,
    },
    {
      name: "Mentor 9",
      role: "Interior Designer",
      skill: "Space Planning",
      lang: "Kotlin",
      rating: 4.7,
    },
    {
      name: "Mentor 10",
      role: "Fashion Designer",
      skill: "Textile Design",
      lang: "PHP",
      rating: 4.5,
    },
    // Add more mentors as needed
  ];

  return (
    <div
      className="bg-light"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <a
          className="navbar-brand text-white font-weight-bold font-italic"
          href="#home"
        >
          ZenSkills
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="btn btn-warning text-primary active">
                Browse all mentors
              </button>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#get-started">
                Get started
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#login">
                Login
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="container d-flex align-items-center mt-5"
        // style={{ minHeight: "calc(100vh - 56px)" }} // 56px is the default navbar height
      >
        <div className="row w-100">
          {/* Left Side */}
          <div className="col-md-6 text-start">
            <p className="text-secondary">
              Learn a new skill, launch a project, land your dream career.
            </p>
            <h1 className="fw-bold display-4">1-on-1 Design Mentorship</h1>
            <div className="input-group my-4">
              <input
                type="text"
                className="form-control"
                placeholder="What do you want to get better at?"
              />
              <button className="btn btn-warning active">Search</button>
            </div>
            <div className="row mt-4">
              <div className="col-6 col-md-3 text-center mb-3">
                <h5>&#128100;</h5>
                <p className="m-0">89% Happy members</p>
              </div>
              <div className="col-6 col-md-3 text-center mb-3">
                <h5>&#128218;</h5>
                <p className="m-0">200K Qualified mentors</p>
              </div>
              <div className="col-6 col-md-3 text-center mb-3">
                <h5>&#127760;</h5>
                <p className="m-0">150 Countries</p>
              </div>
              <div className="col-6 col-md-3 text-center mb-3">
                <h5>&#128279;</h5>
                <p className="m-0">2M+ Connections</p>
              </div>
            </div>
          </div>

          {/* Right Side (Mentor List) */}
          <div
            className="col-md-6"
            style={{
              border: "1px solid #ddd",
              height: "70vh", // Fixed height
              overflowY: "scroll", // Enable vertical scrolling
            }}
          >
            {mentors.map((mentor, idx) => (
              <div
                className="card mb-3"
                key={idx}
                style={{
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px",
                }}
              >
                <div className="card-body d-flex align-items-start">
                  {/* Avatar Placeholder */}
                  <div
                    className="me-3"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      backgroundColor: "#ddd",
                    }}
                  ></div>

                  <div className="flex-grow-1">
                    {/* Mentor Info */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <h5 className="card-title mb-0">{mentor.name}</h5>
                        <p className="card-text m-0 text-muted">
                          {mentor.role}
                        </p>
                      </div>
                      <div className="text-warning">
                        &#9733; {mentor.rating}
                      </div>
                    </div>
                    {/* Skills and Languages */}
                    <div>
                      <span className="badge bg-secondary me-2">
                        {mentor.skill}
                      </span>
                      <span className="badge bg-secondary">{mentor.lang}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



    </div>
  );
}

export default App;
