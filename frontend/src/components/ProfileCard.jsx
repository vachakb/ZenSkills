import React from "react";
import { CiShare2 } from "react-icons/ci";
import { Card, Button, Badge, Dropdown } from "react-bootstrap";
import demoMentorImage from "../assets/mentorImage.png";
import { GiRoundStar } from "react-icons/gi";
import { Formik,Field, Form } from "formik";

const ProfileCard = ({ profile,isCurrentUser = false,isEditing }) => {
  const handleShareClick = () => {
    const link = window.location.href;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        alert("Failed to copy the link: " + err);
      });
  };

  const initialValues = {
    name: profile.name,
    title: profile.role == "mentor" ? profile.mentor.mentor_job_title : profile?.mentee?.mentee_title,
    occupation: profile.role == "mentor" ? profile.mentor.company : profile?.mentee?.company,
    skills: profile.role == "mentor" ? profile.mentor.expertise : profile?.mentee?.interests,
  };


  const handleMoreClick = (option) => {
    alert(`Option selected: ${option}`);
  };

  return (
    <div className="container-fluid mx-0 px-0">
      <div className="text-primary mb-0 pb-0">
        {/* Top Buttons */}
        <div
          className="d-flex flex-wrap mt-1 mb-2 justify-content-end"
          style={{ gap: "10px", marginLeft: "auto" }}
        >
          {/* Share Button */}
          <Button
            style={{
              border: "1px solid #d3d3d3",
              backgroundColor: "white",
              color: "black",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            size="sm"
            onClick={handleShareClick}
          >
            <CiShare2 />
          </Button>
          {!isCurrentUser && (
          <Dropdown>
            <Dropdown.Toggle
              size="sm"
              style={{
                border: "1px solid #d3d3d3",
                backgroundColor: "white",
                color: "black",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <i className="bi bi-three-dots"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item >
                Report Profile
              </Dropdown.Item>
              <Dropdown.Item >
                Block
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          )}
        </div>

        {/* Profile Card */}
        <Card className="shadow-sm pb-2 p-3 mb-1 mt-1 bg-white rounded text-primary">
          <Formik initialValues={initialValues} >
            {({ values }) => (
              <Form>
                <div className="d-flex flex-column flex-md-row align-items-center">
                  {/* Profile Image */}
                  <div
                    className="rounded-circle bg-light d-flex justify-content-center align-items-center mb-3 mb-md-0"
                    style={{
                      width: "150px",
                      height: "150px",
                      overflow: "hidden",
                      marginRight: "20px",
                    }}
                  >
                    {isEditing ? (
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        
                      />
                    ) : (
                      <img
                        src={demoMentorImage}
                        alt="Profile"
                        className="rounded-circle"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="text-center text-md-start">
                    {isEditing ? (
                      <>
                        <Field
                          name="name"
                          placeholder="Name"
                          className="form-control mb-2"
                         
                          
                        />
                        
                        <Field
                          name="title"
                          placeholder="Title"
                          className="form-control mb-2"
                        />
                        <Field
                          name="occupation"
                          placeholder="Occupation"
                          className="form-control mb-2"
                        />
                      </>
                    ) : (
                      <>
                        <h5 className="mb-0 fs-4">{profile?.name}</h5>
                        <small className="text-muted">
                          {profile?.mentee?.mentee_title} at<br/>{profile?.mentee?.company}
                        </small>
                      </>
                    )}
                  </div>
                </div>

                <Card.Body className="mt-3">
                  {/* Skills/Interests Section */}
                  <Card.Title className="mt-0">
                    {profile.isMentor ? "Expertise" : "Interests"}
                  </Card.Title>
                  <hr className="mb-2" />
                  <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
                    {(profile?.mentee?.interests ?? profile?.mentor?.expertise ?? []).map(
                      (skill, index) => (
                        <Badge
                          key={index}
                          bg="warning"
                          text="dark"
                          className="me-2 mb-2"
                          style={{
                            padding: "10px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          {isEditing ? (
                            <Field
                              name={
                                profile.isMentor
                                  ? `expertise[${index}]`
                                  : `interests[${index}]`
                              }
                              className="form-control"
                            />
                          ) : (
                            skill.tag_name
                          )}
                        </Badge>
                      )
                    )}
                  </div>
                </Card.Body>
               
              </Form>
            )}
          </Formik>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCard;
