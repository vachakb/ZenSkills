import { Col, Container, Row, Form, Button, Spinner } from "react-bootstrap";
import Authcard from "../components/Authcard";
import TextField from "../components/TextField";
import * as yup from "yup";
import { Formik } from "formik";
import { useState } from "react";
import { register, sendVerificationEmail } from "../apis/user";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function Register() {
  const [isMentor, setIsMentor] = useState(false);

  const [verificationEmailSent, setVerificationEmailSent] = useState(false);

  const [verificationEmailAddress, setVerificationEmailAddress] = useState(
    "example@example.com",
  );

  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .required("This is a required field"),
    password: yup
      .string()
      .required("This is a required field")
      .min(8, "Password should be at least 8 characters"),
    phoneNum: yup
      .string()
      .required("This is a required field")
      .test(
        "is-valid-phone",
        "Phone number is invalid",
        (value) => value && value.length >= 10, // Or use a regex for more accuracy
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "The passwords don't match")
      .required("This is a required field"),
  });

  return (
    <Container className="d-flex vh-100 p-0" fluid>
      <Authcard />
      <Col className="d-flex justify-content-center align-items-center">
        {isLoading ? (
          <Spinner />
        ) : (
          <Row>
            {verificationEmailSent ? (
              <div className="text-center w-75 m-auto">
                <h1 className="fw-bold">Thank you!</h1>
                <h4>
                  We sent an email to: <b>{verificationEmailAddress}</b>.
                </h4>
                <h4>
                  Follow the instructions to finish setting up your account.
                </h4>
                <h5 className="mt-4">
                  If you haven't received the email in the next few minutes,
                  please check your spam folder.
                </h5>
              </div>
            ) : (
              <Formik
                validationSchema={schema}
                initialValues={{
                  email: "",
                  password: "",
                  confirmPassword: "",
                  phoneNum: "",
                }}
                onSubmit={async (data) => {
                  setIsLoading(true);

                  try {
                    const role = isMentor ? "mentor" : "mentee";
                    await register({
                      ...data,
                      role: isMentor ? "mentor" : "mentee",
                    });
                    await sendVerificationEmail(data.email, role);
                    setVerificationEmailAddress(data.email);
                    setVerificationEmailSent(true);
                  } catch (err) {
                    console.error(err);
                    if (err.response) {
                      if (err.response.status === 409) {
                        alert("A user with that email already exists.");
                      }
                    }
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {(formikProps) => (
                  <Form
                    className="d-flex flex-column gap-4"
                    noValidate
                    onSubmit={formikProps.handleSubmit}
                  >
                    <div
                      className="d-flex p-1 rounded"
                      style={{ backgroundColor: "#ECF0FF" }}
                    >
                      <Button
                        className="flex-grow-1"
                        onClick={() => setIsMentor(true)}
                        style={{
                          backgroundColor: isMentor ? "#2E2F5B" : "#C6C2F9",
                          borderColor: isMentor ? "#2E2F5B" : "#C6C2F9",
                          color: isMentor ? "white" : "#958CC4",
                        }}
                      >
                        Mentor
                      </Button>
                      <Button
                        className="flex-grow-1"
                        onClick={() => setIsMentor(false)}
                        style={{
                          backgroundColor: isMentor ? "#C6C2F9" : "#2E2F5B",
                          borderColor: isMentor ? "#C6C2F9" : "#2E2F5B",
                          color: isMentor ? "#958CC4" : "white",
                        }}
                      >
                        Mentee
                      </Button>
                    </div>
                    <h1 className="my-4 fw-bold">Let's get you started</h1>
                    <TextField
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formikProps.values.email}
                      placeholder="abc123@gmail.com"
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isValid={
                        formikProps.touched.email && !formikProps.errors.email
                      }
                      isInvalid={
                        formikProps.touched.email && !!formikProps.errors.email
                      }
                      error={formikProps.errors.email}
                      required
                    />
                    <TextField
                      name="password"
                      label="Password"
                      type="password"
                      value={formikProps.values.password}
                      placeholder="********"
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isValid={
                        formikProps.touched.password &&
                        !formikProps.errors.password
                      }
                      isInvalid={
                        formikProps.touched.password &&
                        !!formikProps.errors.password
                      }
                      error={formikProps.errors.password}
                      required
                    />
                    <TextField
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      value={formikProps.values.confirmPassword}
                      placeholder="********"
                      onChange={formikProps.handleChange}
                      onBlur={formikProps.handleBlur}
                      isValid={
                        formikProps.touched.confirmPassword &&
                        !formikProps.errors.confirmPassword
                      }
                      isInvalid={
                        formikProps.touched.confirmPassword &&
                        !!formikProps.errors.confirmPassword
                      }
                      error={formikProps.errors.confirmPassword}
                      required
                    />

                    <PhoneInput
                      name="phoneNum"
                      country={"in"}
                      value={formikProps.values.phoneNum}
                      onChange={(value) =>
                        formikProps.setFieldValue("phoneNum", value)
                      }
                      onBlur={() =>
                        formikProps.setFieldTouched("phoneNum", true)
                      }
                      inputClass="form-control"
                    />

                    {formikProps.touched.phoneNum &&
                      formikProps.errors.phoneNum && (
                        <div className="text-danger">
                          {formikProps.errors.phoneNum}
                        </div>
                      )}
                    <Button
                      type="submit"
                      /* disabled={
                    formikProps.isValidating ||
                    formikProps.isSubmitting ||
                    !(formikProps.isValid && formikProps.dirty)
                  }*/
                      onClick={() => console.log(formikProps.values.phoneNum)}
                    >
                      Create Account
                    </Button>
                    <div className="d-flex align-items-center mt-4">
                      <div
                        style={{ borderTop: "2px black solid" }}
                        className="flex-grow-1"
                      ></div>
                      <p className="m-0 mx-4">OR</p>
                      <div
                        style={{ borderTop: "2px black solid" }}
                        className="flex-grow-1"
                      ></div>
                    </div>
                    <p className="m-0 mx-auto">
                      Already have an account?{" "}
                      <a className="text-decoration-none" href="/login">
                        Login
                      </a>
                    </p>
                  </Form>
                )}
              </Formik>
            )}
          </Row>
        )}
      </Col>
    </Container>
  );
}
export default Register;
