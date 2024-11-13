import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Authcard from "../components/Authcard";
import TextField from "../components/TextField";
import * as yup from "yup";
import { Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";

function RegisterProfession() {
  const prevForm = useLocation().state;

  const navigate = useNavigate();

  const schema = useMemo(() => {
    if (prevForm.isMentor) {
      return yup.object({
        company: yup.string().required("This is a required field"),
        title: yup.string().required("This is a required field"),
        years: yup.number().required("This is a required field"),
        months: yup.number().required("This is a required field"),
      });
    } else {
      return yup.object({
        companyOrSchool: yup.string(),
        title: yup.string().required("This is a required field"),
      });
    }
  }, [prevForm]);

  return (
    <Container className="d-flex vh-100 p-0" fluid>
      <Authcard />
      <Col className="d-flex justify-content-center align-items-center">
        <Row>
          <Formik
            validationSchema={schema}
            initialValues={{
              company: "",
              companyOrSchool: "",
              title: "",
              years: 0,
              months: 0,
            }}
            onSubmit={(data) => {
              navigate("/register/3", { state: { ...prevForm, ...data } });
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
                    2 / 3
                  </h6>
                  <h1 className="my-4 fw-bold">Customize your Profile</h1>
                </div>
                <TextField
                  name={prevForm.isMentor ? "company" : "companyOrSchool"}
                  label={prevForm.isMentor ? "Company" : "Company/School"}
                  type="text"
                  value={
                    prevForm.isMentor
                      ? formikProps.values.company
                      : formikProps.values.companyOrSchool
                  }
                  placeholder={
                    prevForm.isMentor ? "XYZ Company" : "XYZ University"
                  }
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  isValid={
                    prevForm.isMentor
                      ? formikProps.touched.company &&
                        !formikProps.errors.company
                      : formikProps.touched.companyOrSchool &&
                        !formikProps.errors.companyOrSchool
                  }
                  isInvalid={
                    prevForm.isMentor
                      ? formikProps.touched.company &&
                        !!formikProps.errors.company
                      : formikProps.touched.companyOrSchool &&
                        !!formikProps.errors.companyOrSchool
                  }
                  error={
                    prevForm.isMentor
                      ? formikProps.errors.company
                      : formikProps.errors.companyOrSchool
                  }
                  required={prevForm.isMentor}
                />
                <TextField
                  name="title"
                  label="Your Title"
                  type="text"
                  value={formikProps.values.title}
                  placeholder={prevForm.isMentor ? "UI/UX Designer" : "Student"}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  isValid={
                    formikProps.touched.title && !formikProps.errors.title
                  }
                  isInvalid={
                    formikProps.touched.title && !!formikProps.errors.title
                  }
                  error={formikProps.errors.title}
                  required
                />
                {prevForm.isMentor ? (
                  <Form.Group>
                    <Form.Label>
                      Professional Experience
                      <span style={{ color: "red" }}> *</span>
                    </Form.Label>
                    <div className="d-flex gap-4">
                      <Form.Control
                        style={{ borderColor: "#465FF180" }}
                        name="years"
                        type="number"
                        value={formikProps.values.years}
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        isValid={
                          formikProps.touched.years && !formikProps.errors.years
                        }
                        isInvalid={
                          formikProps.touched.years &&
                          !!formikProps.errors.years
                        }
                      />
                      <Form.Control
                        style={{ borderColor: "#465FF180" }}
                        name="months"
                        type="number"
                        value={formikProps.values.months}
                        onChange={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        isValid={
                          formikProps.touched.months &&
                          !formikProps.errors.months
                        }
                        isInvalid={
                          formikProps.touched.months &&
                          !!formikProps.errors.months
                        }
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {formikProps.errors.years ?? formikProps.errors.months}
                    </Form.Control.Feedback>
                  </Form.Group>
                ) : null}
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
    </Container>
  );
}
export default RegisterProfession;
