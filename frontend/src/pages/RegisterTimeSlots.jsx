import { Col, Container, Row, Form, Button, Spinner, Card, InputGroup } from "react-bootstrap";
import Authcard from "../components/Authcard";
import { useNavigate } from "react-router-dom";
import useProfile from "../hooks/useProfile";
import { FieldArray, Formik } from "formik";
import * as yup from "yup";
import { createTimeSlots } from "../apis/session";

function RegisterTimeSlots() {
  const navigate = useNavigate();

  const daysOfWeek = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  // Validation schema
  const validationSchema = yup.object({
    availability: yup.array().of(
      yup.object({
        day: yup.string().required(),
        slots: yup.array().of(
          yup.object({
            start: yup.string().required("Start time is required"),
            end: yup.string().required("End time is required"),
          })
        ),
      })
    ),
  });

  // Initial values
  const initialValues = {
    availability: daysOfWeek.map((day) => ({
      day,
      enabled: day === "SUNDAY", // Default to Sunday
      slots: day === "SUNDAY" ? [{ start: "09:00", end: "17:00" }] : [],
    })),
  };

  return (
    <Container className="d-flex vh-100 p-0" fluid>
      <Authcard />
      <Col className="d-flex justify-content-center align-items-center">

        <Row>
          <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={(data) => {
            createTimeSlots(data).then(() => navigate("/verification")).catch(err => console.error(err));
          }}>
            {({ values, handleSubmit, handleChange }) => (
              <Form onSubmit={handleSubmit}>
                {/* Title and Card Header */}

                {/* Availability Section */}
                <div className="availability-section">
                  <h3 className="section-title">When are you available?</h3>
                  <p className="section-description">
                    Define your availability for this session. You will receive bookings in your local timezone.
                  </p>
                  <hr />

                  <FieldArray as="div" name="availability">
                    {({ push, remove }) => (

                      <div style={{ height: "500px", overflow: "auto" }}>
                        {values.availability.map((day, dayIndex) => (
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


                        ))}</div>
                    )}

                  </FieldArray>

                </div>
                <hr />

                {/* Footer Buttons */}
                <div className="form-footer">
                  <Button type="submit" variant="primary" className="ms-auto next-button">
                    Continue
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Row>
      </Col>
    </Container>
  );
}
export default RegisterTimeSlots;
