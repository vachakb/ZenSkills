import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Authcard from "../components/Authcard";
import TextField from "../components/TextField";
import * as yup from "yup";
import { Formik } from "formik";
import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { loginUser } from '../services/authServices'; 

const Role = Object.freeze({
  Mentor: "mentor",
  Mentee: "mentee"
});

const GOOGLE_CLIENT_ID = "172493269774-4qr965tabedoqajcv49jpu2btps6sg8v.apps.googleusercontent.com";
const API_URL = "http://localhost:5000";

function Login() {
  const [isMentor, setIsMentor] = useState(false);

  const navigate = useNavigate();

  const schema = yup.object({
    email: yup
      .string()
      .email("Must be a valid email")
      .required("This is a required field"),
    password: yup
      .string()
      .required("This is a required field")
      .min(8, "Password should be at least 8 characters"),
  });


  return (
    <Container className="d-flex vh-100 p-0" fluid>
      <Authcard />
      <Col className="d-flex justify-content-center align-items-center">
        <Row>
          <Formik
            validationSchema={schema}
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={async (data) => {
              try {
                const res = await axios.post(
                  `${API_URL}/auth/login`, 
                  {
                    email: data.email, 
                    password: data.password,
                    role: isMentor ? Role.Mentor : Role.Mentee,
                  },
                  { headers: { 'Content-Type': 'application/json' } }
                );
                console.log("Login success:", res.data);
                navigate('/mentee_welcome');
              } catch (error) {
                console.error('Login error:', error);
              }
            }}            
          >
            {(formikProps) => (
              <Form className="d-flex flex-column gap-4" noValidate onSubmit={formikProps.handleSubmit}>
                <div className="d-flex p-1 rounded" style={{ backgroundColor: "#ECF0FF" }}>
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
                    formikProps.touched.password && !formikProps.errors.password
                  }
                  isInvalid={
                    formikProps.touched.password &&
                    !!formikProps.errors.password
                  }
                  error={formikProps.errors.password}
                  required
                />
                <Button
                  type="submit"
                  disabled={
                    formikProps.isValidating ||
                    formikProps.isSubmitting ||
                    !(formikProps.isValid && formikProps.dirty)
                  }
                >
                  Login
                </Button>
                <div className="d-flex align-items-center mt-4">
                  <div style={{ borderTop: "2px black solid" }} className="flex-grow-1"></div>
                  <p className="m-0 mx-4">OR</p>
                  <div style={{ borderTop: "2px black solid" }} className="flex-grow-1"></div>
                </div>

                <GoogleLogin
                  clientId={GOOGLE_CLIENT_ID}
                  onSuccess={async (response) => {
                    const { credential } = response;
                    try {
                      const res = await axios.post(
                        `${API_URL}/auth/google/callback`,
                        { token: credential },
                        { headers: { 'Content-Type': 'application/json' } },
                        { withCredentials: true }
                      );
                      console.log('Backend Response:', res.data);
                    } catch (error) {
                      console.error('Error during backend processing:', error);
                    }
                  }}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                />
                
                <p className="m-0 mx-auto">Don't have an account? <a className="text-decoration-none" href="/register">Register</a></p>
              </Form>
            )}
          </Formik>
        </Row>
      </Col>
    </Container>
  );
}
export default Login;
