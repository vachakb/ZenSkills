import React from "react";
import { Form, Button, Col, Row, Card, InputGroup } from "react-bootstrap";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { createSession } from "../apis/session";



const SessionForm1 = () => {
  const navigate = useNavigate();

  const prevForm = useLocation().state;

  const daysOfWeek = [
    "SUNDAYS",
    "MONDAYS",
    "TUESDAYS",
    "WEDNESDAYS",
    "THURSDAYS",
    "FRIDAYS",
    "SATURDAYS",
  ];

  // Validation schema
  const validationSchema = Yup.object({
    availability: Yup.array().of(
      Yup.object({
        day: Yup.string().required(),
        slots: Yup.array().of(
          Yup.object({
            start: Yup.string().required("Start time is required"),
            end: Yup.string().required("End time is required"),
          })
        ),
      })
    ),
  });

  // Initial values
  const initialValues = {
    availability: daysOfWeek.map((day) => ({
      day,
      enabled: day === "SUNDAYS", // Default to Sunday
      slots: day === "SUNDAYS" ? [{ start: "09:00", end: "17:00" }] : [],
    })),
  };

  return (
    <div className="session-form-container mx-2" style={{ border: '1px solid black', width: '97%' }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          createSession({ ...values, ...prevForm }).then(() => navigate("/user_profile"));
        }}
      >
        {({ values, handleSubmit, handleChange }) => (
          <Form onSubmit={handleSubmit}>
            {/* Title and Card Header */}
            <h2 className="form-title">Create new 1:1 session</h2>
            <Card className="session-card mb-4">
              <Card.Body>
                <Card.Title>Tell us about your session</Card.Title>
                <Card.Text>
                  Names, duration, public/private
                  <Button variant="link" className="edit-button">
                    <i className="bi bi-pencil-fill"></i>
                  </Button>
                </Card.Text>
              </Card.Body>
            </Card>

            {/* Availability Section */}
            <div className="availability-section">
              <h3 className="section-title">When are you available?</h3>
              <p className="section-description">
                Define your availability for this session. You will receive bookings in your local timezone.
              </p>
              <hr />

              <FieldArray name="availability">
                {({ push, remove }) =>
                  values.availability.map((day, dayIndex) => (
                    <div key={day.day} className="day-container mb-3 p-3" style={{ border: '1px solid grey' }}>

                      {/* Day toggle switch */}
                      <Form.Check
                        type="switch"
                        id={`availability-${day.day}`}
                        label={day.day}
                        checked={day.enabled}
                        onChange={() => {
                          // Toggle the "enabled" state for the current day
                          const updatedAvailability = [...values.availability];
                          updatedAvailability[dayIndex].enabled = !day.enabled;

                          // If enabling, initialize slots with a default value
                          if (updatedAvailability[dayIndex].enabled) {
                            if (updatedAvailability[dayIndex].slots.length === 0) {
                              updatedAvailability[dayIndex].slots = [{ start: "", end: "" }];
                            }
                          } else {
                            // If disabling, clear the slots
                            updatedAvailability[dayIndex].slots = [];
                          }

                          // Update the values directly
                          handleChange({
                            target: {
                              name: "availability",
                              value: updatedAvailability,
                            },
                          });
                        }}
                      />


                      {/* Time Slots */}
                      {day.enabled && (
                        <FieldArray name={`availability.${dayIndex}.slots`} >
                          {({ push, remove }) => (
                            <>
                              {day.slots.map((slot, slotIndex) => (
                                <Row
                                  key={slotIndex}
                                  className="align-items-center slot-row"
                                >
                                  <Col md={5}>
                                    <InputGroup>
                                      <Form.Control
                                        type="time"
                                        name={`availability.${dayIndex}.slots.${slotIndex}.start`}
                                        value={slot.start}
                                        onChange={handleChange}
                                      />

                                    </InputGroup>

                                  </Col>

                                  <Col md={5}>
                                    <InputGroup>
                                      <Form.Control
                                        type="time"
                                        name={`availability.${dayIndex}.slots.${slotIndex}.end`}
                                        value={slot.end}
                                        onChange={handleChange}
                                      />
                                    </InputGroup>

                                  </Col>

                                  <Col md={2}>
                                    <Button
                                      variant="danger"
                                      onClick={() => remove(slotIndex)}
                                    >
                                      X
                                    </Button>
                                  </Col>
                                </Row>
                              ))}
                              <Button
                                variant="link"
                                className="add-slot-button"
                                onClick={() =>
                                  push({ start: "", end: "" })
                                }
                              >
                                + Add Slot
                              </Button>
                            </>
                          )}
                        </FieldArray>

                      )}

                    </div>


                  ))
                }

              </FieldArray>

            </div>
            <hr />

            {/* Footer Buttons */}
            <div className="form-footer">
              <Button type="button" variant="outline-primary" className="back-button" onClick={() => navigate("/createsession_1")}>
                Back
              </Button>
              <Button type="submit" variant="primary" className="next-button">
                Next
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SessionForm1;
