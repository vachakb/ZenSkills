import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";

const UserInfo = ({ profile, isEditing }) => {
    const calculateDateDifference = (workExperience) => {
        const from = workExperience.from;
        const to = workExperience.to ?? DateTime.now()

        const diff = to.diff(from, ["years", "months"]).toObject();

        if (diff.years) {
            return `${Math.floor(diff.years)} yrs ${Math.floor(diff.months)} mos`;
        } else {
            return `${Math.floor(diff.months)} mos`;
        }
    };

    return (
        <div className="container mt-4 mx-0 px-0" >
            {/* Bio Section */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">BIO</h5>
                    <p className="card-text">
                        {profile.mentee.bio}
                    </p>
                </div>
            </div>

            {
                profile.isMentor ?
                <>
              <Card>
                  <Card.Body className="d-flex flex-column gap-2">
                      <Card.Text>
                          <h5 className="m-0">WORK EXPERIENCE</h5>
                      </Card.Text>
                {profile.workExperiences.map((workExperience) => (
                    <div className="d-flex flex-column gap-2">
                        <div className="d-flex gap-2">
                            <img src="/rosette.svg" />
                            <div className="d-flex flex-column gap-1">
                                <div className="d-flex align-items-center gap-2">
                                    <h5 className="m-0">{workExperience.title}</h5>
                                    <h6 className="m-0">{workExperience.from.toFormat("MMM yyyy")} - {workExperience.to ? workExperience.to.toFormat("MMM yyyy") : "present" }</h6>
                                </div>
                                <h6 className="m-0">{workExperience.company}</h6>
                                <h6 className="m-0" style={{ color: "#0077B5" }}>{calculateDateDifference(workExperience)}</h6>
                            </div>
                        </div>
                        <Link className="text-decoration-none m-0" style={{ color: "#4D9398" }} href="#">Show more</Link>
                    </div>
                ))}
                <div>
                </div>
                  </Card.Body>
              </Card>
                </>
                :
            /* Skills and Education Section */
            <div className="row">
                {/* Skills */}
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">SKILLS</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    UX/UI Designing
                                    <span className="text-muted">3 mos ago</span>
                                </li>
                                <li className="list-group-item">
                                    Python Programming Language <br />
                                    <span className="text-muted">at Institute name</span>
                                </li>
                            </ul>
                            <a href="#skills" className="text-primary mt-2 d-block">
                                See more
                            </a>
                        </div>
                    </div>
                </div>

                {/* Education */}
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Education</h5>
                            <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                    UX/UI Designing
                                    <span className="text-muted">3 mos ago</span>
                                </li>
                                <li className="list-group-item">
                                    Python Programming Language <br />
                                    <span className="text-muted">at Institute name</span>
                                </li>
           {/*} {profile.education.map((item)  => (
              <li className="list-group-item">
                {item.educationQualification} <br />
                <span className="text-muted">{item.companyName}</span>
              </li>
            ))}*/}
          </ul>
                            <a href="#education" className="text-primary mt-2 d-block">
                                See more
                            </a>
                        </div>
                    </div>
                </div>
            </div>
                }
        </div>
    );
};

export default UserInfo;
