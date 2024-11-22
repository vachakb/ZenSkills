import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Authcard from "../components/Authcard";
import TextField from "../components/TextField";
import * as yup from "yup";
import { Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import useSession from "../hooks/useSession";

function RegisterProfession() {
  const prevForm = useLocation().state;

  const { session } = useSession();

  const isMentor = session.role === "mentor";

  const navigate = useNavigate();

  const schema = useMemo(() => {
    if (isMentor) {
      return yup.object({
        company: yup.string().required("This is a required field"),
        title: yup.string().required("This is a required field"),
        years: yup
          .number()
          .integer("This field must be an integer")
          .min(0, "This field must be equal or greater than 0")
          .required("This is a required field"),
        months: yup
          .number()
          .integer("This field must be an integer")
          .min(0, "This field must be equal or greater than 0")
          .required("This is a required field"),
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
                  name={isMentor ? "company" : "companyOrSchool"}
                  label={isMentor ? "Company" : "Company/School"}
                  type="text"
                  value={
                    isMentor
                      ? formikProps.values.company
                      : formikProps.values.companyOrSchool
                  }
                  placeholder={
                    isMentor ? "XYZ Company" : "XYZ University"
                  }
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  isValid={
                    isMentor
                      ? formikProps.touched.company &&
                        !formikProps.errors.company
                      : formikProps.touched.companyOrSchool &&
                        !formikProps.errors.companyOrSchool
                  }
                  isInvalid={
                    isMentor
                      ? formikProps.touched.company &&
                        !!formikProps.errors.company
                      : formikProps.touched.companyOrSchool &&
                        !!formikProps.errors.companyOrSchool
                  }
                  error={
                    isMentor
                      ? formikProps.errors.company
                      : formikProps.errors.companyOrSchool
                  }
                  required={isMentor}
                />
                <TextField
                  name="title"
                  label="Your Title"
                  type="text"
                  value={formikProps.values.title}
                  placeholder={isMentor ? "UI/UX Designer" : "Student"}
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
                {isMentor ? (
                  <div>
                    <Form.Label>
                      Professional Experience
                      <span style={{ color: "red" }}> *</span>
                    </Form.Label>
                    <div className="d-flex gap-4">
                      <Form.Group>
                        <Form.Control
                          style={{ borderColor: "#465FF180" }}
                          name="years"
                          type="number"
                          min="0"
                          value={formikProps.values.years}
                          onChange={formikProps.handleChange}
                          onBlur={formikProps.handleBlur}
                          isValid={
                            formikProps.touched.years &&
                            !formikProps.errors.years
                          }
                          isInvalid={
                            formikProps.touched.years &&
                            !!formikProps.errors.years
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {formikProps.errors.years}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group>
                        <Form.Control
                          style={{ borderColor: "#465FF180" }}
                          name="months"
                          type="number"
                          min="0"
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
                        <Form.Control.Feedback type="invalid">
                          {formikProps.errors.months}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </div>
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
