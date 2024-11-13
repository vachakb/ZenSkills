import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Authcard from "../components/Authcard";
import TextField from "../components/TextField";
import * as yup from "yup";
import { Formik } from "formik";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

function RegisterBio() {
  const prevForm = useLocation().state;

  const schema = useMemo(() => {
    if (prevForm.isMentor) {
      return yup.object({
        expertise: yup.string().required("This is a required field"),
        bio: yup.string(),
      });
    } else {
      return yup.object({
        interests: yup.string().required("This is a required field"),
        bio: yup.string(),
      });
    }
  }, [prevForm]);

  return (
    <Container className="d-flex vh-100 p-0" fluid>
      <Col className="d-flex justify-content-center align-items-center">
        <Row className="w-50">
          <Formik
            validationSchema={schema}
            initialValues={{
              interests: "",
              expertise: "",
              bio: "",
            }}
            onSubmit={(data) => {
              console.log({ ...prevForm, ...data });
            }}
          >
            {(formikProps) => (
              <Form
                className="d-flex flex-column gap-4"
                noValidate
                onSubmit={formikProps.handleSubmit}
              >
                <div className="text-center">
                  <h6 className="fst-italic" style={{ color: "#9C9AA5" }}>
                    3 / 3
                  </h6>
                  <h1 className="my-4 fw-bold">Almost There!</h1>
                </div>
                <TextField
                  name={prevForm.isMentor ? "expertise" : "interests"}
                  label={prevForm.isMentor ? "Expertise" : "Interests"}
                  type="text"
                  value={
                    prevForm.isMentor
                      ? formikProps.values.expertise
                      : formikProps.values.interests
                  }
                  placeholder="Web Design"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  isValid={
                    prevForm.isMentor
                      ? formikProps.touched.expertise &&
                        !formikProps.errors.expertise
                      : formikProps.touched.interests &&
                        !formikProps.errors.interests
                  }
                  isInvalid={
                    prevForm.isMentor
                      ? formikProps.touched.expertise &&
                        !!formikProps.errors.expertise
                      : formikProps.touched.interests &&
                        !!formikProps.errors.interests
                  }
                  error={
                    prevForm.isMentor
                      ? formikProps.errors.expertise
                      : formikProps.errors.interests
                  }
                  required
                />
                <TextField
                  as="textarea"
                  rows="5"
                  name="bio"
                  label="Tell us about yourself"
                  type="text"
                  value={formikProps.values.bio}
                  placeholder="Write your bio here"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  isValid={
                    formikProps.touched.bio && !formikProps.errors.bio
                  }
                  isInvalid={
                    formikProps.touched.bio && !!formikProps.errors.bio
                  }
                  error={formikProps.errors.bio}
                />
                <Button
                  type="submit"
                  disabled={
                    formikProps.isValidating ||
                    formikProps.isSubmitting ||
                    !(formikProps.isValid && formikProps.dirty)
                  }
                >
                  Continue
                </Button>
              </Form>
            )}
          </Formik>
        </Row>
      </Col>
      <Authcard side="right" />
    </Container>
  );
}
export default RegisterBio;
