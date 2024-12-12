import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  Card,
  Tabs,
  Tab,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import {
  getAllMentees,
  getAllReferrals,
  updateRating,
  updateReferralStatus,
} from "../apis/mentors";
import { API_URL } from "../apis/commons";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import Select from "../components/Select";
import * as Yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { createJob } from "../apis/job";
import states from "../misc/states";

const CreateJobModal = ({
  handleChange,
  handleBlur,
  handleSubmit,
  setFieldValue,
  values,
  errors,
  touched,
}) => {
  return (

    <FormikForm noValidate onSubmit={handleSubmit} style={{ maxWidth: "90%" }} className="mx-auto">

      {/* Job Title */}
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Job title <span className="text-danger">*</span>
        </label>
        <Field
          type="text"
          id="title"
          name="title"
          className="form-control"
          placeholder="Enter job title here"
        />
        <ErrorMessage
          name="title"
          component="div"
          className="text-danger"
        />
      </div>

      {/* Job Description */}
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Job description <span className="text-danger">*</span>
        </label>
        <Field
          as="textarea"
          id="description"
          name="description"
          className="form-control"
          placeholder="Type description here..."
        />
        <ErrorMessage
          name="description"
          component="div"
          className="text-danger"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="company_details" className="form-label">
          Company Details <span className="text-danger">*</span>
        </label>
        <Field
          as="textarea"
          id="company_details"
          name="company_details"
          className="form-control"
          placeholder="Type company details here..."
        />
        <ErrorMessage
          name="company_details"
          component="div"
          className="text-danger"
        />
      </div>

      {/* Company Name */}
      <div className="mb-3">
        <label htmlFor="company_name" className="form-label">
          Company name <span className="text-danger">*</span>
        </label>
        <Field
          type="text"
          id="company_name"
          name="company_name"
          className="form-control"
          placeholder="Enter company name here"
        />
        <ErrorMessage
          name="company_name"
          component="div"
          className="text-danger"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="company_email" className="form-label">
          Company Email <span className="text-danger">*</span>
        </label>
        <Field
          type="text"
          id="company_email"
          name="company_email"
          className="form-control"
          placeholder="Enter company URL here"
        />
        <ErrorMessage
          name="company_email"
          component="div"
          className="text-danger"
        />
      </div>

      {/* Location */}
      <div className="mb-3">
        <div className="mb-3">
          <Select
            name="location"
            value={values.location} // Ensure this is the correct prop for value
            options={states} // Ensure states is an array of { value, label }
            placeholder="Select a location"
            label="Location"
            required
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <ErrorMessage
            name="location"
            component="div"
            className="text-danger"
          />
        </div>

        <ErrorMessage
          name="location"
          component="div"
          className="text-danger"
        />
      </div>

      {/* Job Types */}
      <div className="mb-3">
        <label className="form-label">
          Job Timings: <span className="text-danger">*</span>
        </label>
        <div>
          <label className="form-check-label me-3">
            <Field
              type="radio"
              name="job_type1"
              value="FullTime"
              className="form-check-input me-1"
            />
            Full Time
          </label>
          <label className="form-check-label">
            <Field
              type="radio"
              name="job_type1"
              value="PartTime"
              className="form-check-input me-1"
            />
            Part Time
          </label>
        </div>
        <ErrorMessage
          name="job_type1"
          component="div"
          className="text-danger"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Job Location <span className="text-danger">*</span>
        </label>
        <div>
          <label className="form-check-label me-3">
            <Field
              type="radio"
              name="job_type2"
              value="Onsite"
              className="form-check-input me-1"
            />
            On site
          </label>
          <label className="form-check-label">
            <Field
              type="radio"
              name="job_type2"
              value="Remote"
              className="form-check-input me-1"
            />
            Remote
          </label>
        </div>
        <ErrorMessage
          name="job_type2"
          component="div"
          className="text-danger"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">
          Job Type: <span className="text-danger">*</span>
        </label>
        <div>
          {["Internship", "Government", "Freelance", "Contract"].map(
            (type) => (
              <label className="form-check-label me-3" key={type}>
                <input
                  type="checkbox"
                  name="job_type3"
                  value={type}
                  className="form-check-input me-1"
                  checked={values.job_type3.includes(type)}
                  onChange={(e) => {
                    const { checked } = e.target;
                    const updatedArray = checked
                      ? [...values.job_type3, type]
                      : values.job_type3.filter((item) => item !== type);
                    setFieldValue("job_type3", updatedArray);
                  }}
                />
                {type}
              </label>
            ),
          )}
        </div>
        <ErrorMessage
          name="job_type3"
          component="div"
          className="text-danger"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="qualifications" className="form-label">
          Qualifications <span className="text-danger">*</span>
        </label>
        <Field
          as="textarea"
          id="qualifications"
          name="qualifications"
          className="form-control"
          placeholder="Enter qualifications"
        />
        <ErrorMessage
          name="qualifications"
          component="div"
          className="text-danger"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="benefits" className="form-label">
          Benefits <span className="text-danger">*</span>
        </label>
        <Field
          as="textarea"
          id="benefits"
          name="benefits"
          className="form-control"
          placeholder="Enter benefits"
        />
        <ErrorMessage
          name="benefits"
          component="div"
          className="text-danger"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="app_details" className="form-label">
          Application Details <span className="text-danger">*</span>
        </label>
        <Field
          as="textarea"
          id="app_details"
          name="app_details"
          className="form-control"
          placeholder="Enter application details"
        />
        <ErrorMessage
          name="description"
          component="div"
          className="text-danger"
        />
      </div>
      {/* Deadline */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="mb-3">
          <label htmlFor="deadline" className="form-label">
            Deadline <span className="text-danger">*</span>
          </label>
          <div>
            <Field name="deadline">
              {({ field, form }) => (
                <DateTimePicker
                  label="Select deadline"
                  value={field.value || null} // Bind Formik's field value
                  onChange={(value) =>
                    form.setFieldValue("deadline", value)
                  } // Update Formik's state
                  renderInput={(params) => (
                    <>
                      <input
                        {...params.inputProps}
                        id="deadline"
                        className="form-control"
                        placeholder="Select deadline"
                      />
                      {form.errors.deadline && form.touched.deadline && (
                        <div className="text-danger">
                          {form.errors.deadline}
                        </div>
                      )}
                    </>
                  )}
                />
              )}
            </Field>
          </div>
        </div>
      </LocalizationProvider>

      {/* Salary */}
      <div className="mb-3">
        <label htmlFor="salary" className="form-label">
          Salary <span className="text-danger">*</span>
        </label>
        <Field
          type="number"
          id="salary"
          name="salary"
          className="form-control"
          placeholder="Enter salary (0 if unpaid)"
        />
        <ErrorMessage
          name="salary"
          component="div"
          className="text-danger"
        />
      </div>
      {/* Submit Button */}
    </FormikForm>
  );
};

const ReferralRequests = () => {
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [activeTab, setActiveTab] = useState("referralRequests");
  const [modalData, setModalData] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const [mentees, setMentees] = useState([]);

  const handleSelectReferral = (referral) => {
    setSelectedReferral(referral);
  };

  const handleOpenModal = (mentee) => {
    const existingMentee = mentees.find((_mentee) => _mentee.id === mentee.id);
    setModalData({
      mentee,
    });
  };

  const handleSaveReferral = () => {
    updateRating({
      mentee_id: modalData.id,
      rating: modalData.rating,
      comment: modalData.comment,
    })
      .then(() => {
        setModalData(null);
        onLoad();
      })
      .catch((err) => console.error(err));
  };

  // Filter mentees based on the search query
  const filteredMentees = mentees.filter((mentee) =>
    mentee.User.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Helper function to render stars based on rating
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i < rating ? "gold" : "gray",
            fontSize: "2rem", // Increased size for better visibility
            marginRight: "5px", // Space between stars
          }}
        >
          ★
        </span>,
      );
    }
    return stars;
  };

  const [isLoading, setIsLoading] = useState(true);

  const onLoad = async () => {
    setIsLoading(true);
    const referralsRes = await getAllReferrals();
    setReferrals(referralsRes.data.referrals);
    setSelectedReferral(null);

    const menteesRes = await getAllMentees();
    setMentees(menteesRes.data.mentees);
    setIsLoading(false);
  };

  useEffect(() => {
    onLoad();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex h-100 w-100 justify-content-center align-items-center">
        <Spinner />
      </div>
    );
  }

  const jobsValidationSchema = Yup.object({
    title: Yup.string().required("Job title is required"),
    description: Yup.string().required("Job description is required"),
    company_name: Yup.string().required("Company name is required"),
    company_details: Yup.string().required("Company details are required"),
    job_type1: Yup.string()
      .oneOf(["FullTime", "PartTime"], "Please select a valid option")
      .required("This field is required"),
    job_type2: Yup.string()
      .oneOf(["Onsite", "Remote"], "Please select a valid option")
      .required("This field is required"),
    job_type3: Yup.array()
      .of(
        Yup.string().oneOf([
          "Internship",
          "Government",
          "Freelance",
          "Contract",
        ]),
      )
      .min(1, "Please select at least one option")
      .required("This field is required"),
    location: Yup.string().required("Please select a location"),
    qualifications: Yup.string().required("Please enter qualifications"),
    benefits: Yup.string().required("Please enter benefits"),
    app_details: Yup.string().required("Please enter application details"),
    deadline: Yup.date().required("Please enter a deadline"),
    salary: Yup.number().required("Salary is required"),
  });

  return (
    <Container fluid>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mt-4"
      >
        {/* Referral Requests Tab */}
        <Tab eventKey="referralRequests" title="Referral Requests">
          <Row className="mt-4">
            <Col md={3} className="border-end p-3">
              <h5 className="text-center text-primary">Referral Requests</h5>
              <ListGroup>
                {referrals.map((referral) => (
                  <ListGroup.Item
                    key={referral.id}
                    action
                    onClick={() => handleSelectReferral(referral)}
                    className="mb-2 shadow-sm p-3 rounded-lg"
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "10px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div>
                      <h5>{referral.mentee.User.name}</h5>
                      <h6 className="m-0">{referral.status}</h6>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={9}>
              {selectedReferral ? (
                <Card
                  className="shadow-lg rounded-lg mb-4"
                  style={{ position: "relative" }}
                >
                  <Card.Body className="d-flex">
                    <div className="flex-grow-1">
                      <Card.Title>
                        Details for {selectedReferral.mentee.User.name}
                      </Card.Title>
                      <Card.Text>
                        <strong>Job URL:</strong>{" "}
                        <a
                          href={selectedReferral.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary"
                        >
                          {selectedReferral.job_url}
                        </a>
                      </Card.Text>
                      <Card.Text>
                        <strong>Cover Letter:</strong> {selectedReferral.reason}
                      </Card.Text>
                      <Card.Text>
                        <strong>Resume:</strong>{" "}
                        <a
                          href={`${API_URL}/api/auth/file/${selectedReferral.resume_id}`}
                          className="text-primary"
                          download
                        >
                          {selectedReferral.resume.filename}
                        </a>
                      </Card.Text>
                      <Card.Text>
                        <strong>Description:</strong>{" "}
                        {selectedReferral.description}
                      </Card.Text>
                      <div className="d-flex gap-2">
                        {selectedReferral.status === "PENDING" && (
                          <>
                            <Button
                              onClick={() => {
                                updateReferralStatus({
                                  referral_id: selectedReferral.id,
                                  status: "ACCEPTED",
                                })
                                  .then((_) => onLoad())
                                  .catch((err) => console.error(err));
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() => {
                                updateReferralStatus({
                                  referral_id: selectedReferral.id,
                                  status: "REJECTED",
                                })
                                  .then((_) => onLoad())
                                  .catch((err) => console.error(err));
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <h5 className="text-center text-muted">
                  Select a mentee to view details
                </h5>
              )}
            </Col>
          </Row>
        </Tab>

        {/* Make a Referral Tab */}
        <Tab eventKey="makeReferral" title="Make a Referral">
          <Row className="mt-4">
            <Col>
              <h5 className="text-center text-primary">Mentees List</h5>
              {/* Search Bar */}
              <Form.Control
                type="text"
                placeholder="Search Mentees"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-3"
              />
              <ListGroup>
                {filteredMentees.map((mentee) => {
                  const referral = referrals.find(
                    (ref) => ref.id === mentee.id,
                  );
                  return (
                    <ListGroup.Item
                      key={mentee.id}
                      action
                      onClick={() => handleOpenModal(mentee)}
                      className="mb-2 shadow-sm p-3 rounded-lg"
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "10px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {mentee.profileIcon} {mentee.User.name}
                      <div className="mt-2"></div>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Modal for Rating and Comment */}
      {modalData && (
        <Modal show onHide={() => setModalData(null)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Send job application</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{
                title: "",
                description: "",
                company_name: "",
                company_email: "",
                company_details: "",
                location: "",
                job_type1: "",
                job_type2: "",
                job_type3: [],
                qualifications: "",
                benefits: "",
                app_details: "",
                deadline: null,
                salary: "",
              }}
              validationSchema={jobsValidationSchema}
              onSubmit={async (values) => {
                console.log(values);
                try {
                  const payload = {
                    ...values,
                    work_schedule: values.job_type1,
                    work_location: values.job_type2,
                    employment_categories: values.job_type3,
                    deadline: values.deadline
                      ? new Date(values.deadline).toISOString()
                      : null,
                    salary: values.salary.toString(),
                  };

                  delete payload.job_type1;
                  delete payload.job_type2;
                  delete payload.job_type3;

                  console.log("Final Payload:", payload);

                  await createJob(payload);
                  setModalData(null)
                } catch (err) {
                  console.error("Submission Error:", err);
                }
              }}
            >
              {(formikProps) => (
                <CreateJobModal {...formikProps} />
              )}
            </Formik>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalData(null)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveReferral}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default ReferralRequests;
