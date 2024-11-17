import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Authcard from "../components/Authcard";
import TextField from "../components/TextField";
import Select from "../components/Select";
import * as yup from "yup";
import { Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";

function RegisterUserInfo() {
  const prevForm = useLocation().state;

  const navigate = useNavigate();

  const schema = yup.object({
    name: yup.string().required("This is a required field"),
    gender: yup
      .string()
      .oneOf(["Male", "Female", "Other"])
      .required("This is a required field"),
    language: yup.string().required("This is a required field"),
    location: yup.string().required("This is a required field"),
  });

  const email = prevForm?.email || "";

  return (
    <Container className="d-flex vh-100 p-0" fluid>
      <Col className="d-flex justify-content-center align-items-center">
        <Row>
          <Formik
            validationSchema={schema}
            initialValues={{
              name: "",
              gender: "Male",
              language: "",
              location: "",
            }}
            onSubmit={(data) => {
              navigate("/register/2", { state: { ...prevForm, ...data } });
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
                    1 / 3
                  </h6>
                  <h1 className="my-4 fw-bold">Customize your Profile</h1>
                </div>
                <TextField
                  name="name"
                  label="Name"
                  type="text"
                  value={formikProps.values.name}
                  placeholder="ABC"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  isValid={formikProps.touched.name && !formikProps.errors.name}
                  isInvalid={
                    formikProps.touched.name && !!formikProps.errors.name
                  }
                  error={formikProps.errors.name}
                  required
                />
                <Select
                  name="gender"
                  label="Gender"
                  value={formikProps.values.gender}
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  isValid={
                    formikProps.touched.gender && !formikProps.errors.gender
                  }
                  isInvalid={
                    formikProps.touched.gender && !!formikProps.errors.gender
                  }
                  error={formikProps.errors.gender}
                  required
                />
                <TextField
                  name="language"
                  label="Preferred Language"
                  type="text"
                  value={formikProps.values.language}
                  placeholder="English"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  isValid={
                    formikProps.touched.language && !formikProps.errors.language
                  }
                  isInvalid={
                    formikProps.touched.language &&
                    !!formikProps.errors.language
                  }
                  error={formikProps.errors.language}
                  required
                />
                <TextField
                  name="location"
                  label="Location"
                  type="text"
                  value={formikProps.values.location}
                  placeholder="Gujarat, India"
                  onChange={formikProps.handleChange}
                  onBlur={formikProps.handleBlur}
                  isValid={
                    formikProps.touched.location && !formikProps.errors.location
                  }
                  isInvalid={
                    formikProps.touched.location &&
                    !!formikProps.errors.location
                  }
                  error={formikProps.errors.location}
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
export default RegisterUserInfo;
