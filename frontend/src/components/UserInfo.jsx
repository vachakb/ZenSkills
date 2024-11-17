import React from "react";

const UserInfo = () => {
    return (
        <div className="container mt-4 mx-0 px-0" >
            {/* Bio Section */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">BIO</h5>
                    <p className="card-text">
                        As a final-year Computer Science student at ABC University, I'm eager to expand my skills and transition into the tech industry. I have a solid foundation in Java, Python, and web...
                    </p>
                </div>
            </div>

            {/* Skills and Education Section */}
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
                                <li className="list-group-item">
                                    Computer Engineering <br />
                                    <span className="text-muted">at ABC College</span>
                                </li>
                                <li className="list-group-item">
                                    Higher Secondary School <br />
                                    <span className="text-muted">at Institute name</span>
                                </li>
                            </ul>
                            <a href="#education" className="text-primary mt-2 d-block">
                                See more
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo; 