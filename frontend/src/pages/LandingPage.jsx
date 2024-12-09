import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/landing-page.css";
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import MentorCard from "../components/MentorCard"

function App() {
  // Sample data with more mentors to demonstrate scrolling
  const mentors = [
    {
      id: "mentor_001",
      name: "Alice Johnson",
      rating: 4.8,
      currentPost: "DevOps Engineer at Amazon",
      noOfSessions: 25,
      noOfReviews: 8,
      experienceYears: 12,
      experienceMonths: 3,
      creditScore: 98,
    },
    {
      id: "mentor_002",
      name: "Bob Martinez",
      rating: 4.2,
      currentPost: "DevOps Engineer at Amazon",
      noOfSessions: 15,
      noOfReviews: 6,
      experienceYears: 8,
      experienceMonths: 10,
      creditScore: 92,
    },
    {
      id: "mentor_003",
      name: "Chloe Kim",
      rating: 4.9,
      currentPost: "Lead UX Designer at Adobe",
      noOfSessions: 30,
      noOfReviews: 12,
      experienceYears: 14,
      experienceMonths: 2,
      creditScore: 99,
    },
    {
      id: "mentor_004",
      name: "David Patel",
      rating: 4.7,
      currentPost: "AI Researcher at OpenAI",
      noOfSessions: 40,
      noOfReviews: 20,
      experienceYears: 11,
      experienceMonths: 6,
      creditScore: 96,
    },
    {
      id: "mentor_005",
      name: "Emily Wright",
      rating: 4.5,
      currentPost: "Blockchain Developer at IBM",
      noOfSessions: 18,
      noOfReviews: 7,
      experienceYears: 9,
      experienceMonths: 8,
      creditScore: 94,
    }, {
      id: "mentor_001",
      name: "Alice Johnson",
      rating: 4.8,
      currentPost: "DevOps Engineer at Amazon",
      noOfSessions: 25,
      noOfReviews: 8,
      experienceYears: 12,
      experienceMonths: 3,
      creditScore: 98,
    }, {
      id: "mentor_001",
      name: "Alice Johnson",
      rating: 4.8,
      currentPost: "DevOps Engineer at Amazon",
      noOfSessions: 25,
      noOfReviews: 8,
      experienceYears: 12,
      experienceMonths: 3,
      creditScore: 98,
    }, {
      id: "mentor_001",
      name: "Alice Johnson",
      rating: 4.8,
      currentPost: "DevOps Engineer at Amazon",
      noOfSessions: 25,
      noOfReviews: 8,
      experienceYears: 12,
      experienceMonths: 3,
      creditScore: 98,
    },
  ];

  const mentors2 = [
    {
      name: "Alice Johnson",
      role: "Senior Developer",
      rating: 4.8,
      skill: "JavaScript, React, Node.js",
      lang: "English"
    },
    {
      name: "Bob Smith",
      role: "Data Scientist",
      rating: 4.7,
      skill: "Python, Machine Learning, SQL",
      lang: "English"
    },
    {
      name: "Carla Green",
      role: "UX/UI Designer",
      rating: 4.6,
      skill: "Figma, Photoshop, Adobe XD",
      lang: "Spanish"
    },
    {
      name: "David Lee",
      role: "Full Stack Developer",
      rating: 4.9,
      skill: "React, Node.js, MongoDB",
      lang: "English"
    },
    {
      name: "Eva Adams",
      role: "Product Manager",
      rating: 4.5,
      skill: "Agile, Scrum, Product Strategy",
      lang: "French"
    }, {
      name: "Alice Johnson",
      role: "Senior Developer",
      rating: 4.8,
      skill: "JavaScript, React, Node.js",
      lang: "English"
    },
    {
      name: "Bob Smith",
      role: "Data Scientist",
      rating: 4.7,
      skill: "Python, Machine Learning, SQL",
      lang: "English"
    },
    {
      name: "Carla Green",
      role: "UX/UI Designer",
      rating: 4.6,
      skill: "Figma, Photoshop, Adobe XD",
      lang: "Spanish"
    },
    {
      name: "David Lee",
      role: "Full Stack Developer",
      rating: 4.9,
      skill: "React, Node.js, MongoDB",
      lang: "English"
    },
    {
      name: "Eva Adams",
      role: "Product Manager",
      rating: 4.5,
      skill: "Agile, Scrum, Product Strategy",
      lang: "French"
    }
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

  const howItWorks = [
    {
      title: "Search Mentors",
      content: "Gain career and feedback from industry experts with Zenskills"
    }, {
      title: "Schedule a meeting",
      content: "Schedule sessions with mentors at your prefered time for personalized guidance"
    }, {
      title: "Get the Mentorship",
      content: "Content, refine, expand on our networking platform for professionals"
    }
  ]

  let organizationsImages = [
    "https://via.placeholder.com/100"
  ]
  organizationsImages = Array(15).fill(organizationsImages).flat();

  const reviews = [
    {
      writer: "Lokesh",
      profession: "Marketing Mentor",
      content: "We've seen a significant improvements in out online presence, thanks to your experience in digital maketing strategies. Your guidance on SEO and content strategy has been spot on!"
    }, {
      writer: "Rahul Verma",
      profession: "Technology Mentor",
      content: "Thank you for guiding us through the intricacies of software archutecture and cosding best practices. Your practical insights have truly elevated our team's development skills."
    }, {
      writer: "Lokesh",
      profession: "Marketing Mentor",
      content: "We've seen a significant improvements in out online presence, thanks to your experience in digital maketing strategies. Your guidance on SEO and content strategy has been spot on!"
    }
  ]

  const faqs = [
    {
      question: "What is ZenSkills is all about?",
      answer: "ZenSkills is an online web platform where startups/founders can search for mentors, get connected with them and engage on a mentoring session."
    }, {
      question: "How does ZenSkills platform work?",
      answer: "answer 2"
    }, {
      question: "Will I get a refund, if session gets canceled?",
      answer: "answer 3"
    }, {
      question: "Can you videoChat in this platform?",
      answer: "answer 4"
    }
  ]

  // const mentorsCard = [
  //   {
  //     id: "mentor_001",
  //     name: "Alice Johnson",
  //     rating: 4.8,
  //     currentPost: "Senior Data Scientist at Google",
  //     noOfSessions: 25,
  //     noOfReviews: 8,
  //     experienceYears: 12,
  //     experienceMonths: 3,
  //     creditScore: 98,
  //   },
  //   {
  //     id: "mentor_002",
  //     name: "Bob Martinez",
  //     rating: 4.2,
  //     currentPost: "DevOps Engineer at Amazon",
  //     noOfSessions: 15,
  //     noOfReviews: 6,
  //     experienceYears: 8,
  //     experienceMonths: 10,
  //     creditScore: 92,
  //   },
  //   {
  //     id: "mentor_003",
  //     name: "Chloe Kim",
  //     rating: 4.9,
  //     currentPost: "Lead UX Designer at Adobe",
  //     noOfSessions: 30,
  //     noOfReviews: 12,
  //     experienceYears: 14,
  //     experienceMonths: 2,
  //     creditScore: 99,
  //   },
  //   {
  //     id: "mentor_004",
  //     name: "David Patel",
  //     rating: 4.7,
  //     currentPost: "AI Researcher at OpenAI",
  //     noOfSessions: 40,
  //     noOfReviews: 20,
  //     experienceYears: 11,
  //     experienceMonths: 6,
  //     creditScore: 96,
  //   },
  //   {
  //     id: "mentor_005",
  //     name: "Emily Wright",
  //     rating: 4.5,
  //     currentPost: "Blockchain Developer at IBM",
  //     noOfSessions: 18,
  //     noOfReviews: 7,
  //     experienceYears: 9,
  //     experienceMonths: 8,
  //     creditScore: 94,
  //   },
  // ];

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
            className="col-md-6 border-0 card-container"
            style={{
              border: "1px solid #ddd",
              height: "70vh", // Fixed height
              overflowY: "scroll", // Enable vertical scrolling
            }}
          >
            <div className="card-wrapper">
              {mentors2.map((mentor, idx) => (
                <div className="card mb-3" key={idx} style={{
                  borderBottom: "1px solid #eee",
                  paddingBottom: "10px",
                }}
                >
                  <div className="card-body d-flex align-items-start">
                    {/* Avatar Placeholder */}
                    <div className="me-3" style={{
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

        {/* organizations */}
        <div className="row border-top-2 border-bottom-2">
          <p className="fw-bold fs-4 text-primary text-center" style={{
            textDecoration: "underline",
            textDecorationColor: "var(--bs-primary)"
          }}>Proven success with 20,000+ top organiations</p>
          <div className="d-flex flex-wrap align-items-center justify-content-center">
            {organizationsImages.map((src) => {
              return <img src={src} alt="img" className="rounded-circle m-3" />
            })}
          </div>
        </div>

        {/* How it works */}
        <div className="row mb-5">
          <div className="d-flex justify-content-center align-items-center rounded">
            <p className="fs-4 fw-bold text-primary" style={{
              textDecoration: "underline",
              textDecorationColor: "var(--bs-primary)"
            }}>How it Works?</p>
          </div>
          <p className="text-center fw-light fs-6">Search, Schedule and get mentored from the industry and learn skills that can help you land a job in no time</p>
          <div className="container">
            <div className="row gap-3">
              {howItWorks.map((item, index) => {
                return <div className="col-md-4 rounded border p-3 mb-3 d-flex flex-column align-items-center shadow">
                  <img src="https://via.placeholder.com/150" alt={`${item.title}`} className="p-2" />
                  <p className="fw-bold fs-4 text text-center">Step-{index + 1} {item.title}</p>
                  <p className="fw-light fs-6 text text-center">{item.content}</p>
                </div>
              })}
            </div>
          </div>
        </div>

        {/* Top mentors */}
        <>
          <p className="text-center fw-bold fs-3 text-primary" style={{
            textDecoration: "underline",
            textDecorationColor: "var(--bs-primary)"
          }}>Discover the world's top mentors</p>

          <div className="row d-flex overflow-auto flex-nowrap w-100 gap-3 mb-4" style={{ width: "100%" }}>
            {mentors.map((mentor, index) => {
              return <MentorCard className="me-3" key={index} mentor={mentor} width_={300} />
            })}
          </div>
        </>

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

      {/* reviews */}
      <div className="row bg-primary p-3">
        <p className="fs-2 fw-bolder text-white text-center" style={{
          textDecoration: "underline",
          textDecorationColor: "var(--bs-warning)"
        }}>People talk</p>
        <div className="container">
          <div className="row">
            {reviews.map((review) => {
              return <div className="col-lg-4 mb-3">
                <div className="bg-white rounded-5 d-flex d-flex justify-content-center align-items-center p-3 h-100">
                  <div><img src="https://via.placeholder.com/100" alt="img" className="rounded-circle" /></div>
                  <div className="flex-grow-1 p-3">
                    <p className="text-center">{review.content}</p>
                    <p className="text-end">{review.writer}, {review.profession}</p>
                  </div>
                </div>
              </div>
            })}
          </div>
        </div>
      </div>

      {/* faqs */}
      <div className="row m-5">
        <div className="col-md-4 d-flex flex-column justify-content-center align-items-center mb-3">
          <p className="fs-3 fw-bold text-primary">Frequently Asked Questions</p>
          <div className="bg-info p-3 rounded">
            <p className="text-center text-white">Unable to see information you seek?</p>
            <p className="text-center text-primary">Feel free to get in touch with us!</p>
          </div>
        </div>
        <div class="accordion col-md-8" id="accordion">
          {
            faqs.map((item, index) => {
              return <div class="accordion-item" key={index}>
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#${index}`}aria-expanded="false" aria-controls={index}>
                    {item.question}
                  </button>
                </h2>
                <div id={index} class="accordion-collapse collapse" data-bs-parent="#accordion">
                  <div class="accordion-body">
                    {item.answer}
                  </div>
                </div>
              </div>
            })
          }
        </div>
      </div>

      {/* footer */}
      <div className="bg-primary">
        <div className="container p-4 text-white">
          <div className="row">
            <div className="col-md-6">
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
          <hr />
          <div className="row">
            <div className="col-md-6 mb-2">
              Copyright 2024, All Rights Reserverd
            </div>
            <div className="col-md-6 d-flex justify-content-between fw-lighter">
              <a href={``} className="text-decoration-none text-white">Privacy Policy</a>
              <a href={``} className="text-decoration-none text-white">Refund Policy</a>
              <a href={``} className="text-decoration-none text-white">Terms and Conditions</a>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
