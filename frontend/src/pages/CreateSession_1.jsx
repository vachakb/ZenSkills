import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Dropdown, Button } from "react-bootstrap";

const SessionForm = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [availableTopics, setAvailableTopics] = useState([
    "Design Thinking",
    "Web Development",
    "Data Science",
    "Leadership",
  ]);

  const handleSelectTopic = (topic, setFieldValue) => {
    if (selectedTopics.length < 3) {
      const newSelectedTopics = [...selectedTopics, topic];
      setSelectedTopics(newSelectedTopics);
      setAvailableTopics(availableTopics.filter((t) => t !== topic));
      setFieldValue("selectedTopics", newSelectedTopics);
    }
  };

  const handleRemoveTag = (topic, setFieldValue) => {
    const newSelectedTopics = selectedTopics.filter((t) => t !== topic);
    setSelectedTopics(newSelectedTopics);
    setAvailableTopics([...availableTopics, topic]);
    setFieldValue("selectedTopics", newSelectedTopics);
  };

  const validationSchema = Yup.object({
    sessionName: Yup.string().required("Session name is required"),
    eventDescription: Yup.string().required("Event description is required"),
    sessionDuration: Yup.number()
      .required("Session duration is required")
      .positive("Duration must be positive")
      .integer("Duration must be a whole number"),
    selectedTopics: Yup.array()
      .min(1, "Please select at least one topic")
      .max(3, "You can select a maximum of 3 topics"),
  });

  return (
    <div className="full-page">
      <div className="form-container">
        <h3><u>Tell us about your session</u></h3>
        <Formik
          initialValues={{
            sessionName: "",
            eventDescription: "",
            sessionDuration: "",
            selectedTopics: [],
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="mb-3 mt-3">
                <label htmlFor="sessionName" className="form-label">
                  Session name <span className="text-danger">*</span>
                </label>
                <Field
                  type="text"
                  id="sessionName"
                  name="sessionName"
                  className="form-control"
                  placeholder="Morning portfolio review"
                />
                <ErrorMessage
                  name="sessionName"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="eventDescription" className="form-label">
                  Event description or agenda{" "}
                  <span className="text-danger">*</span>
                </label>
                <Field
                  as="textarea"
                  id="eventDescription"
                  name="eventDescription"
                  className="form-control"
                  placeholder="Type description here..."
                />
                <ErrorMessage
                  name="eventDescription"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="sessionDuration" className="form-label">
                  Set the duration of session in minutes{" "}
                  <span className="text-danger">*</span>
                </label>
                <Field
                  type="number"
                  id="sessionDuration"
                  name="sessionDuration"
                  className="form-control"
                  placeholder="Eg: 15"
                />
                <ErrorMessage
                  name="sessionDuration"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="selectedTopics" className="form-label">
                  Select relevant topics for session{" "}
                  <span className="text-danger">*</span>
                </label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {selectedTopics.map((topic, index) => (
                    <span
                      key={index}
                      className="badge bg-primary text-white px-3 py-2"
                      style={{ borderRadius: "20px", cursor: "pointer" }}
                      onClick={() => handleRemoveTag(topic, setFieldValue)}
                    >
                      {topic} <span className="ms-2">✕</span>
                    </span>
                  ))}
                </div>

                <Dropdown>
                  <Dropdown.Toggle
                    variant="secondary"
                    id="dropdown-basic"
                    disabled={availableTopics.length === 0}
                    className="form-control mb-3"
                    style={{ border: "1px solid grey" }}
                  >
                    {availableTopics.length > 0
                      ? "Select a topic"
                      : "No topics available"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    align="start"
                    flip={false}
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      width: "100%",
                    }}
                  >
                    {availableTopics.map((topic, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() => handleSelectTopic(topic, setFieldValue)}
                      >
                        {topic}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <ErrorMessage
                  name="selectedTopics"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="d-flex justify-content-between mt-4">
                <Button variant="outline-primary" type="button">
                  Back
                </Button>
                <Button variant="primary" type="submit">
                  Next
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SessionForm;
