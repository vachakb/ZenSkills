import { Col, Container, Row, Form, Button } from "react-bootstrap";
import Authcard from "../components/Authcard";
import TextField from "../components/TextField";
import Select from "../components/Select";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import states from "../misc/states";
import languages from "../misc/languages";

function Verification() {
    const navigate = useNavigate();

    const schema = yup.object({
        work_email: yup.string().required("This is a required field"),
        work_email: yup.string().required("This is a required field"),
        gender: yup
            .string()
            .oneOf(["Male", "Female", "Other"], "This is a required field")
            .required("This is a required field"),
        language: yup.string().oneOf(languages, "This is a required field"),
        location: yup.string().oneOf(states, "This is a required field"),
    });

    return (
        <Container className="d-flex vh-100 p-0" fluid>
            <Col className="d-flex justify-content-center align-items-center">
                <Row>
                    <Formik
                        validationSchema={schema}
                        initialValues={{
                            name: "",
                            gender: "Gender",
                            language: "English",
                            location: "Location",
                        }}
                        onSubmit={(data) => {
                            navigate("/register/2", { state: data });
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
                                    options={["Male", "Female", "Other"]}
                                    placeholder="Gender"
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
                                <Select
                                    name="language"
                                    label="Preferred Language"
                                    value={formikProps.values.language}
                                    options={languages}
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
                                <Select
                                    name="location"
                                    label="Location"
                                    value={formikProps.values.location}
                                    options={states}
                                    placeholder="Location"
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
