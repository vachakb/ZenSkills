import React, { useEffect, useRef, useState } from "react";
import { CiShare2 } from "react-icons/ci";
import { Card, Button, Badge, Dropdown, Form } from "react-bootstrap";
import demoMentorImage from "../assets/mentorImage.png";
import { GiRoundStar } from "react-icons/gi";
import { FieldArray } from "formik";
import { getAllTags } from "../apis/user";

const ProfileCard = ({ profile, isCurrentUser = false, isEditing = false, formikProps = undefined }) => {
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

  const handleMoreClick = (option) => {
    alert(`Option selected: ${option}`);
  };

  const [tags, setTags] = useState([]);

  const onLoad = () => {
    if (isEditing) {
      getAllTags()
        .then((res) => setTags(res.data.tags))
        .catch((err) => console.error(err));
    }
  };

    const profilePicture = useRef(null);
    const profilePictureChooser = useRef(null);

  useEffect(() => {
    onLoad();
  }, []);

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
                      <input className="d-none"
                        name="profilePicture"
                        type="file"
                        accept="image/*"
                      onChange={(ev) => {
                        console.log(ev)
                        if (ev.target.files.length > 0 && profilePicture.current) {
                          profilePicture.current.src = URL.createObjectURL(ev.target.files[0]);
                        }
                      }}
                             ref={profilePictureChooser}
                       />
                      <img
                        src={demoMentorImage}
                        alt="Profile"
                        className="rounded-circle"
                        style={{
                          cursor: isEditing ? "pointer" : "unset",
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        onClick={
                          isEditing
                            ? () => {
                                if (profilePictureChooser.current) {
                                  profilePictureChooser.current.click();
                                }
                              }
                            : undefined
                        }
                        ref={profilePicture}
                      />
                  </div>

                  {/* Profile Details */}
                  <div className="text-center text-md-start">
                    {isEditing ? (
                      <>
                        <Form.Control
                          name="name"
                          placeholder="Name"
                          className="mb-2"
                          value={formikProps.values.name}
                          onChange={formikProps.handleChange}
                        />
                        <Form.Control
                          name="title"
                          placeholder="Title"
                          className="mb-2"
                          value={formikProps.values.title}
                          onChange={formikProps.handleChange}
                        />
                        <Form.Control
                          name="occupation"
                          placeholder="Occupation"
                          className="mb-2"
                          value={formikProps.values.occupation}
                          onChange={formikProps.handleChange}
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
                    {
                      isEditing ? (
                        <FieldArray name="skills">
                          {(arrayHelpers) => (
                            <div className="w-100">
                            <Form.Group>
                            <Form.Select className="mb-2" value="Skill" onChange={(ev) => {
                              arrayHelpers.push(tags[ev.currentTarget.selectedIndex - 1]);
                            }}>
                            <option selected disabled>Skill</option>
                            {tags.map((tag) => (
                              <option key={tag.tag_id} disabled={formikProps.values.skills.map(value => value.tag_name).includes(tag.tag_name)}>{tag.tag_name}</option>
                            ))}
                            </Form.Select>

                            </Form.Group>
{formikProps.values.skills.map((tag, index) => (
                                <Badge
                              bg="warning"
                              text="dark"
                              className="me-2 mb-2"
                              style={{
                                cursor: "pointer",
                                padding: "10px",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                              }}
                                  onClick={() =>
                                    arrayHelpers.remove(index)
                                  }

                                         key={tag.tag_id}>{tag.tag_name}</Badge>
                              ))}
                            </div>
                          )}
                        </FieldArray>

                                         ) : (
                        (profile?.mentee?.interests ?? profile?.mentor?.expertise ?? []).map(
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
                              {skill.tag_name}
                            </Badge>
                          ),
                        )
                      )
                  }
                  </div>
                </Card.Body>
                {isEditing && (
                  <div className="d-flex justify-content-end mt-3">
                    <Button variant="success" type="submit">
                      Save
                    </Button>
                  </div>
                )}
        </Card>
      </div>
    </div>
  );
};

export default ProfileCard;
