import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/landing-page.css";
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

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

  const whyChooseUs = [
    {
      title: "Find mentor in your domain",
      content: "Explore our network of seasoned mentors, ready to illuminate your career path. From various domains, they offer invaluable guidance and expertise.",
      icon: "fas fa-chalkboard-teacher", // Icon for mentorship
    },
    {
      title: "Convenient Scheduling, Anytime, Anywhere",
      content: "Enjoy the flexibility of scheduling mentor sessions and accessing learning materials anytime, anywhere. Adapt to your busy lifestyle with ease.",
      icon: "fas fa-calendar-alt", // Icon for scheduling
    },
    {
      title: "Continuous Learning and Development",
      content: "Embark on a journey of continuous growth through curated resources and tailored learning paths. Stay ahead with our comprehensive learning solutions.",
      icon: "fas fa-book", // Icon for learning
    },
    {
      title: "User-Friendly Platform, Seamless Experience",
      content: "Navigate our intuitive platform effortlessly. Engage with mentors and access learning resources seamlessly, ensuring an enjoyable and productive experience.",
      icon: "fas fa-laptop", // Icon for platform
    },
    {
      title: "Enhance skills with industry experts",
      content: "Elevate your skills and knowledge by learning directly from industry experts. Gain invaluable insights and real-world experience to advance your career.",
      icon: "fas fa-user-graduate", // Icon for industry expertise
    },
    {
      title: "Years Of Experience, Early Career Support",
      content: "Benefit from mentors with diverse experience and tailored guidance. Receive support from the start of your career journey and build a strong foundation for success.",
      icon: "fas fa-briefcase", // Icon for experience & career support
    }
  ];

  const footerLinks = [
    {
      href: "",
      text: "Find Mentors"
    }, {
      href: "",
      text: "Become a Mentor"
    }, {
      href: "",
      text: "About Us"
    }, {
      href: "",
      text: "Contact Us"
    }
  ]

  const socialMediaProfileLinks = [
    {
      href: "https://facebook.com",
      icon: "fa-facebook"
    }, {
      href: "https://x.com",
      icon: "fa-x-twitter"
    }, {
      href: "https://linkedin.com",
      icon: "fa-linkedin"
    }, {
      href: "https://github.com",
      icon: "fa-github"
    }
  ]

  return (
    <div
      className=""
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
            <span className="text-white border border-1 mx-3"></span>
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
        className="container align-items-center mt-5"
      // style={{ minHeight: "calc(100vh - 56px)" }} // 56px is the default navbar height
      >
        <div className="row w-100 mt-3 mb-5">
          {/* Left Side */}
          <div className="col-md-6 text-start">
            <p className="text-primary" style={{
              textDecoration: "underline",
              textDecorationColor: "var(--bs-warning)"
            }}>
              Learn a new skill, launch a project, land your dream career.
            </p>
            <h1 className="fw-bold display-4 text-primary">1-on-1 Design Mentorship</h1>
            <div className="input-group my-4 shadow">
              <span className="input-group-text bg-light">
                <i className="fas fa-search"></i> {/* Search Icon */}
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="What do you want to get better at?"
              />
              <button className="btn btn-warning active">Search</button>
            </div>
            <div className="row mt-4">
              <div className="col-6 text-center my-4">
                <h5>&#128100;</h5>
                <p className="m-0">89% Happy members</p>
              </div>
              <div className="col-6 text-center my-4">
                <h5>&#128218;</h5>
                <p className="m-0">200K Qualified mentors</p>
              </div>
              <div className="col-6 text-center my-4">
                <h5>&#127760;</h5>
                <p className="m-0">150 Countries</p>
              </div>
              <div className="col-6 text-center my-4">
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

        {/* why choose us? */}
        <div className="row border border-2 rounded p-4 mb-5">
          <div className="d-flex justify-content-center align-items-center rounded">
            <p className="fs-4 fw-bold text-primary" style={{
              textDecoration: "underline",
              textDecorationColor: "var(--bs-primary)"
            }}>Why choose us?</p>
          </div>
          <div className="container">
            <div className="row">
              {whyChooseUs.map((item) => {
                return <div className="col-md-6 mb-3">
                  <p className={`${item.icon} text-primary fs-2`}></p>
                  <p className="fs-5 fw-bold">{item.title}</p>
                  <p className="fs-6 fw-light">{item.content}</p>
                </div>
              })}
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="bg-primary">
        <div className="container p-4 text-white">
          <div className="row">
            <div className="col col-md-6">
              <img
                src="https://via.placeholder.com/50"
                alt="User Avatar"
                class="rounded-circle"
                style={{
                  width: "50px", /* Set the width of the avatar */
                  height: "50px", /* Set the height of the avatar */
                }}
              />
              <span className="mx-3 fs-3"><span className="fw-bold">ZenSkills</span>®</span>
            </div>
            <div className="col-md-3 fs-6 fw-lighter">
              <ul className="list-unstyled">
                {footerLinks.map((link) => {
                  return <li key={link.text} className="my-2">
                    <a href={`${link.href}`} className="text-decoration-none text-white">{link.text}</a>
                  </li>
                })}
              </ul>
            </div>
            <div className="col-md-3">
              <p className="fw-bold fs-4">Address</p>
              <p className="fw-lighter fs-6">G H Patel College of Engineering & Technology, Bakrol Gate, VallabhVidya Nagar, Anand, Gujarat</p>
              <div className="container text-center mt-5">
                <ul className="list-unstyled d-flex justify-content-center">
                  {
                    socialMediaProfileLinks.map((link) => {
                      return <li className="mx-3">
                        <a href={`${link.href}`} target="_blank" rel="noopener noreferrer" className="text-white">
                          <i className={`fa-brands ${link.icon} fa-2x`}></i>
                        </a>
                      </li>
                    })
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
